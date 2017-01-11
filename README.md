# komet [![NPM version][npm-image]][npm-url]

Write intelligible commit messages, by answering questions

[![Circle ci Status][build-status-image]][build-status-url]
[![Dependency ci Status][dependencyci-image]][dependencyci-url]
[![Dependency Status][daviddm-image]][daviddm-url]

### Demo

![demo](http://gifyu.com/images/kometdemo_2.gif)

### Install

```sh
npm install --save-dev komet komet-karma
```

### Configuration
You have a file `.commitrc.js` at the root of your project.

This file contains an array of plugins:
```javascript
module.exports = [
  'karma',
]
```

### How to use

#### With [git hook](https://git-scm.com/docs/githooks#_prepare_commit_msg)

create `.git/hooks/prepare-commit-msg`

```
#!/bin/sh

# Allow to read user input, assigns stdin to keyboard
exec < /dev/tty

case "$2," in
  message,|template,|,)
    node_modules/.bin/prepare-commit-msg --path "$1"
    ;;
  *) ;;
esac

```

#### Direct use (requires global install)

```
commit
```

All args are passed to git commit.


#### With npm scripts `npm run commit`

Edit your package.json:

```json
{
    "scripts": {
        "commit": "commit",
    }
}

```

### Plugin

`questions` are the questions which are going to be asked to create your commit message (it uses [Inquirer](https://www.npmjs.com/package/inquirer#question))

`processAnswers` is a function which build and return the commit message.

You can check how works `karma` plugin [here](https://github.com/kometjs/komet-karma)


## Related

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) - Generate a changelog from git metadata
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [angular-precommit](https://github.com/ajoslin/angular-precommit) - Pre commit with angular conventions


[npm-image]: https://img.shields.io/npm/v/komet.svg?style=flat-square
[npm-url]: https://npmjs.org/package/komet
[daviddm-image]: https://david-dm.org/kometjs/komet.svg?style=flat-square
[daviddm-url]: https://david-dm.org/kometjs/komet
[dependencyci-image]: https://dependencyci.com/github/kometjs/komet/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/kometjs/komet
[build-status-image]: https://img.shields.io/circleci/project/kometjs/komet/master.svg?style=flat-square
[build-status-url]: https://circleci.com/gh/kometjs/komet
