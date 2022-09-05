# Generate dotenv file

This action generates a dotenv file (for use in a GitHub Actions workflow).

It does so by running `envsubst` on a specified template file, which must
be included in source control.

## Inputs

### `template-path`

The path of the template file that will be used to generate the dotenv file.

### `output-path`

The path of the output dotenv file. Default: `'.env'`

### `secrets-access-token`

(Optional) The token used to access secrets via the
[GitHub Secrets API](https://docs.github.com/en/rest/actions/secrets#about-the-secrets-api).

By default, the dotenv file is generated based only on environment variables, which
can be specified in your workflow file
(see [https://docs.github.com/en/actions/learn-github-actions/environment-variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables)).
However, if an access token (with adequate permissions) is provided,
then this action falls back directly on GitHub Secrets for variable keys that are not found in the environment.

## Example usage

### `.github/workflows/[workflow].yml`

```yaml
name: Generate dotenv file
on: [push]
jobs:
  generate-dotenv-file:
    name: Generate dotenv file
    runs-on: ubuntu-latest
    env:
      OMITTED_VAR: asdf
      SHA: ${{ github.sha }}
    steps:
      - uses: actions/checkout@v3
      - uses: iacobfred/generate-dotenv@v1.0.0
        with:
          template-path: ".config/.env.template"
          output-path: ".env"
        env:
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
          VAR_TO_BE_RENAMED: ghjkl
```

### `.config/.env.template`

```sh
SHA=$SHA
SECRET_KEY=$SECRET_KEY
RENAMED_VAR=$VAR_TO_BE_RENAMED
NONSECRET_IMMUTABLE_VAR=12345
```

### Output: `.env`

```sh
SHA=5a4ac9002d0be2fb38bd78e4b4dbde5606d7042f
SECRET_KEY=Kt4Gn4XRgAMy7EHZPp
RENAMED_VAR=ghjkl
NONSECRET_IMMUTABLE_VAR=12345
```
