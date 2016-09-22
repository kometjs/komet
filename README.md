# pob-commit

Commit with ease

Force to follow [karma commit message convention](http://karma-runner.github.io/1.0/dev/git-commit-msg.html)

### Install

```sh
npm install --g pob-commit
npm install --save-dev pob-commit
```

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
