import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SnsToSqs } from '@aws-solutions-constructs/aws-sns-sqs';

export class TestAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myQueue = new sqs.Queue(this, "existingQueue");
    new SnsToSqs(this, 'NewConstruct', {
      existingQueueObj: myQueue
    });
  }
}
