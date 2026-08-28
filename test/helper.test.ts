import * as cdk from 'aws-cdk-lib';
import { Fn } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { SsmParameterHelper } from '../src';

describe('public api exports', () => {
  test('should expose static helpers on SsmParameterHelper', () => {
    expect(typeof SsmParameterHelper.readFromStringParameter).toBe('function');
    expect(typeof SsmParameterHelper.readFromStringListParameter).toBe('function');
    expect(typeof SsmParameterHelper.writeToStringParameter).toBe('function');
    expect(typeof SsmParameterHelper.writeToStringListParameter).toBe('function');
    expect(typeof SsmParameterHelper.splitListTokenToStrings).toBe('function');
  });

});

describe('SsmParameterHelper.splitListTokenToStrings', () => {
  test('should throw when length is not an integer >= 0', () => {
    expect(() => SsmParameterHelper.splitListTokenToStrings(['a'], -1)).toThrow(/length must be an integer >= 0/);
    expect(() => SsmParameterHelper.splitListTokenToStrings(['a'], 1.1)).toThrow(/length must be an integer >= 0/);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => SsmParameterHelper.splitListTokenToStrings(['a'], NaN as any)).toThrow(/length must be an integer >= 0/);
  });

  test('should return empty array when length is 0', () => {
    const selectSpy = jest.spyOn(Fn, 'select');
    try {
      expect(SsmParameterHelper.splitListTokenToStrings(['x', 'y'], 0)).toEqual([]);
      expect(selectSpy).not.toHaveBeenCalled();
    } finally {
      selectSpy.mockRestore();
    }
  });

  test('should select each index with Fn.select', () => {
    const listToken = ['token-list'];
    const selectSpy = jest.spyOn(Fn, 'select').mockImplementation(((index: number, list: string[]) => {
      return `selected:${index}:${list[0]}`;
    }) as unknown as typeof Fn.select);

    try {
      expect(SsmParameterHelper.splitListTokenToStrings(listToken, 3)).toEqual([
        'selected:0:token-list',
        'selected:1:token-list',
        'selected:2:token-list',
      ]);

      expect(selectSpy).toHaveBeenCalledTimes(3);
      expect(selectSpy).toHaveBeenNthCalledWith(1, 0, listToken);
      expect(selectSpy).toHaveBeenNthCalledWith(2, 1, listToken);
      expect(selectSpy).toHaveBeenNthCalledWith(3, 2, listToken);
    } finally {
      selectSpy.mockRestore();
    }
  });
});

describe('SsmParameterHelper.writeToStringParameter / writeToStringListParameter', () => {
  test('should add managed-by tag and custom tags', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    SsmParameterHelper.writeToStringParameter(stack, 'Param1', {
      parameterName: '/test/string',
      stringValue: 'value',
      tags: {
        env: 'test',
      },
    });

    SsmParameterHelper.writeToStringListParameter(stack, 'Param2', {
      parameterName: '/test/list',
      stringListValue: ['a', 'b'],
      tags: {
        team: 'platform',
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/string',
      Type: 'String',
      Value: 'value',
      Tags: {
        'ssm:managed-by': 'ssm-string-parameter-helper',
        'env': 'test',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/list',
      Type: 'StringList',
      Value: 'a,b',
      Tags: {
        'ssm:managed-by': 'ssm-string-parameter-helper',
        'team': 'platform',
      },
    });
  });

  test('should apply only managed-by tag when tags are omitted', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'NoTagsStack');

    SsmParameterHelper.writeToStringParameter(stack, 'ParamString', {
      parameterName: '/test/string-no-tags',
      stringValue: 'value',
    });

    SsmParameterHelper.writeToStringListParameter(stack, 'ParamList', {
      parameterName: '/test/list-no-tags',
      stringListValue: ['a', 'b'],
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/string-no-tags',
      Type: 'String',
      Tags: {
        'ssm:managed-by': 'ssm-string-parameter-helper',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/list-no-tags',
      Type: 'StringList',
      Tags: {
        'ssm:managed-by': 'ssm-string-parameter-helper',
      },
    });
  });

  test('should set description on String and StringList parameters', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'DescriptionStack');

    SsmParameterHelper.writeToStringParameter(stack, 'ParamString', {
      parameterName: '/test/string-desc',
      stringValue: 'value',
      description: 'string parameter description',
    });

    SsmParameterHelper.writeToStringListParameter(stack, 'ParamList', {
      parameterName: '/test/list-desc',
      stringListValue: ['a', 'b'],
      description: 'list parameter description',
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/string-desc',
      Type: 'String',
      Description: 'string parameter description',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/list-desc',
      Type: 'StringList',
      Description: 'list parameter description',
    });
  });

  test('should default tier to STANDARD for String parameter', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TierStack');

    SsmParameterHelper.writeToStringParameter(stack, 'Param', {
      parameterName: '/test/tier',
      stringValue: 'value',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/tier',
      Tier: 'Standard',
    });
  });

  test('should use custom tier for String parameter', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'CustomTierStack');

    SsmParameterHelper.writeToStringParameter(stack, 'Param', {
      parameterName: '/test/custom-tier',
      stringValue: 'value',
      tier: ssm.ParameterTier.ADVANCED,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/custom-tier',
      Tier: 'Advanced',
    });
  });
});

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Locate the CloudFormation SSM value parameter that CDK emits for a typed lookup.
 * Typed reads synthesize `AWS::SSM::Parameter::Value<T>` (not `{{resolve:ssm:name}}`,
 * which CDK uses for versioned or tokenized names).
 */
const findSsmLookupParameter = (
  templateJson: unknown,
  parameterName: string,
): { logicalId: string; type: string } => {
  if (!isRecord(templateJson) || !isRecord(templateJson.Parameters)) {
    throw new Error('template has no Parameters');
  }

  const matches: Array<{ logicalId: string; type: string }> = [];
  for (const [logicalId, spec] of Object.entries(templateJson.Parameters)) {
    if (!isRecord(spec)) {
      continue;
    }
    if (spec.Default !== parameterName || typeof spec.Type !== 'string') {
      continue;
    }
    matches.push({ logicalId, type: spec.Type });
  }

  if (matches.length !== 1) {
    throw new Error(`expected 1 SSM lookup parameter for ${parameterName}, found ${matches.length}`);
  }
  return matches[0];
};

describe('SsmParameterHelper.readFromStringParameter / readFromStringListParameter', () => {
  test('should synthesize an SSM string lookup as AWS::SSM::Parameter::Value<String>', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'ReadStringStack');

    const value = SsmParameterHelper.readFromStringParameter(stack, '/my/app/value');
    new cdk.CfnOutput(stack, 'StringValue', { value });

    expect(typeof value).toBe('string');
    expect(cdk.Token.isUnresolved(value)).toBe(true);

    const template = Template.fromStack(stack);
    const lookup = findSsmLookupParameter(template.toJSON(), '/my/app/value');
    expect(lookup.type).toBe('AWS::SSM::Parameter::Value<String>');
    expect(stack.resolve(value)).toEqual({ Ref: lookup.logicalId });
    template.hasOutput('StringValue', {
      Value: { Ref: lookup.logicalId },
    });
  });

  test.each([
    [ssm.ParameterValueType.STRING, 'AWS::SSM::Parameter::Value<String>'],
    [ssm.ParameterValueType.AWS_EC2_IMAGE_ID, 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>'],
    [ssm.ParameterValueType.AWS_EC2_SUBNET_ID, 'AWS::SSM::Parameter::Value<AWS::EC2::Subnet::Id>'],
  ] as const)('should reflect ParameterValueType %s on the string lookup template', (valueType, expectedCfnType) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'ReadTypedStringStack');
    const parameterName = '/typed/string';

    const value = SsmParameterHelper.readFromStringParameter(stack, parameterName, valueType);
    new cdk.CfnOutput(stack, 'TypedStringValue', { value });

    expect(typeof value).toBe('string');

    const template = Template.fromStack(stack);
    const lookup = findSsmLookupParameter(template.toJSON(), parameterName);
    expect(lookup.type).toBe(expectedCfnType);
    expect(stack.resolve(value)).toEqual({ Ref: lookup.logicalId });
    template.hasOutput('TypedStringValue', {
      Value: { Ref: lookup.logicalId },
    });
  });

  test('should synthesize an SSM string list lookup as AWS::SSM::Parameter::Value<List<String>>', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'ReadListStack');

    const values = SsmParameterHelper.readFromStringListParameter(stack, '/my/app/list');
    new cdk.CfnOutput(stack, 'ListValue', { value: Fn.join(',', values) });

    expect(Array.isArray(values)).toBe(true);
    expect(cdk.Token.isUnresolved(values)).toBe(true);

    const template = Template.fromStack(stack);
    const lookup = findSsmLookupParameter(template.toJSON(), '/my/app/list');
    expect(lookup.type).toBe('AWS::SSM::Parameter::Value<List<String>>');
    expect(stack.resolve(values)).toEqual({ Ref: lookup.logicalId });
    template.hasOutput('ListValue', {
      Value: { 'Fn::Join': [',', { Ref: lookup.logicalId }] },
    });
  });

  test.each([
    [ssm.ParameterValueType.STRING, 'AWS::SSM::Parameter::Value<List<String>>'],
    [ssm.ParameterValueType.AWS_EC2_IMAGE_ID, 'AWS::SSM::Parameter::Value<List<AWS::EC2::Image::Id>>'],
    [ssm.ParameterValueType.AWS_EC2_SUBNET_ID, 'AWS::SSM::Parameter::Value<List<AWS::EC2::Subnet::Id>>'],
  ] as const)('should reflect ParameterValueType %s on the string list lookup template', (valueType, expectedCfnType) => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'ReadTypedListStack');
    const parameterName = '/typed/list';

    const values = SsmParameterHelper.readFromStringListParameter(stack, parameterName, valueType);
    new cdk.CfnOutput(stack, 'TypedListValue', { value: Fn.join(',', values) });

    expect(Array.isArray(values)).toBe(true);

    const template = Template.fromStack(stack);
    const lookup = findSsmLookupParameter(template.toJSON(), parameterName);
    expect(lookup.type).toBe(expectedCfnType);
    expect(stack.resolve(values)).toEqual({ Ref: lookup.logicalId });
    template.hasOutput('TypedListValue', {
      Value: { 'Fn::Join': [',', { Ref: lookup.logicalId }] },
    });
  });
});
