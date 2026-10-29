import * as ssm from 'aws-cdk-lib/aws-ssm';

/**
 * Properties for `SsmParameterHelper.writeToStringParameter`.
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
 * Properties for `SsmParameterHelper.writeToStringListParameter`.
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
