import * as cdk from 'aws-cdk-lib';
import { Fn } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {
  readStringListParameter,
  readStringParameter,
  splitTokenListToStrings,
  writeStringListParameter,
  writeStringParameter,
} from '../src';

describe('public api exports', () => {
  test('exports exist', () => {
    expect(typeof writeStringParameter).toBe('function');
    expect(typeof writeStringListParameter).toBe('function');
    expect(typeof readStringParameter).toBe('function');
    expect(typeof readStringListParameter).toBe('function');
    expect(typeof splitTokenListToStrings).toBe('function');
  });
});

describe('splitTokenListToStrings', () => {
  test('throws when length is not an integer >= 0', () => {
    expect(() => splitTokenListToStrings(['a'], -1)).toThrow(/length must be an integer >= 0/);
    expect(() => splitTokenListToStrings(['a'], 1.1)).toThrow(/length must be an integer >= 0/);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => splitTokenListToStrings(['a'], NaN as any)).toThrow(/length must be an integer >= 0/);
  });

  test('returns empty array when length is 0', () => {
    const selectSpy = jest.spyOn(Fn, 'select');
    try {
      expect(splitTokenListToStrings(['x', 'y'], 0)).toEqual([]);
      expect(selectSpy).not.toHaveBeenCalled();
    } finally {
      selectSpy.mockRestore();
    }
  });

  test('selects each index with Fn.select', () => {
    const listToken = ['token-list'];
    const selectSpy = jest.spyOn(Fn, 'select').mockImplementation(((index: number, list: string[]) => {
      return `selected:${index}:${list[0]}`;
    }) as unknown as typeof Fn.select);

    try {
      expect(splitTokenListToStrings(listToken, 3)).toEqual([
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

describe('writeStringParameter / writeStringListParameter', () => {
  test('adds managed-by tag and custom tags', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    writeStringParameter(stack, 'Param1', {
      parameterName: '/test/string',
      stringValue: 'value',
      tags: {
        env: 'test',
      },
    });

    writeStringListParameter(stack, 'Param2', {
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
        'ssm:managed-by': 'ssm-parameter-bridge',
        'env': 'test',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/list',
      Type: 'StringList',
      Value: 'a,b',
      Tags: {
        'ssm:managed-by': 'ssm-parameter-bridge',
        'team': 'platform',
      },
    });
  });

  test('defaults tier to STANDARD for String parameter', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TierStack');

    writeStringParameter(stack, 'Param', {
      parameterName: '/test/tier',
      stringValue: 'value',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/test/tier',
      Tier: 'Standard',
    });
  });
});

describe('read helpers', () => {
  test('can be invoked in a CDK stack context', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'ReadStack');

    const typed = readStringParameter(stack, '/typed', ssm.ParameterValueType.STRING);
    const typedList = readStringListParameter(stack, '/typedList', ssm.ParameterValueType.STRING);

    expect(typeof typed).toBe('string');
    expect(Array.isArray(typedList)).toBe(true);
  });
});

