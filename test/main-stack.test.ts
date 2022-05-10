import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { MainStack } from '../lib/main-stack'

test('Event Bus has been created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new MainStack(app, 'MainStack')
  // THEN
  const template = Template.fromStack(stack)
  // Assessment
  template.hasResource('AWS::Events::EventBus', '')
})

test('MainStack has output', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new MainStack(app, 'MainStack')
  // THEN
  const template = Template.fromStack(stack)
  // Assessment
  template.hasOutput('EventBusName', '')
})
