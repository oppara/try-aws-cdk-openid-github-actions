import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class TryAwsCdkOpenidGithubActionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ec2.CfnVPC(this, 'Vpc', {
      cidrBlock: '10.0.0.0/16',
      tags: [
        { key: 'Name', value: 'try-aws-cdk-openid-github-actions-vpc' },
        { key: 'Env', value: 'try' }
      ]
    });
  }
}
