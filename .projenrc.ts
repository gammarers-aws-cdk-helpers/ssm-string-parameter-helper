import { ProjenCdkConstructLibrary } from '@gammarers/projen-projects';
const project = new ProjenCdkConstructLibrary({
  cdkVersion: '2.232.0',
  name: 'ssm-string-parameter-helper',
  description: 'Small helpers for reading and writing AWS Systems Manager (SSM) Parameter Store parameters in AWS CDK v2, with a consistent tagging convention.',
  keywords: ['aws', 'cdk', 'ssm', 'parameter', 'store', 'helper'],
  repositoryUrl: 'https://github.com/gammarers-aws-cdk-helpers/ssm-string-parameter-helper.git',
  devDeps: [
    '@gammarers/projen-projects@^0.5.0',
  ],
  releaseToNpm: true,
  npmTrustedPublishing: true,
});
project.synth();