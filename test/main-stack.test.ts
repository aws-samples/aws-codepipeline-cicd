import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { MainStack } from '../lib/main-stack'

describe('Unit tests for the main stack in DEV', () => {
  const app = new cdk.App()
  const stack = new MainStack(app, 'Dev-MainStack')
  const template = Template.fromStack(stack)

  test('Event Bus has been created', () => {
    // Assessment
    template.hasResource('AWS::Events::EventBus', '')
  })

  test('MainStack has output', () => {
    // Assessment
    template.hasOutput('EventBusName', '')
  })

  // Summary checks
  test('Expected number of the event buses', () => {
    const expectedValue = 2 // Two event busses are expected
    template.resourceCountIs('AWS::Events::EventBus', expectedValue)
  })
})

describe('Unit tests for the main stack in PROD', () => {
  const app = new cdk.App()
  const stack = new MainStack(app, 'Prod-MainStack')
  const template = Template.fromStack(stack)

  test('Event Bus has been created', () => {
    // Assessment
    template.hasResource('AWS::Events::EventBus', '')
  })

  test('MainStack has output', () => {
    // Assessment
    template.hasOutput('EventBusName', '')
  })

  // Summary checks
  test('Expected number of the event buses', () => {
    const expectedValue = 1 // Only one event bus is expected
    template.resourceCountIs('AWS::Events::EventBus', expectedValue)
  })
})
