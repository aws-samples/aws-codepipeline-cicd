#!/bin/bash

# Set exit on error
set -e

# If the STAGE set, then it is AWS CodePipeline, otherwise local execution
if [ -z "${STAGE}" ]
then
    echo "There is no STAGE variable found."
    echo "Make sure you deployed the stack manually"
    STAGE="Dev"
else
    echo "Testing for ${STAGE} stage"
fi

EventBusName=$(aws cloudformation describe-stacks --stack-name "${STAGE}-MainStack" --query "Stacks[0].Outputs[?OutputKey=='EventBusName'].OutputValue" --output text)
echo "${EventBusName}"
# It will throw an error if the eventbus does not exist
aws events describe-event-bus --name "${EventBusName}"
