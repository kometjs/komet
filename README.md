# pob-commit

Commit with ease

Force to follow [karma commit message convention](http://karma-runner.github.io/1.0/dev/git-commit-msg.html)

### Install

```sh
npm install --g pob-commit
npm install --save-dev pob-commit
```

### Configuration
You have a file `.commitrc.js` at the root of your project and at the root of your computer `~/.commitrc.js` for the global configurations (if you don't want to have a config file in each project).

This file contains 2fields:
```
questions: [],
processAnswers: function (answers, commitMsg) {},
```

`questions` are the questions which are going to be asked to create your commit message (it uses [Inquirer](https://www.npmjs.com/package/inquirer#question))

`processAnswers` is a function which build and return the commit message.

### How to use

#### Direct use

```
commit
```

All args are passed to git commit

#### With npm scripts `npm run commit`

Edit your package.json:

```json
{
    "scripts": {
        "commit": "commit",
    }
}

```
