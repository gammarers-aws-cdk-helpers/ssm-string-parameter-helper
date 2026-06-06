# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### WriteToStringListParameterProps <a name="WriteToStringListParameterProps" id="ssm-string-parameter-helper.WriteToStringListParameterProps"></a>

Properties for `writeToStringListParameter`.

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

### WriteToStringParameterProps <a name="WriteToStringParameterProps" id="ssm-string-parameter-helper.WriteToStringParameterProps"></a>

Properties for `writeToStringParameter`.

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



