import * as cdk from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { CodePipelineStack } from '../lib/pipeline-stack'

describe('Unit tests for the pipeline stack', () => {
  const app = new cdk.App()
  const stack = new CodePipelineStack(app, 'CodePipeline')
  const template = Template.fromStack(stack)

  // Execute tests for CodePipeline template
  test('Pipeline restarts on update', () => {
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      RestartExecutionOnUpdate: true
    })
  })

  test('Key rotation is enabled', () => {
    template.hasResourceProperties('AWS::KMS::Key', {
      EnableKeyRotation: true
    })
  })

  test('Pipeline source settings', () => {
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        {
          Actions: [{
            ActionTypeId: {
              Category: 'Source',
              Owner: 'AWS',
              Provider: 'CodeCommit',
              Version: '1'
            },
            Configuration: {
              BranchName: 'main',
              PollForSourceChanges: false,
              RepositoryName: Match.anyValue()
            },
            Name: Match.anyValue(),
            OutputArtifacts: Match.anyValue(),
            RoleArn: Match.anyValue(),
            RunOrder: 1
          }],
          Name: 'Source'
        }]
      )
    })
  })

  test('Pipeline build settings', () => {
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        {
          Actions: [{
            ActionTypeId: {
              Category: 'Build',
              Owner: 'AWS',
              Provider: 'CodeBuild',
              Version: '1'
            },
            Configuration: Match.anyValue(),
            InputArtifacts: Match.anyValue(),
            Name: 'Synth',
            OutputArtifacts: [{ Name: 'Synth_Output' }],
            RoleArn: Match.anyValue(),
            RunOrder: 1
          }],
          Name: 'Build'
        }]
      )
    })
  })

  // Summary checks
  test('Expected number of the CodeBuild objects', () => {
    const expectedValue = 8
    template.resourceCountIs('AWS::CodeBuild::Project', expectedValue)
  })

  test('Expected number of the S3 buckets', () => {
    const expectedValue = 1
    template.resourceCountIs('AWS::S3::Bucket', expectedValue)
  })

  test('Expected number of IAM roles', () => {
    const expectedValue = 12
    template.resourceCountIs('AWS::IAM::Role', expectedValue)
  })
})
