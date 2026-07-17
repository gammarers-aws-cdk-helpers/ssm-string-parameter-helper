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

describe('SsmParameterHelper.readFromStringParameter / readFromStringListParameter', () => {
  test('should be invokable in a CDK stack context', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'ReadStack');

    const typed = SsmParameterHelper.readFromStringParameter(stack, '/typed', ssm.ParameterValueType.STRING);
    const typedList = SsmParameterHelper.readFromStringListParameter(stack, '/typedList', ssm.ParameterValueType.STRING);

    expect(typeof typed).toBe('string');
    expect(Array.isArray(typedList)).toBe(true);
  });
});
