# try-aws-cdk-openid-github-actions

GitHub Actions の OpenID Connect を使用して AWS CDK のデプロイを実行してみる。

## VPC を作成する

プロジェクト作成する。

```
$ cdk init app --language typescript
```

eslint, prettier をインストールし、設定ファイルを作成する。
```
$ npm i --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
$ vim .eslint.yaml
```

アカウント/リージョンに初めてデプロイするので必要なリソースを作成する。
```
$ aws-vault exec oppara-dev -- cdk bootstrap
```

以下のリソースが作成された。
- AWS::ECR::Repository
- AWS::IAM::Policy
- AWS::IAM::Role
- AWS::S3::Bucket
- AWS::S3::BucketPolicy
- AWS::SSM::Parameter


リソースを作成する。
```
$ aws-vault exec oppara-dev -- cdk deploy
```

リソースを削除する。
```
$ aws-vault exec oppara-dev -- cdk destroy
```

