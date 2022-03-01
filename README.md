# try-aws-cdk-openid-github-actions

GitHub Actions の OpenID Connect を使用して AWS CDK で VPC を作成してみる。

## 1. VPC を作成する CDK を用意しておく。

<details>
<summary>開く</summary>

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

</details>

## 2. IDプロバイダの追加

[Create Identity Provider](https://console.aws.amazon.com/iamv2/home?#/identity_providers/create) へアクセス。

- Provider type：OpenID Connect
- Provider URL：https://token.actions.githubusercontent.com
- Audience：sts.amazonaws.com


## 3. IAM ポリシーの作成

cdk-deploy-policy
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```
必要に応じて権限は絞ること。

## 4. IAM ロールの割り当て

作成した ID プロバイダの詳細を表示し、右上の[ロールの割り当て]をクリック。
「新しいロールを作成」をチェックして、[次へ]をクリック。

「信頼されたエンティティタイプ」-> 「カスタム信頼ポリシー」をチェックして以下を入力し、[次へ]をクリック。
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "<IDプロバイダArn>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GitHubアカウント名>/<GitHubリポジトリ名>:ref:refs/heads/*"
        }
      }
    }
  ]
}
```

作成した `cdk-deploy-policy` にチェックを入れて、[次へ]をクリック。
ロール名 `cdk-openid-github-actions-role` を入力してロールを作成。

## 5. GitHub Actions の設定

https://github.com/oppara/try-aws-cdk-openid-github-actions/blob/main/.github/workflows/try.yaml


## 参考

- [GitHub ActionsでOpenID Connectを使用してAWS CDKのデプロイを実行してみた | DevelopersIO](https://dev.classmethod.jp/articles/deploying-the-aws-cdk-using-openid-connect-on-github-actions/)
- [summit-online-japan-cdk](https://catalog.us-east-1.prod.workshops.aws/workshops/99731164-1d19-4d2e-9319-727a130e2d57/ja-JP/20-typescript)
