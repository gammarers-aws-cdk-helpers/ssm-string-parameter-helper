import { Token } from 'aws-cdk-lib';

/**
 * Reject StringList values that SSM cannot store as a stable list.
 *
 * CloudFormation receives one comma-separated string. An empty list is rejected
 * by SSM, and a comma inside a resolved value becomes an extra separator after deploy.
 * Unresolved CDK tokens are skipped because their text is not known at synth time.
 *
 * @param values Parameter values to validate.
 * @throws {Error} If `values` is empty, or a resolved element contains a comma.
 * @internal
 */
export const assertWritableStringListValue = (values: string[]): void => {
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
