import { cdk, javascript, github } from 'projen';
const project = new cdk.JsiiProject({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  defaultReleaseBranch: 'main',
  typescriptVersion: '5.9.x',
  jsiiVersion: '5.9.x',
  name: 'ssm-parameter-bridge',
  packageManager: javascript.NodePackageManager.YARN_CLASSIC,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers-aws-cdk-bridges/ssm-parameter-bridge.git',
  releaseToNpm: false,
  // npmTrustedPublishing: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  mergify: true,
  minNodeVersion: '20.0.0',
  workflowNodeVersion: '24.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp({
      permissions: {
        pullRequests: github.workflows.AppPermission.WRITE,
        contents: github.workflows.AppPermission.WRITE,
        workflows: github.workflows.AppPermission.WRITE,
      },
    }),
  },
  autoApproveOptions: {
    allowedUsernames: [
      'gammarers-projen-upgrade-bot[bot]',
      'yicr',
    ],
  },
  jestOptions: {
    extraCliOptions: ['--silent'],
  },
  tsconfigDev: {
    compilerOptions: {
      strict: true,
    },
  },
});
project.addPackageIgnore('/.devcontainer');
project.synth();