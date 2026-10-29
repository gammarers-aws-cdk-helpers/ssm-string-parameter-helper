import { Fn, Tags, Token } from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

/** Tag key applied to every parameter this helper creates. */
const MANAGED_BY_TAG_KEY = 'ssm:managed-by';

/** Tag value applied to every parameter this helper creates. */
const MANAGED_BY_TAG_VALUE = 'ssm-string-parameter-helper';

/** Tier used when the caller omits `tier`. */
const DEFAULT_PARAMETER_TIER = ssm.ParameterTier.STANDARD;

/**
 * Letters, digits, and the four SSM name symbols `.` `-` `_` `/`.
 *
 * Other characters are rejected here so both write APIs report the same error.
 */
const PARAMETER_NAME_CHARACTERS = /^[A-Za-z0-9._/-]+$/;

/**
 * Apply the managed-by tag, then caller tags.
 *
 * Caller tags come second so a matching key replaces the default.
 *
 * @param resource Parameter construct to tag.
 * @param tags Optional caller tags applied after the managed-by tag.
 */
const applyParameterTags = (resource: Construct, tags?: Record<string, string>): void => {
  Tags.of(resource).add(MANAGED_BY_TAG_KEY, MANAGED_BY_TAG_VALUE);

  for (const [key, value] of Object.entries(tags ?? {})) {
    Tags.of(resource).add(key, value);
  }
};

/**
 * Concrete parameter name and the CDK `simpleName` flag that matches its shape.
 */
interface WritableParameterName {
  /**
   * Parameter name that passed validation.
   */
  readonly parameterName: string;

  /**
   * `true` when the name does not start with `/`.
   *
   * CDK uses this flag to place a single `/` separator in the parameter ARN.
   */
  readonly simpleName: boolean;
}

/**
 * Validate a parameter name and choose `simpleName` from its shape.
 *
 * A name with no leading `/` is a simple name (`simpleName: true`). A name that
 * starts with `/` is a path (`simpleName: false`). Empty path segments (`/`,
 * a trailing `/`, or `//`) pass CDK's character check and fail at deploy, so
 * they are rejected here. An unresolved token has no shape at synthesis.
 *
 * @param parameterName Parameter name to validate.
 * @returns The concrete name and the `simpleName` flag to pass to CDK.
 * @throws {Error} If the name is an unresolved token, empty, contains whitespace,
 * uses a disallowed character, contains `/` without a leading `/`, or has an empty path segment.
 * @internal
 */
export const resolveWritableParameterName = (parameterName: string): WritableParameterName => {
  if (Token.isUnresolved(parameterName)) {
    throw new Error('parameterName must be a concrete string');
  }

  if (parameterName.length === 0) {
    throw new Error('parameterName must not be empty');
  }

  if (/\s/.test(parameterName)) {
    throw new Error('parameterName must not contain whitespace');
  }

  if (!PARAMETER_NAME_CHARACTERS.test(parameterName)) {
    throw new Error(
      `parameterName must contain only letters, numbers, and the symbols . - _ /. Received: ${parameterName}`,
    );
  }

  const isPathName = parameterName.startsWith('/');

  if (isPathName && hasEmptyPathSegment(parameterName)) {
    throw new Error(
      `parameterName must be a fully qualified path without an empty segment. Received: ${parameterName}`,
    );
  }

  if (!isPathName && parameterName.includes('/')) {
    throw new Error(
      `parameterName must start with "/" when it contains "/". Received: ${parameterName}`,
    );
  }

  return {
    parameterName,
    simpleName: !isPathName,
  };
};

/**
 * Report a path whose segments are not all present.
 *
 * `/`, a trailing `/`, and `//` each leave an empty segment.
 *
 * @param parameterName Fully qualified parameter name.
 * @returns `true` when the path has an empty segment.
 */
const hasEmptyPathSegment = (parameterName: string): boolean => {
  if (parameterName.endsWith('/')) {
    return true;
  }

  return parameterName.includes('//');
};

/**
 * Reject StringList values that SSM cannot store as a stable list.
 *
 * CloudFormation receives one comma-separated string. An empty list is rejected
 * by SSM, and a comma inside a resolved value becomes an extra separator after deploy.
 * Unresolved CDK tokens are skipped because their text is not known at synth time.
 *
 * @param values Parameter values to validate.
 * @throws {Error} If `values` is empty, or a resolved element contains a comma.
 */
const assertWritableStringListValue = (values: string[]): void => {
  if (values.length === 0) {
    throw new Error('stringListValue must contain at least one value');
  }

  for (const [index, value] of values.entries()) {
    if (Token.isUnresolved(value)) {
      continue;
    }

    if (!value.includes(',')) {
      continue;
    }

    throw new Error(`stringListValue[${index}] must not contain a comma`);
  }
};

/**
 * Properties for {@link SsmParameterHelper.writeToStringParameter}.
 */
export interface WriteToStringParameterProps {
  /**
   * Concrete simple name (for example, `flatName`) or fully qualified path (for example, `/my/app/value`).
   *
   * A simple name is stored with `simpleName: true`.
   * The name must not be empty, contain whitespace, or include an empty path segment.
   */
  readonly parameterName: string;

  /**
   * Parameter value.
   */
  readonly stringValue: string;

  /**
   * Optional parameter description.
   */
  readonly description?: string;

  /**
   * Optional SSM parameter tier. Defaults to `STANDARD`.
   */
  readonly tier?: ssm.ParameterTier;

  /**
   * Optional additional tags to apply.
   */
  readonly tags?: Record<string, string>;
}

/**
 * Properties for {@link SsmParameterHelper.writeToStringListParameter}.
 */
export interface WriteToStringListParameterProps {
  /**
   * Concrete simple name (for example, `flatList`) or fully qualified path (for example, `/my/app/list`).
   *
   * A simple name is stored with `simpleName: true`.
   * The name must not be empty, contain whitespace, or include an empty path segment.
   */
  readonly parameterName: string;

  /**
   * Parameter values.
   *
   * Must contain at least one value. A resolved value must not contain a comma.
   * Unresolved CDK tokens are not inspected.
   */
  readonly stringListValue: string[];

  /**
   * Optional parameter description.
   */
  readonly description?: string;

  /**
   * Optional SSM parameter tier. Defaults to `STANDARD`.
   */
  readonly tier?: ssm.ParameterTier;

  /**
   * Optional additional tags to apply.
   */
  readonly tags?: Record<string, string>;
}

/**
 * Static helpers for reading and writing AWS Systems Manager (SSM) Parameter
 * Store parameters in AWS CDK.
 *
 * This class cannot be instantiated.
 */
export class SsmParameterHelper {
  /**
   * Read an SSM **String** parameter value via a CloudFormation dynamic reference.
   *
   * If `type` is provided, the Parameter Store value type is validated at deploy time.
   *
   * @param scope Construct scope used to bind the lookup token.
   * @param parameterName Parameter name (for example, `/my/app/value`).
   * @param type Optional Parameter Store value type to validate at deploy time.
   * @returns A string that may be a CDK token.
   */
  public static readFromStringParameter(
    scope: Construct,
    parameterName: string,
    type?: ssm.ParameterValueType,
  ): string {
    return ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, type);
  }

  /**
   * Read an SSM **StringList** parameter value.
   *
   * The return value is a `string[]` that may contain a CDK token.
   *
   * If `type` is provided, the Parameter Store value type is validated at deploy time.
   *
   * If you need a fixed-length `string[]` at CloudFormation level, combine this
   * with {@link SsmParameterHelper.splitListTokenToStrings}.
   *
   * @param scope Construct scope used to bind the lookup token.
   * @param parameterName Parameter name (for example, `/my/app/list`).
   * @param type Optional Parameter Store value type to validate at deploy time.
   * @returns A `string[]` that may contain CDK tokens.
   */
  public static readFromStringListParameter(
    scope: Construct,
    parameterName: string,
    type?: ssm.ParameterValueType,
  ): string[] {
    return ssm.StringListParameter.valueForTypedListParameter(scope, parameterName, type);
  }

  /**
   * Create an SSM **String** parameter and apply tags.
   *
   * A default tag of `ssm:managed-by=ssm-string-parameter-helper` is always added, and
   * `props.tags` are applied on top.
   *
   * `parameterName` must be a concrete simple name or a fully qualified path.
   * A name with no leading `/` is created with `simpleName: true`.
   *
   * @param scope Construct scope to define the parameter in.
   * @param id CDK construct id for the parameter resource.
   * @param props Parameter properties.
   * @returns The created `ssm.StringParameter`.
   * @throws {Error} If `parameterName` is an unresolved token, empty, contains whitespace,
   * uses a disallowed character, contains `/` without a leading `/`, or has an empty path segment.
   */
  public static writeToStringParameter(
    scope: Construct,
    id: string,
    props: WriteToStringParameterProps,
  ): ssm.StringParameter {
    const name = resolveWritableParameterName(props.parameterName);

    const param = new ssm.StringParameter(scope, id, {
      parameterName: name.parameterName,
      simpleName: name.simpleName,
      stringValue: props.stringValue,
      description: props.description,
      tier: props.tier ?? DEFAULT_PARAMETER_TIER,
    });

    applyParameterTags(param, props.tags);

    return param;
  }

  /**
   * Create an SSM **StringList** parameter and apply tags.
   *
   * A default tag of `ssm:managed-by=ssm-string-parameter-helper` is always added, and
   * `props.tags` are applied on top.
   *
   * `parameterName` must be a concrete simple name or a fully qualified path.
   * A name with no leading `/` is created with `simpleName: true`.
   *
   * `props.stringListValue` is written as one comma-separated string. The list must
   * contain at least one value. A resolved value must not contain a comma, because
   * that comma is treated as a separator after deploy. Unresolved CDK tokens in the
   * list are not inspected.
   *
   * @param scope Construct scope to define the parameter in.
   * @param id CDK construct id for the parameter resource.
   * @param props Parameter properties.
   * @returns The created `ssm.StringListParameter`.
   * @throws {Error} If `parameterName` is an unresolved token, empty, contains whitespace,
   * uses a disallowed character, contains `/` without a leading `/`, or has an empty path segment.
   * @throws {Error} If `stringListValue` is empty, or a resolved element contains a comma.
   */
  public static writeToStringListParameter(
    scope: Construct,
    id: string,
    props: WriteToStringListParameterProps,
  ): ssm.StringListParameter {
    const name = resolveWritableParameterName(props.parameterName);

    assertWritableStringListValue(props.stringListValue);

    const param = new ssm.StringListParameter(scope, id, {
      parameterName: name.parameterName,
      simpleName: name.simpleName,
      stringListValue: props.stringListValue,
      description: props.description,
      tier: props.tier ?? DEFAULT_PARAMETER_TIER,
    });

    applyParameterTags(param, props.tags);

    return param;
  }

  /**
   * Expand an SSM StringList token (a `string[]` that may contain a CDK token)
   * into a CloudFormation-level `string[]` of fixed length \(N\).
   *
   * - **length (N)** must be known at synth time.
   * - Intended to be used with the return value of
   *   `StringListParameter.valueForTypedListParameter()` (for example via
   *   {@link SsmParameterHelper.readFromStringListParameter}).
   *
   * @param listToken A token list returned from an SSM StringList lookup.
   * @param length Fixed output length \(N\) at CloudFormation level.
   * @returns A CloudFormation-level fixed-length `string[]`.
   * @throws {Error} If `length` is not an integer greater than or equal to 0.
   */
  public static splitListTokenToStrings(listToken: string[], length: number): string[] {
    if (!Number.isInteger(length) || length < 0) {
      throw new Error(`length must be an integer >= 0. Received: ${length}`);
    }

    if (length === 0) {
      // Fn.select has no index to read when the caller asked for an empty list.
      return [];
    }

    return Array.from({ length }, (_, i) => Fn.select(i, listToken));
  }

  private constructor() {
    // Static methods are the API. Reject `new` at runtime as well as in TypeScript.
    throw new Error('SsmParameterHelper cannot be instantiated');
  }
}
