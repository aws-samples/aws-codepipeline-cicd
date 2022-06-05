#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CodePipelineStack } from '../lib/pipeline-stack'
import { MainStack } from '../lib/main-stack'
import { DefaultStackSynthesizer } from 'aws-cdk-lib'

const defaultStackSynthesizer = new DefaultStackSynthesizer({
	fileAssetsBucketName: 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}',
	bootstrapStackVersionSsmParameter: '/cdk-bootstrap/${Qualifier}/version',
})
const app = new cdk.App()
new CodePipelineStack(app, 'CodePipeline', {
	synthesizer: defaultStackSynthesizer,
})
new MainStack(app, 'Dev-MainStack')
