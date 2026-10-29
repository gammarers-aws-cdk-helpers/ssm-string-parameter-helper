import { Token } from 'aws-cdk-lib';

/**
 * Letters, digits, and the four SSM name symbols `.` `-` `_` `/`.
 *
 * Other characters are rejected here so both write APIs report the same error.
 */
const PARAMETER_NAME_CHARACTERS = /^[A-Za-z0-9._/-]+$/;

/**
 * Concrete parameter name and the CDK `simpleName` flag that matches its shape.
 *
 * @internal
 */
export interface WritableParameterName {
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
 */
const hasEmptyPathSegment = (parameterName: string): boolean => {
  if (parameterName.endsWith('/')) {
    return true;
  }

  return parameterName.includes('//');
};
