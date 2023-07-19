# intelli-mate

Yeay! You want to contribute to intelli-mate. That's amazing!
To smoothen everyone's experience involved with the project please take note of the following guidelines and rules.

## Found an Issue?

Thank you for reporting any issues you find. Any reported issue is a real help.

> intelli-mate issues

Please follow these guidelines when reporting issues (issue template is present):

- Provide a title in the format of `[Bug]: <short_description>` or `[Feature]: <short_description>`
- Tag your issue with the label `bug` or `enhancement` respectively
- Provide information about your system

In case of a `bug`:
- Provide a description of the current behaviour
- Provide the steps to reproduce or any media that allows us to better understand the issue
- Provide a description with the expected behaviour

In case of an `enhancement`:
- Provide a description with the motivation for the feature

## Want to contribute?

You consider contributing changes to intelli-mate – we dig that!
Please consider these guidelines when filing a pull request (PR template is present):

> intelli-mate pull requests

- Follow the [Coding Rules](#coding-rules)
- Follow the [Commit Rules](#commit-rules)
- Make sure you rebased the current main branch when filing the pull request
- Squash your commits when filing the pull request
- Provide a short title with a maximum of 100 characters
  - PR title should follow: `feat: <title>` or `bug: <title>`
- Provide a more detailed description containing
  - Type of PR
  - What you changed / Why is it needed
  - Link to issue it solves
  - Special notes for reviewers
- Set `intelli-mate` team as reviewer

## Coding Rules

To keep the code base of intelli-mate neat and tidy the following rules apply to every change

> Coding standards

- `prettier` is king
- `eslint` is a close second
- Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
- Be awesome

## Commit Rules

To help everyone with understanding the commit history of intelli-mate the following commit rules are enforced.

> Commit standards

- [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/)
- husky pre-commit hook available
- present tense
- maximum of 100 characters
- message format of `$type($scope): $message`
