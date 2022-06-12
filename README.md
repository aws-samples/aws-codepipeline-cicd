# AWS CodePipeline with CI/CD best practices
## Introduction
The intention of this sample is to put together [DevOps](https://aws.amazon.com/training/learn-about/devops/) CI/CD best practices and provide a sample for the [AWS CodePipeline](https://aws.amazon.com/codepipeline/).
After implementing this sample, you will get an AWS CodePipeline with linting, testing, security check, deployment and post-deployment process.

Target technology stack  

After execution of the CDK code, following type of resources gets generated:

* CodePipeline

CodePipeline is a continuous delivery service. It is triggered by code checked in into code commit repository. It compiles and packages the code. It deploys the code to various environments such as Development, Quality Assurance and Production. Approval is needed to promote the code from Development to Quality Assurance. Similarly, approval is needed to promote the code from Quality Assurance to Production. You can find more information in this [article](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html).

* CloudFormation stacks

The cloud formation stacks groups various AWS services in a collection which can be managed as a single unit. 
This stack creates the CodeCommit repository and the CI/CD pipeline consisting of CodePipeline. As a first step, on execution of CDK deploy command, "SampleRepository" gets created.

## Architecture
![pipepline](./docs/pipeline.png)

The resulting pipeline deploy solution to 3 stages:
* dev - active development stage
* test - for advanced testing and integration check
* prod - production environment

In the dev stage there are 3 steps `Liniting`, `Security` and `UnitTests`. These setups runs in parallel to speedup the process.
The pipeline will stop execution on each failed step.

## Prerequsites & Limitations

This project use AWS CDK v2 based on typescript. The developer laptop/computer should have following software.
* [cnf_nag](https://github.com/stelligent/cfn_nag) v0.8.10
* [git-remote-codecommit](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-git-remote-codecommit.html)
* [node](https://github.com/nvm-sh/nvm) v16.3.0
* [npm](https://github.com/nvm-sh/nvm) 7.15.1

Limitation

This project is based on [AWS CDK v2](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html) and uses TypeScript as a primary language.

### MacOS installing

Use following command to install required software for MacOS:
```
nvm install 16.3
brew install git-remote-codecommit
brew install ruby brew-gem
brew gem install cfn-nag
```

### AWS Cloud9 installing

Use following command to install required software for [Cloud9](https://aws.amazon.com/cloud9/):
```
gem install cfn-nag
```

To check installed versions use following commands
```
cfn_nag -v
node -v
npm -v
```
### AWS CLI SetUp

[Windows:Configure for HTTPS connections to your CodeCommit repositories](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-https-windows.html)
[Linux, macOS, Unix:Configure for HTTPS connections to your CodeCommit repositories](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-https-unixes.html)


## Inital deployment in the clean AWS account
Below you may find instructions for initial deployment in your AWS account

1. Clone this repository with following command.

```
git clone --depth 1 https://github.com/aws-samples/aws-codepipeline-cicd.git
cd ./aws-codepipeline-cicd
rm -rf ./.git
```

2. Connect to AWS account. It could be temporary security token or landing zone auth. Check that you are in the right account by following command:

```
AWS_REGION="eu-west-1"
ACCOUNT_NUMBER=$(aws sts get-caller-identity --query Account --output text)
echo "${ACCOUNT_NUMBER}"
```
Troubleshooting: Ensure that your IAM user is authorised for all actions (i.e. has permissions as cloudformation execution role, S3 Create Bucket, SSM put parameter, ECR create repository)

3. Prepare the AWS Account by following command

```
npm i
npm run cdk bootstrap "aws://${ACCOUNT_NUMBER}/${AWS_REGION}"
```
Confirm installation and complete the account preparation

4. Build stacks using following command

```
npm run cdk synth
```

You should see following output
```
Successfully synthesized to /Users/user/CodePipeline/cdk.out
Supply a stack id (CodePipeline, Dev-MainStack) to display its template.
```

5. Deploy the CodePipeline stack to create repository and pipeline for further execution

```
npm run cdk -- deploy CodePipeline --require-approval never
```

6. After deployment collect the repository name from the pipeline stack and set it as original for your folder.

```
RepoName=$(aws cloudformation describe-stacks --stack-name CodePipeline --query "Stacks[0].Outputs[?OutputKey=='RepositoryName'].OutputValue" --output text)
echo "${RepoName}"

#
git init
git branch -m master main
git remote add origin codecommit://${RepoName}
git add .
git commit -m "Initial commit"
git push -u origin main
```

Open [AWS CodePipeline](https://console.aws.amazon.com/codesuite/codepipeline/pipelines) page and follow the AWS CodePipeline execution.

## Development process via Pipeline

After initialisation you have complete CI/CD process with target to the `main` branch. As soon as you commit changes to the main branch the AWS CodePipeline will trigger and execute following sequence of actions:
1. Get your code from the AWS CodeCommit repository
2. Build your code
3. Update the pipeline itself (SelfMutate)
4. Execute 3 parallel jobs for `Liniting`, `Security` and `UnitTests` checks
5. In case of success the pipeline will deploy the Main stack with Infrastructure as Code example
6. Execute post-deployment check for deployed resources

## Development process via Makefile

To simplify development process and provide an ability to run tests locally we use a Makefile. The Makefile has same steps as AWS Codepipeline. A developer can execute the whole pipeline locally by command make, or execute individual step.

* Execute local pipeline: `make`
* Execute only unit testing: `make unittest`
* Deploy to the current account: `make deploy`
* Cleanup the environment: `make clean`

## Related Resources

* [Creating an IAM user in your AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
* [AWS CodePipeline documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
* [AWS CDK](https://aws.amazon.com/cdk/)


## Code of Conduct
This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.
