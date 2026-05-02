# ssm-parameter-bridge

[![npm](https://img.shields.io/npm/v/ssm-parameter-bridge.svg)](https://www.npmjs.com/package/ssm-parameter-bridge)
[![build](https://github.com/gammarers-aws-cdk-bridges/ssm-parameter-bridge/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/gammarers-aws-cdk-bridges/ssm-parameter-bridge/actions/workflows/build.yml)
[![license: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Small helpers for reading and writing AWS Systems Manager (SSM) Parameter Store parameters in AWS CDK v2, with a consistent tagging convention. The public API uses **`readFrom*Parameter` / `writeTo*Parameter`** naming.

## Features

- Read SSM `String` parameters with `readFromStringParameter` (CloudFormation dynamic references; return value may be a CDK token)
- Read SSM `StringList` parameters with `readFromStringListParameter` (return value may include CDK tokens)
- Optionally validate Parameter Store value types at deploy time via `ssm.ParameterValueType`
- Create `String` / `StringList` parameters with `writeToStringParameter` / `writeToStringListParameter`
- Apply a default `ssm:managed-by=ssm-parameter-bridge` tag on created parameters, plus optional custom tags
- Expand a `StringList` token into a fixed-length CloudFormation `string[]` with `splitListTokenToStrings`

## Installation

Using npm:

```bash
npm install ssm-parameter-bridge
```

Using yarn:

```bash
yarn add ssm-parameter-bridge
```

## Usage

```ts
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Stack } from 'aws-cdk-lib';
import {
  readFromStringListParameter,
  readFromStringParameter,
  splitListTokenToStrings,
  writeToStringListParameter,
  writeToStringParameter,
} from 'ssm-parameter-bridge';

const stack = new Stack();

// Read a String parameter (optionally typed)
const imageId = readFromStringParameter(stack, '/my/ami', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);

// Read a StringList parameter (optionally typed). May contain a token.
const subnetsTokenList = readFromStringListParameter(stack, '/my/subnet-ids', ssm.ParameterValueType.STRING);

// If you need a fixed-length array at CloudFormation level:
const subnets = splitListTokenToStrings(subnetsTokenList, 3);

// Write parameters with default + custom tags
writeToStringParameter(stack, 'ParamString', {
  parameterName: '/my/app/value',
  stringValue: 'hello',
  tags: { env: 'dev' },
});

writeToStringListParameter(stack, 'ParamList', {
  parameterName: '/my/app/list',
  stringListValue: ['a', 'b'],
  tags: { team: 'platform' },
});
```

## Options

### `readFromStringParameter(scope, parameterName, type?)`

- `scope`: construct scope used to bind the lookup token
- `parameterName`: parameter name (for example, `/my/app/value`)
- `type` (optional): `ssm.ParameterValueType` to validate at deploy time
- returns: a `string` that may be a CDK token

### `readFromStringListParameter(scope, parameterName, type?)`

- `scope`: construct scope used to bind the lookup token
- `parameterName`: parameter name (for example, `/my/app/list`)
- `type` (optional): `ssm.ParameterValueType` to validate at deploy time
- returns: a `string[]` that may contain CDK tokens

### `writeToStringParameter(scope, id, props)`

- `scope`: construct scope to define the parameter in
- `id`: CDK construct id for the parameter resource
- `props.parameterName` (required): parameter name (for example, `/my/app/value`)
- `props.stringValue` (required): parameter value
- `props.description` (optional): parameter description
- `props.tier` (optional): SSM parameter tier (defaults to `STANDARD`)
- `props.tags` (optional): additional tags to apply (in addition to `ssm:managed-by`)

### `writeToStringListParameter(scope, id, props)`

- `scope`: construct scope to define the parameter in
- `id`: CDK construct id for the parameter resource
- `props.parameterName` (required): parameter name (for example, `/my/app/list`)
- `props.stringListValue` (required): list of strings
- `props.description` (optional): parameter description
- `props.tags` (optional): additional tags to apply (in addition to `ssm:managed-by`)

### `splitListTokenToStrings(listToken, length)`

- `listToken`: token list produced by an SSM StringList lookup
- `length` (required): fixed output length; must be an integer \(>= 0\) and known at synth time
- returns: a CloudFormation-level fixed-length `string[]`

## Requirements

- Node.js >= 20
- `aws-cdk-lib` ^2.232.0
- `constructs` ^10.5.1

## License

This project is licensed under the (Apache-2.0) License.
