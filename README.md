# SSM String Parameter Helper (CDK v2)

[![npm version](https://img.shields.io/npm/v/ssm-string-parameter-helper?style=flat-square)](https://www.npmjs.com/package/ssm-string-parameter-helper)
[![license](https://img.shields.io/npm/l/ssm-string-parameter-helper?style=flat-square)](https://www.npmjs.com/package/ssm-string-parameter-helper)
[![Node.js](https://img.shields.io/node/v/ssm-string-parameter-helper?style=flat-square)](https://www.npmjs.com/package/ssm-string-parameter-helper)
[![build](https://img.shields.io/github/actions/workflow/status/gammarers-aws-cdk-helpers/ssm-string-parameter-helper/build.yml?label=build&style=flat-square)](https://github.com/gammarers-aws-cdk-helpers/ssm-string-parameter-helper/actions/workflows/build.yml)

[![View on Construct Hub](https://constructs.dev/badge?package=ssm-string-parameter-helper)](https://constructs.dev/packages/ssm-string-parameter-helper)

Small helpers for reading and writing AWS Systems Manager (SSM) Parameter Store parameters in AWS CDK v2, with a consistent tagging convention. The public API is exposed as static methods on `SsmParameterHelper` (jsii-compatible; the class cannot be instantiated).

## Features

- Read SSM `String` parameters with `SsmParameterHelper.readFromStringParameter` (CloudFormation dynamic references; return value may be a CDK token)
- Read SSM `StringList` parameters with `SsmParameterHelper.readFromStringListParameter` (return value may include CDK tokens)
- Optionally validate Parameter Store value types at deploy time via `ssm.ParameterValueType`
- Create `String` / `StringList` parameters with `SsmParameterHelper.writeToStringParameter` / `SsmParameterHelper.writeToStringListParameter`
- Apply a default `ssm:managed-by=ssm-string-parameter-helper` tag on created parameters, plus optional custom tags
- Expand a `StringList` token into a fixed-length CloudFormation `string[]` with `SsmParameterHelper.splitListTokenToStrings`

## How it works

Call a static method on `SsmParameterHelper` from a CDK stack.

Reads use CloudFormation dynamic references. The returned value may be a token and is resolved at deploy time. Pass `ssm.ParameterValueType` when deploy time should check the Parameter Store value type.

Writes create an SSM parameter and always add the tag `ssm:managed-by=ssm-string-parameter-helper`. Tags in `props.tags` are applied as well. `writeToStringListParameter` stores the list as one comma-separated string. The list must contain at least one value, and a resolved value must not contain a comma. Unresolved CDK tokens are not inspected.

`splitListTokenToStrings` turns a StringList token into a fixed-length `string[]`. The length must be an integer greater than or equal to 0 and known at synthesis.

This helper covers **String** and **StringList** only. It does not read or write `SecureString` parameters, and it does not resolve parameter values during `cdk synth`.

## Installation

### npm

```bash
npm install ssm-string-parameter-helper
```

### yarn

```bash
yarn add ssm-string-parameter-helper
```

### pnpm

```bash
pnpm add ssm-string-parameter-helper
```

## Usage

```ts
import { Stack } from 'aws-cdk-lib';
import { SsmParameterHelper } from 'ssm-string-parameter-helper';

const stack = new Stack();

SsmParameterHelper.writeToStringParameter(stack, 'ParamString', {
  parameterName: '/my/app/value',
  stringValue: 'hello',
});
```

### Typed reads and StringList values

```ts
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Stack } from 'aws-cdk-lib';
import { SsmParameterHelper } from 'ssm-string-parameter-helper';

const stack = new Stack();

const imageId = SsmParameterHelper.readFromStringParameter(stack, '/my/ami', ssm.ParameterValueType.AWS_EC2_IMAGE_ID);

const subnetsTokenList = SsmParameterHelper.readFromStringListParameter(stack, '/my/subnet-ids', ssm.ParameterValueType.STRING);
const subnets = SsmParameterHelper.splitListTokenToStrings(subnetsTokenList, 3);

SsmParameterHelper.writeToStringListParameter(stack, 'ParamList', {
  parameterName: '/my/app/list',
  stringListValue: ['a', 'b'],
  description: 'application list',
  tier: ssm.ParameterTier.STANDARD,
  tags: { team: 'platform' },
});
```

## Options

### `SsmParameterHelper.readFromStringParameter(scope, parameterName, type?)`

| Name | Required | Description |
| --- | --- | --- |
| `scope` | yes | Construct scope used to bind the lookup token. |
| `parameterName` | yes | Parameter name (for example, `/my/app/value`). |
| `type` | no | `ssm.ParameterValueType` validated at deploy time. |

Returns a `string` that may be a CDK token.

### `SsmParameterHelper.readFromStringListParameter(scope, parameterName, type?)`

| Name | Required | Description |
| --- | --- | --- |
| `scope` | yes | Construct scope used to bind the lookup token. |
| `parameterName` | yes | Parameter name (for example, `/my/app/list`). |
| `type` | no | `ssm.ParameterValueType` validated at deploy time. |

Returns a `string[]` that may contain CDK tokens.

### `SsmParameterHelper.writeToStringParameter(scope, id, props)`

| Name | Required | Description |
| --- | --- | --- |
| `scope` | yes | Construct scope to define the parameter in. |
| `id` | yes | CDK construct id for the parameter resource. |
| `props.parameterName` | yes | Parameter name (for example, `/my/app/value`). |
| `props.stringValue` | yes | Parameter value. |
| `props.description` | no | Parameter description. |
| `props.tier` | no | SSM parameter tier. Defaults to `STANDARD`. |
| `props.tags` | no | Additional tags, applied in addition to `ssm:managed-by=ssm-string-parameter-helper`. |

Returns the created `ssm.StringParameter`.

### `SsmParameterHelper.writeToStringListParameter(scope, id, props)`

| Name | Required | Description |
| --- | --- | --- |
| `scope` | yes | Construct scope to define the parameter in. |
| `id` | yes | CDK construct id for the parameter resource. |
| `props.parameterName` | yes | Parameter name (for example, `/my/app/list`). |
| `props.stringListValue` | yes | List of strings. Must contain at least one value. A resolved value must not contain a comma. Unresolved CDK tokens are not inspected. |
| `props.description` | no | Parameter description. |
| `props.tier` | no | SSM parameter tier. Defaults to `STANDARD`. |
| `props.tags` | no | Additional tags, applied in addition to `ssm:managed-by=ssm-string-parameter-helper`. |

Returns the created `ssm.StringListParameter`.

### `SsmParameterHelper.splitListTokenToStrings(listToken, length)`

| Name | Required | Description |
| --- | --- | --- |
| `listToken` | yes | Token list produced by an SSM StringList lookup. |
| `length` | yes | Fixed output length. Must be an integer greater than or equal to 0 and known at synthesis. |

Returns a CloudFormation-level fixed-length `string[]`.

## API

See [API.md](./API.md).

## Requirements

- Node.js >= 20.0.0
- `aws-cdk-lib` ^2.232.0
- `constructs` ^10.5.1

## License

This project is licensed under the (Apache-2.0) License.
