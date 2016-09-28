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

#### Direct use (requires global install)

```
commit
```

All args are passed to git commit.

#### With [git hook](https://git-scm.com/docs/githooks#_prepare_commit_msg)

create `.git/hooks/prepare-commit-msg`

```
#!/bin/sh

# Allow to read user input, assigns stdin to keyboard
exec < /dev/tty

case "$2,$3" in
  ,)
    node_modules/.bin/prepare-commit-msg -- $1
    ;;
  *) ;;
esac

```

#### With npm scripts `npm run commit`

Edit your package.json:

```json
{
    "scripts": {
        "commit": "commit",
    }
}

```
