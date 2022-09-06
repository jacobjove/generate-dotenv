# Generate dotenv file

This action generates a dotenv file (for use in a GitHub Actions workflow).

It does so by running `envsubst` on a specified template file, which must
be included in source control.

## Inputs

### `template-paths`

A space-delimited list of filepaths of the template files that will be used to generate the dotenv file.

This could be a single filepath (e.g., `'_.env'` or `'.env.template'`) or multiple filepaths (e.g., `'_.env _.env.prod'`).

If multiple paths are specified, the templates will be merged (with duplicate variable keys removed,
giving priority to the contents of the right-most paths) to produce the final dotenv file.
This can be useful for dynamically overriding a base dotenv template depending on the environment for which
the dotenv file is being produced.

### `output-path`

The path of the output dotenv file. Default: `'.env'`

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
          template-paths: ".config/_.env"
          output-path: ".env"
        env:
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
          VAR_TO_BE_RENAMED: ghjkl
```

### `.config/_.env`

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
