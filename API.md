# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### WriteStringListParameterProps <a name="WriteStringListParameterProps" id="ssm-parameter-bridge.WriteStringListParameterProps"></a>

Properties for `writeStringListParameter`.

#### Initializer <a name="Initializer" id="ssm-parameter-bridge.WriteStringListParameterProps.Initializer"></a>

```typescript
import { WriteStringListParameterProps } from 'ssm-parameter-bridge'

const writeStringListParameterProps: WriteStringListParameterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#ssm-parameter-bridge.WriteStringListParameterProps.property.parameterName">parameterName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringListParameterProps.property.stringListValue">stringListValue</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringListParameterProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringListParameterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `parameterName`<sup>Required</sup> <a name="parameterName" id="ssm-parameter-bridge.WriteStringListParameterProps.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string

---

##### `stringListValue`<sup>Required</sup> <a name="stringListValue" id="ssm-parameter-bridge.WriteStringListParameterProps.property.stringListValue"></a>

```typescript
public readonly stringListValue: string[];
```

- *Type:* string[]

---

##### `description`<sup>Optional</sup> <a name="description" id="ssm-parameter-bridge.WriteStringListParameterProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `tags`<sup>Optional</sup> <a name="tags" id="ssm-parameter-bridge.WriteStringListParameterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### WriteStringParameterProps <a name="WriteStringParameterProps" id="ssm-parameter-bridge.WriteStringParameterProps"></a>

Properties for `writeStringParameter`.

#### Initializer <a name="Initializer" id="ssm-parameter-bridge.WriteStringParameterProps.Initializer"></a>

```typescript
import { WriteStringParameterProps } from 'ssm-parameter-bridge'

const writeStringParameterProps: WriteStringParameterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#ssm-parameter-bridge.WriteStringParameterProps.property.parameterName">parameterName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringParameterProps.property.stringValue">stringValue</a></code> | <code>string</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringParameterProps.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringParameterProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#ssm-parameter-bridge.WriteStringParameterProps.property.tier">tier</a></code> | <code>aws-cdk-lib.aws_ssm.ParameterTier</code> | *No description.* |

---

##### `parameterName`<sup>Required</sup> <a name="parameterName" id="ssm-parameter-bridge.WriteStringParameterProps.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string

---

##### `stringValue`<sup>Required</sup> <a name="stringValue" id="ssm-parameter-bridge.WriteStringParameterProps.property.stringValue"></a>

```typescript
public readonly stringValue: string;
```

- *Type:* string

---

##### `description`<sup>Optional</sup> <a name="description" id="ssm-parameter-bridge.WriteStringParameterProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `tags`<sup>Optional</sup> <a name="tags" id="ssm-parameter-bridge.WriteStringParameterProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `tier`<sup>Optional</sup> <a name="tier" id="ssm-parameter-bridge.WriteStringParameterProps.property.tier"></a>

```typescript
public readonly tier: ParameterTier;
```

- *Type:* aws-cdk-lib.aws_ssm.ParameterTier

---



