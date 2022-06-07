import { SecretValue, Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TestAppStage } from './test-app-stage';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from "aws-cdk-lib/pipelines";

/**
 * The stack that defines the application pipeline
 */
export class TestAppPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'TestAppPipeline',
      crossAccountKeys: true,

       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found
         input: CodePipelineSource.gitHub('biffgaut/test-app', 'main', {
          // This is optional
          authentication: SecretValue.secretsManager('github-pipeline-token'),
        }),
         
         // Install dependencies, build and run cdk synth
         commands: [
           'npm ci',
           'npm run build',
           'npx cdk synth'
         ],
       }),
    });

    const preProdStage = new TestAppStage(this, 'preprod',{
      env: { account: '515290864834', region: 'us-east-1' }
    });

    const prodStage = new TestAppStage(this, 'prahd',{
      env: { account: '491121372873', region: 'us-east-1' }
    });

    pipeline.addStage(preProdStage);

    pipeline.addStage(prodStage, {
      pre: [
        new ManualApprovalStep('PromoteToProd'),
      ],
    });
  }
}