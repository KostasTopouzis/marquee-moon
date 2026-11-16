---
name: prepare-commit
description: Prepare the repository for a git commit by updating the changelog, version numbers and README, then propose a commit message and wait for approval. Approval will be indicated with the word 'Approve'. Does not commit on its own.
disable-model-invocation: true
---

## Prepare a commit

Perform the following steps in order. Do not run `git commit` until I explicitly approve.

### 1. Review the changes

Inspect the pending changes (`git status`, `git diff`, `git diff --staged`) and decide the new version number (patch, minor or major).

### 2. Update the changelog

The `docs/changelog/` folder contains .txt files in the format `changelog_0-x-x.txt`, `changelog_1-x-x.txt`, etc. Each file is a changelog devoted to the corresponding major release number of the application. Add an entry with a synopsis of the newest changes to the log for the current major version. If the change itself changes the major number, create a new changelog file in the same format.

Format:

```
vx.x.x: entry title | current timestamp

Category: [category of change]

- filename: short description of changes.
- filename2: etc.
...

Category: [category of change] // If some changes concern a separate issue

- filename: short description of changes.
...
```

Choose the category most fitting to the nature of the change by first consulting the following list:

Existing categories:

- architecture
- code formatting
- frontend
- tooling
- documentation

If no existing category is applicable, create a new fitting one for the change and add it to the list above (in this file).

### 3. Update version numbers

Update the version number in `package.json` and `package-lock.json`.

### 4. Update the README

In `README.md`, update the version number and the New Features section.

### 5. Propose the commit message

Follow the Git rules in `CLAUDE.md`. Show me the proposed message and a short summary of the files you changed, then stop and wait for my approval before committing.
