# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### WriteToStringListParameterProps <a name="WriteToStringListParameterProps" id="ssm-string-parameter-helper.WriteToStringListParameterProps"></a>

Properties for `SsmParameterHelper.writeToStringListParameter`.

#### Initializer <a name="Initializer" id="ssm-string-parameter-helper.WriteToStringListParameterProps.Initializer"></a>

```typescript
import { WriteToStringListParameterProps } from 'ssm-string-parameter-helper'

const writeToStringListParameterProps: WriteToStringListParameterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#ssm-string-parameter-helper.WriteToStringListParameterProps.property.parameterName">parameterName</a></code> | <code>string</code> | Parameter name (for example, `/my/app/list`). |
| <code><a href="#ssm-string-parameter-helper.WriteToStringListParameterProps.property.stringListValue">stringListValue</a></code> | <code>string[]</code> | Parameter values. |
| <code><a href="#ssm-string-parameter-helper.WriteToStringListParameterProps.property.description">description</a></code> | <code>string</code> | Optional parameter description. |
| <code><a href="#ssm-string-parameter-helper.WriteToStringListParameterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Optional additional tags to apply. |
| <code><a href="#ssm-string-parameter-helper.WriteToStringListParameterProps.property.tier">tier</a></code> | <code>aws-cdk-lib.aws_ssm.ParameterTier</code> | Optional SSM parameter tier. |

---

##### `parameterName`<sup>Required</sup> <a name="parameterName" id="ssm-string-parameter-helper.WriteToStringListParameterProps.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string

Parameter name (for example, `/my/app/list`).

---

##### `stringListValue`<sup>Required</sup> <a name="stringListValue" id="ssm-string-parameter-helper.WriteToStringListParameterProps.property.stringListValue"></a>

```typescript
public readonly stringListValue: string[];
```

- *Type:* string[]

Parameter values.

---

##### `description`<sup>Optional</sup> <a name="description" id="ssm-string-parameter-helper.WriteToStringListParameterProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Optional parameter description.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="ssm-string-parameter-helper.WriteToStringListParameterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Optional additional tags to apply.

---

##### `tier`<sup>Optional</sup> <a name="tier" id="ssm-string-parameter-helper.WriteToStringListParameterProps.property.tier"></a>

```typescript
public readonly tier: ParameterTier;
```

- *Type:* aws-cdk-lib.aws_ssm.ParameterTier

Optional SSM parameter tier.

Defaults to `STANDARD`.

---

### WriteToStringParameterProps <a name="WriteToStringParameterProps" id="ssm-string-parameter-helper.WriteToStringParameterProps"></a>

Properties for `SsmParameterHelper.writeToStringParameter`.

#### Initializer <a name="Initializer" id="ssm-string-parameter-helper.WriteToStringParameterProps.Initializer"></a>

```typescript
import { WriteToStringParameterProps } from 'ssm-string-parameter-helper'

const writeToStringParameterProps: WriteToStringParameterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#ssm-string-parameter-helper.WriteToStringParameterProps.property.parameterName">parameterName</a></code> | <code>string</code> | Parameter name (for example, `/my/app/value`). |
| <code><a href="#ssm-string-parameter-helper.WriteToStringParameterProps.property.stringValue">stringValue</a></code> | <code>string</code> | Parameter value. |
| <code><a href="#ssm-string-parameter-helper.WriteToStringParameterProps.property.description">description</a></code> | <code>string</code> | Optional parameter description. |
| <code><a href="#ssm-string-parameter-helper.WriteToStringParameterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Optional additional tags to apply. |
| <code><a href="#ssm-string-parameter-helper.WriteToStringParameterProps.property.tier">tier</a></code> | <code>aws-cdk-lib.aws_ssm.ParameterTier</code> | Optional SSM parameter tier. |

---

##### `parameterName`<sup>Required</sup> <a name="parameterName" id="ssm-string-parameter-helper.WriteToStringParameterProps.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string

Parameter name (for example, `/my/app/value`).

---

##### `stringValue`<sup>Required</sup> <a name="stringValue" id="ssm-string-parameter-helper.WriteToStringParameterProps.property.stringValue"></a>

```typescript
public readonly stringValue: string;
```

- *Type:* string

Parameter value.

---

##### `description`<sup>Optional</sup> <a name="description" id="ssm-string-parameter-helper.WriteToStringParameterProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Optional parameter description.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="ssm-string-parameter-helper.WriteToStringParameterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Optional additional tags to apply.

---

##### `tier`<sup>Optional</sup> <a name="tier" id="ssm-string-parameter-helper.WriteToStringParameterProps.property.tier"></a>

```typescript
public readonly tier: ParameterTier;
```

- *Type:* aws-cdk-lib.aws_ssm.ParameterTier

Optional SSM parameter tier.

Defaults to `STANDARD`.

---

## Classes <a name="Classes" id="Classes"></a>

### SsmParameterHelper <a name="SsmParameterHelper" id="ssm-string-parameter-helper.SsmParameterHelper"></a>

Static helpers for reading and writing AWS Systems Manager (SSM) Parameter Store parameters in AWS CDK.

This class cannot be instantiated.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#ssm-string-parameter-helper.SsmParameterHelper.readFromStringListParameter">readFromStringListParameter</a></code> | Read an SSM **StringList** parameter value. |
| <code><a href="#ssm-string-parameter-helper.SsmParameterHelper.readFromStringParameter">readFromStringParameter</a></code> | Read an SSM **String** parameter value via a CloudFormation dynamic reference. |
| <code><a href="#ssm-string-parameter-helper.SsmParameterHelper.splitListTokenToStrings">splitListTokenToStrings</a></code> | Expand an SSM StringList token (a `string[]` that may contain a CDK token) into a CloudFormation-level `string[]` of fixed length \(N\). |
| <code><a href="#ssm-string-parameter-helper.SsmParameterHelper.writeToStringListParameter">writeToStringListParameter</a></code> | Create an SSM **StringList** parameter and apply tags. |
| <code><a href="#ssm-string-parameter-helper.SsmParameterHelper.writeToStringParameter">writeToStringParameter</a></code> | Create an SSM **String** parameter and apply tags. |

---

##### `readFromStringListParameter` <a name="readFromStringListParameter" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringListParameter"></a>

```typescript
import { SsmParameterHelper } from 'ssm-string-parameter-helper'

SsmParameterHelper.readFromStringListParameter(scope: Construct, parameterName: string, type?: ParameterValueType)
```

Read an SSM **StringList** parameter value.

The return value is a `string[]` that may contain a CDK token.

If `type` is provided, the Parameter Store value type is validated at deploy time.

If you need a fixed-length `string[]` at CloudFormation level, combine this
with `SsmParameterHelper.splitListTokenToStrings`.

###### `scope`<sup>Required</sup> <a name="scope" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringListParameter.parameter.scope"></a>

- *Type:* constructs.Construct

Construct scope used to bind the lookup token.

---

###### `parameterName`<sup>Required</sup> <a name="parameterName" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringListParameter.parameter.parameterName"></a>

- *Type:* string

Parameter name (for example, `/my/app/list`).

---

###### `type`<sup>Optional</sup> <a name="type" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringListParameter.parameter.type"></a>

- *Type:* aws-cdk-lib.aws_ssm.ParameterValueType

Optional Parameter Store value type to validate at deploy time.

---

##### `readFromStringParameter` <a name="readFromStringParameter" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringParameter"></a>

```typescript
import { SsmParameterHelper } from 'ssm-string-parameter-helper'

SsmParameterHelper.readFromStringParameter(scope: Construct, parameterName: string, type?: ParameterValueType)
```

Read an SSM **String** parameter value via a CloudFormation dynamic reference.

If `type` is provided, the Parameter Store value type is validated at deploy time.

###### `scope`<sup>Required</sup> <a name="scope" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringParameter.parameter.scope"></a>

- *Type:* constructs.Construct

Construct scope used to bind the lookup token.

---

###### `parameterName`<sup>Required</sup> <a name="parameterName" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringParameter.parameter.parameterName"></a>

- *Type:* string

Parameter name (for example, `/my/app/value`).

---

###### `type`<sup>Optional</sup> <a name="type" id="ssm-string-parameter-helper.SsmParameterHelper.readFromStringParameter.parameter.type"></a>

- *Type:* aws-cdk-lib.aws_ssm.ParameterValueType

Optional Parameter Store value type to validate at deploy time.

---

##### `splitListTokenToStrings` <a name="splitListTokenToStrings" id="ssm-string-parameter-helper.SsmParameterHelper.splitListTokenToStrings"></a>

```typescript
import { SsmParameterHelper } from 'ssm-string-parameter-helper'

SsmParameterHelper.splitListTokenToStrings(listToken: string[], length: number)
```

Expand an SSM StringList token (a `string[]` that may contain a CDK token) into a CloudFormation-level `string[]` of fixed length \(N\).

**length (N)** must be known at synth time.
- Intended to be used with the return value of
  `StringListParameter.valueForTypedListParameter()` (for example via
  `SsmParameterHelper.readFromStringListParameter`).

###### `listToken`<sup>Required</sup> <a name="listToken" id="ssm-string-parameter-helper.SsmParameterHelper.splitListTokenToStrings.parameter.listToken"></a>

- *Type:* string[]

A token list returned from an SSM StringList lookup.

---

###### `length`<sup>Required</sup> <a name="length" id="ssm-string-parameter-helper.SsmParameterHelper.splitListTokenToStrings.parameter.length"></a>

- *Type:* number

Fixed output length \(N\) at CloudFormation level.

---

##### `writeToStringListParameter` <a name="writeToStringListParameter" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringListParameter"></a>

```typescript
import { SsmParameterHelper } from 'ssm-string-parameter-helper'

SsmParameterHelper.writeToStringListParameter(scope: Construct, id: string, props: WriteToStringListParameterProps)
```

Create an SSM **StringList** parameter and apply tags.

A default tag of `ssm:managed-by=ssm-string-parameter-helper` is always added, and
`props.tags` are applied on top.

###### `scope`<sup>Required</sup> <a name="scope" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringListParameter.parameter.scope"></a>

- *Type:* constructs.Construct

Construct scope to define the parameter in.

---

###### `id`<sup>Required</sup> <a name="id" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringListParameter.parameter.id"></a>

- *Type:* string

CDK construct id for the parameter resource.

---

###### `props`<sup>Required</sup> <a name="props" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringListParameter.parameter.props"></a>

- *Type:* <a href="#ssm-string-parameter-helper.WriteToStringListParameterProps">WriteToStringListParameterProps</a>

Parameter properties.

---

##### `writeToStringParameter` <a name="writeToStringParameter" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringParameter"></a>

```typescript
import { SsmParameterHelper } from 'ssm-string-parameter-helper'

SsmParameterHelper.writeToStringParameter(scope: Construct, id: string, props: WriteToStringParameterProps)
```

Create an SSM **String** parameter and apply tags.

A default tag of `ssm:managed-by=ssm-string-parameter-helper` is always added, and
`props.tags` are applied on top.

###### `scope`<sup>Required</sup> <a name="scope" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringParameter.parameter.scope"></a>

- *Type:* constructs.Construct

Construct scope to define the parameter in.

---

###### `id`<sup>Required</sup> <a name="id" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringParameter.parameter.id"></a>

- *Type:* string

CDK construct id for the parameter resource.

---

###### `props`<sup>Required</sup> <a name="props" id="ssm-string-parameter-helper.SsmParameterHelper.writeToStringParameter.parameter.props"></a>

- *Type:* <a href="#ssm-string-parameter-helper.WriteToStringParameterProps">WriteToStringParameterProps</a>

Parameter properties.

---




