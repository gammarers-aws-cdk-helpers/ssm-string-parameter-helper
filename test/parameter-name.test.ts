import { Token } from 'aws-cdk-lib';
import { resolveWritableParameterName } from '../src/ssm-parameter-helper';

describe('resolveWritableParameterName', () => {
  test('should reject an unresolved token', () => {
    const parameterName = Token.asString({ Ref: 'ParamName' });

    expect(() => resolveWritableParameterName(parameterName)).toThrow('parameterName must be a concrete string');
  });

  test('should reject an empty name', () => {
    expect(() => resolveWritableParameterName('')).toThrow('parameterName must not be empty');
  });

  test.each([
    ' ',
    '\t',
    '\n',
    ' flat',
    'flat ',
    'flat name',
    '/my app',
  ])('should reject whitespace in %j', (parameterName) => {
    expect(() => resolveWritableParameterName(parameterName)).toThrow('parameterName must not contain whitespace');
  });

  test.each([
    'foo@bar',
    'foo:bar',
    '名前',
  ])('should reject disallowed characters in %j', (parameterName) => {
    expect(() => resolveWritableParameterName(parameterName)).toThrow(
      `parameterName must contain only letters, numbers, and the symbols . - _ /. Received: ${parameterName}`,
    );
  });

  test.each([
    'foo/bar',
    'foo/bar/baz',
    'a//b',
  ])('should reject %j when "/" is present without a leading "/"', (parameterName) => {
    expect(() => resolveWritableParameterName(parameterName)).toThrow(
      `parameterName must start with "/" when it contains "/". Received: ${parameterName}`,
    );
  });

  test.each([
    '/',
    '/foo/',
    '/foo//bar',
    '//foo',
  ])('should reject an empty path segment in %j', (parameterName) => {
    expect(() => resolveWritableParameterName(parameterName)).toThrow(
      `parameterName must be a fully qualified path without an empty segment. Received: ${parameterName}`,
    );
  });

  test.each([
    { parameterName: 'flatName', simpleName: true },
    { parameterName: 'A1._-', simpleName: true },
    { parameterName: '/my/app/value', simpleName: false },
    { parameterName: '/flat', simpleName: false },
  ])('should resolve $parameterName with simpleName=$simpleName', ({ parameterName, simpleName }) => {
    expect(resolveWritableParameterName(parameterName)).toEqual({
      parameterName,
      simpleName,
    });
  });
});
