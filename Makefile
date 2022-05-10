# Execute a sequence of actions
all: warming build linting security unittest cooling

# Pipeline sequence
## The warming step pre-warms the evironment with:
warming:
	@echo "Start the project building"
	npm i

## This step builds applications and creates deliverable items
build:
	npm run cdk synth
## This step checks the code base with linting tools
linting:
	npm run eslint
## This step checks the code base with security tools
security:
	cfn_nag_scan -i ./cdk.out -t ..\*.template.json
## This step executes unit tests for the code base
unittest:
	npm run test

## This step cleans up the environment from the secret values
cooling:
	@echo "Finish the project building"

# Manual execution
## Cleanup the whole environment. Remove all temporary files
clean:
	git clean -xdf
## Deploy application to the AWS account.
deploy:
	npm run cdk -- deploy MainStack --require-approval never
## Execute integration tests for verification
validate:
	./test/test_validate.sh
