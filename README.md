# SSM Parameter Bridge (AWS CDK V2)

[![build](https://github.com/gammarers-aws-cdk-bridges/ssm-parameter-bridge/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/gammarers-aws-cdk-bridges/ssm-parameter-bridge/actions/workflows/build.yml)
[![license: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Small helpers for reading and writing AWS Systems Manager (SSM) Parameter Store parameters in AWS CDK v2, with a consistent tagging convention.

## Features

- Read SSM `String` and `StringList` parameters via CloudFormation dynamic references
- Optionally enforce Parameter Store value types at deploy time
- Create `String` / `StringList` parameters and apply a default `ssm:managed-by=ssm-parameter-bridge` tag (plus custom tags)
- Expand a `StringList` token into a fixed-length CloudFormation `string[]`

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
  readStringListParameter,
  readStringParameter,
  splitTokenListToStrings,
  writeStringListParameter,
  writeStringParameter,
} from 'ssm-parameter-bridge';

const stack = new Stack();

// Read a String parameter (optionally typed)
const imageId = readStringParameter(stack, '/my/ami', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);

// Read a StringList parameter (optionally typed). May contain a token.
const subnetsTokenList = readStringListParameter(stack, '/my/subnet-ids', ssm.ParameterValueType.STRING);

// If you need a fixed-length array at CloudFormation level:
const subnets = splitTokenListToStrings(subnetsTokenList, 3);

// Write parameters with default + custom tags
writeStringParameter(stack, 'ParamString', {
  parameterName: '/my/app/value',
  stringValue: 'hello',
  tags: { env: 'dev' },
});

writeStringListParameter(stack, 'ParamList', {
  parameterName: '/my/app/list',
  stringListValue: ['a', 'b'],
  tags: { team: 'platform' },
});
```

## Options

### `readStringParameter(scope, parameterName, type?)`

- `type` (optional): `ssm.ParameterValueType` to validate at deploy time

### `readStringListParameter(scope, parameterName, type?)`

- `type` (optional): `ssm.ParameterValueType` to validate at deploy time

### `writeStringParameter(scope, id, props)`

- `props.parameterName` (required): parameter name (e.g. `/my/app/value`)
- `props.stringValue` (required): string value
- `props.description` (optional): description
- `props.tier` (optional): SSM parameter tier (defaults to `STANDARD`)
- `props.tags` (optional): additional tags to apply

### `writeStringListParameter(scope, id, props)`

- `props.parameterName` (required): parameter name (e.g. `/my/app/list`)
- `props.stringListValue` (required): list of strings
- `props.description` (optional): description
- `props.tags` (optional): additional tags to apply

### `splitTokenListToStrings(listToken, length)`

- `length` (required): must be an integer \(>= 0\) and known at synth time

## Requirements

- Node.js >= 20
- `aws-cdk-lib` v2
- `constructs` v10

## License

This project is licensed under the (Apache-2.0) License.
