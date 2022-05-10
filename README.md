# AWS CodePipeline with complete CI/CD best practices

## Overview

[placeholder]

## Prerequsites

This project use AWS CDK v2 based on typescript. The developer laptop/computer should have following software.
* [git-remote-codecommit](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-git-remote-codecommit.html)
* [nmp](https://github.com/nvm-sh/nvm) v16.3.0
* [typescript](https://www.typescriptlang.org/) 4.6.2
* [aws cdk](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) 2.16.0
* [npm](https://github.com/nvm-sh/nvm) 7.15.1
* [cnf_nag](https://github.com/stelligent/cfn_nag)


Use following command to install required software for MacOS:
```
nvm install 16.3
brew install git-remote-codecommit
brew install ruby brew-gem
brew gem install cfn-nag
```

To check installed versions use following commands
```
cdk --version
tsc -v
node -v
npm -v
```

## Inital deployment in the clean AWS account
Below you may find instructions for initial deployment in your AWS account

1. Clone this repository with following command.

```
git clone --depth 1 git@ssh.gitlab.aws.dev:zarudk/CodePipeline.git AWSCodePipeline
cd ./AWSCodePipeline
rm -rf ./.git
```

2. Connect to AWS account. It could be temporary security token or landing zone auth. Check that you are in the right account by following command:

```
ACCOUNT_NUMBER=$(aws sts get-caller-identity --query Account --output text)
echo ${ACCOUNT_NUMBER}
```

3. Prepare the environment by following command

```
npm i
npm run cdk bootstrap aws://${ACCOUNT_NUMBER}/eu-west-1
```
Confirm installation and complete the account preparation

4. Build stacks using following command

```
npm run cdk synth
```

You should see following output
```
Successfully synthesized to /Users/user/CodePipeline/cdk.out
Supply a stack id (CodePipeline, Main) to display its template.
```

5. Deploy the CodePipeline stack to create repository and pipeline for further execution

```
npm run cdk -- deploy CodePipeline --require-approval never
```

6. After deployment collect the repository name from the pipeline stack and set it as original for your folder.

```
RepoName=$(aws cloudformation describe-stacks --stack-name CodePipeline --query "Stacks[0].Outputs[?OutputKey=='RepositoryName'].OutputValue" --output text)
echo ${RepoName}

#
git init
git branch -m master main
git remote add origin codecommit://${RepoName}
git add .
git commit -m "Initial commit"
git push -u origin main
```

Open [AWS CodePipeline](https://console.aws.amazon.com/codesuite/codepipeline/pipelines) page and follow the AWS CodePipeline execution.

## Development process
After initialisation you have complete CI/CD process with target to the `main` branch. As soon as you commit changes to the main branch the AWS CodePipeline will trigger and execute following sequence of actions:
1. Get your code from the AWS CodeCommit repository
2. Build your code
3. Update the pipeline itself (SelfMutate)
4. Execute 3 parallel jobs for `Liniting`, `Security` and `UnitTests` checks
5. In case of success the pipeline will deploy the Main stack with Infrastructure as Code example
6. Execute post-deployment check for deployed resources


## Code of Conduct
This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.
