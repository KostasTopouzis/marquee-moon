# General Instructions

## Git 

- Add a more verbose description after the short message only for great, multi-step changes.
- Wrap description in 72 characters maximum to follow best practices.

## Changelog folder

This folder contains .txt files in the format `changelog_0-x-x.txt`, `changelog_1-x-x.txt`, etc. Each file is a changelog devoted to the corresponding Major release number of the application. Before each git commit update the log for the current major number version (or, if the change itself changed that number, create a new changelog file in the same format). most fitting to the nature of the changes with a synopsis of the newest changes.

Format:

```
vx.x.x: entry title | Category: [category of change] | current timestamp

- filename: short description of changes.
- filename2: etc.
... 
```

Choose the category most fitting to the nature of the change by first consulting with the follow list: 

Existing categories: 

- architecture
- code formatting
- frontend

If no existing category is applicable, create a new fitting one for the change and include in the list above.

Don't forget to update the version number in `package-lock.json`, `package.json`, and `README.md`.
