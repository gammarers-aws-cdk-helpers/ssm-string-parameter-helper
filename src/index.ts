import { Fn, Tags } from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

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
export const readFromStringParameter = (scope: Construct, parameterName: string, type?: ssm.ParameterValueType): string => {
  return ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, type);
};

/**
 * Read an SSM **StringList** parameter value.
 *
 * The return value is a `string[]` that may contain a CDK token.
 *
 * If `type` is provided, the Parameter Store value type is validated at deploy time.
 *
 * If you need a fixed-length `string[]` at CloudFormation level, combine this
 * with `splitListTokenToStrings`.
 *
 * @param scope Construct scope used to bind the lookup token.
 * @param parameterName Parameter name (for example, `/my/app/list`).
 * @param type Optional Parameter Store value type to validate at deploy time.
 * @returns A `string[]` that may contain CDK tokens.
 */
export const readFromStringListParameter = (scope: Construct, parameterName: string, type?: ssm.ParameterValueType): string[] => {
  return ssm.StringListParameter.valueForTypedListParameter(scope, parameterName, type);
};

/**
 * Properties for `writeToStringParameter`.
 */
export interface WriteToStringParameterProps {
  /**
   * Parameter name (for example, `/my/app/value`).
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
 * Create an SSM **String** parameter and apply tags.
 *
 * A default tag of `ssm:managed-by=ssm-parameter-bridge` is always added, and
 * `props.tags` are applied on top.
 *
 * @param scope Construct scope to define the parameter in.
 * @param id CDK construct id for the parameter resource.
 * @param props Parameter properties.
 * @returns The created `ssm.StringParameter`.
 */
export const writeToStringParameter = (scope: Construct, id: string, props: WriteToStringParameterProps): ssm.StringParameter => {
  const param = new ssm.StringParameter(scope, id, {
    parameterName: props.parameterName,
    stringValue: props.stringValue,
    description: props.description,
    tier: props.tier ?? ssm.ParameterTier.STANDARD,
  });

  Tags.of(param).add('ssm:managed-by', 'ssm-parameter-bridge');
  for (const [k, v] of Object.entries(props.tags ?? {})) {
    Tags.of(param).add(k, v);
  }
  return param;
};

/**
 * Properties for `writeToStringListParameter`.
 */
export interface WriteToStringListParameterProps {
  /**
   * Parameter name (for example, `/my/app/list`).
   */
  readonly parameterName: string;
  /**
   * Parameter values.
   */
  readonly stringListValue: string[];
  /**
   * Optional parameter description.
   */
  readonly description?: string;
  /**
   * Optional additional tags to apply.
   */
  readonly tags?: Record<string, string>;
}

/**
 * Create an SSM **StringList** parameter and apply tags.
 *
 * A default tag of `ssm:managed-by=ssm-parameter-bridge` is always added, and
 * `props.tags` are applied on top.
 *
 * @param scope Construct scope to define the parameter in.
 * @param id CDK construct id for the parameter resource.
 * @param props Parameter properties.
 * @returns The created `ssm.StringListParameter`.
 */
export const writeToStringListParameter = (scope: Construct, id: string, props: WriteToStringListParameterProps): ssm.StringListParameter => {
  const param = new ssm.StringListParameter(scope, id, {
    parameterName: props.parameterName,
    stringListValue: props.stringListValue,
    description: props.description,
  });

  Tags.of(param).add('ssm:managed-by', 'ssm-parameter-bridge');
  for (const [k, v] of Object.entries(props.tags ?? {})) {
    Tags.of(param).add(k, v);
  }
  return param;
};

/**
 * Expand an SSM StringList token (a `string[]` that may contain a CDK token)
 * into a CloudFormation-level `string[]` of fixed length \(N\).
 *
 * - **length (N)** must be known at synth time.
 * - Intended to be used with the return value of
 *   `StringListParameter.valueForTypedListParameter()` (for example via
 *   `readFromStringListParameter`).
 *
 * @param listToken A token list returned from an SSM StringList lookup.
 * @param length Fixed output length \(N\) at CloudFormation level.
 * @returns A CloudFormation-level fixed-length `string[]`.
 */
export const splitListTokenToStrings = (listToken: string[], length: number): string[] => {
  if (!Number.isInteger(length) || length < 0) {
    throw new Error(`length must be an integer >= 0. Received: ${length}`);
  }
  if (length === 0) {
    return [];
  }
  return Array.from({ length }, (_, i) => Fn.select(i, listToken));
};
