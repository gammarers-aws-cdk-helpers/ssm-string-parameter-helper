import { Fn, Tags } from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

/**
 * Reads an SSM String parameter value via a CloudFormation dynamic reference.
 *
 * If `type` is provided, the Parameter Store type is validated at deploy time.
 */
export const readStringParameter = (scope: Construct, parameterName: string, type?: ssm.ParameterValueType): string => {
  return ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, type);
};

/**
 * Reads an SSM StringList parameter value.
 *
 * The return value is a `string[]` that may contain a CDK token.
 *
 * If `type` is provided, the Parameter Store type is validated at deploy time.
 *
 * If you need a fixed-length `string[]` at CloudFormation level, combine this
 * with `splitTokenListToStrings`.
 */
export const readStringListParameter = (scope: Construct, parameterName: string, type?: ssm.ParameterValueType): string[] => {
  return ssm.StringListParameter.valueForTypedListParameter(scope, parameterName, type);
};

/**
 * Properties for `writeStringParameter`.
 */
export interface WriteStringParameterProps {
  readonly parameterName: string;
  readonly stringValue: string;
  readonly description?: string;
  readonly tier?: ssm.ParameterTier;
  readonly tags?: Record<string, string>;
}

/**
 * Creates an SSM String parameter and applies tags.
 *
 * A default tag of `ssm:managed-by=ssm-parameter-bridge` is always added, and
 * `props.tags` are applied on top.
 */
export const writeStringParameter = (scope: Construct, id: string, props: WriteStringParameterProps): ssm.StringParameter => {
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
 * Properties for `writeStringListParameter`.
 */
export interface WriteStringListParameterProps {
  readonly parameterName: string;
  readonly stringListValue: string[];
  readonly description?: string;
  readonly tags?: Record<string, string>;
}

/**
 * Creates an SSM StringList parameter and applies tags.
 *
 * A default tag of `ssm:managed-by=ssm-parameter-bridge` is always added, and
 * `props.tags` are applied on top.
 */
export const writeStringListParameter = (scope: Construct, id: string, props: WriteStringListParameterProps): ssm.StringListParameter => {
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
 * Expands an SSM StringList token (a `string[]` that may contain a CDK token)
 * into a CloudFormation-level `string[]` of fixed length \(N\).
 *
 * - **length (N)** must be known at synth time.
 * - Intended to be used with the return value of
 *   `StringListParameter.valueForTypedListParameter()`.
 */
export const splitTokenListToStrings = (listToken: string[], length: number): string[] => {
  if (!Number.isInteger(length) || length < 0) {
    throw new Error(`length must be an integer >= 0. Received: ${length}`);
  }
  if (length === 0) {
    return [];
  }
  return Array.from({ length }, (_, i) => Fn.select(i, listToken));
};
