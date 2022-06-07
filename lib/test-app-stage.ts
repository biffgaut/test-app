import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TestAppStack } from './test-app-stack';

/**
 * Deployable unit of web service app
 */
export class TestAppStage extends Stage {
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new TestAppStack(this, 'MyStack');

  }
}