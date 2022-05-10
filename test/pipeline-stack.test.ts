import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { CodePipelineStack } from '../lib/pipeline-stack'

test('Pipeline has been created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new CodePipelineStack(app, 'CodePipeline')
  // THEN
  const template = Template.fromStack(stack)
  // Assessment
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    RestartExecutionOnUpdate: true
  })
})
