const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const { execSync, spawnSync } = require('child_process');
const inquirer = require('inquirer');
const argv = require('minimist-argv');

['p', 'C', 'c', 'm', 't'].forEach(argKey => {
  if (argv[argKey]) {
    console.log(`Argument -${argKey} not supported`);
    process.exit(1);
  }
});

[
  'patch',
  'reuse-message',
  'reedit-message',
  'fixup',
  'squash',
  'message',
  'template',
  'amend',
].forEach(argKey => {
  if (argv[argKey]) {
    console.log(`Argument --${argKey} not supported`);
    process.exit(1);
  }
});

return inquirer.prompt([
    {
        type: 'list',
        name: 'type',
        message: 'type:',
        choices: [
          { name: 'feat: new feature for the user, not a new feature for build script', value: 'feat', short: 'feat' },
          { name: 'fix: bug fix for the user, not a fix to a build script', value: 'fix', short: 'fix' },
          { name: 'docs: changes to the documentation', value: 'docs', short: 'docs' },
          { name: 'style: formatting, missing semi colons, etc; no production code change', value: 'style', short: 'style' },
          { name: 'refactor: refactoring production code, eg. renaming a variable', value: 'refactor', short: 'refactor' },
          { name: 'test: adding missing tests, refactoring tests; no production code change', value: 'test', short: 'test' },
          { name: 'chore: updating tasks, dependencies etc; no production code change', value: 'chore', short: 'chore' },
        ],
    },
    {
        name: 'scope',
        message: 'scope:',
        default: '',
        filter: scope => scope.toLowerCase(),
    },
    {
        name: 'subject',
        message: 'subject:',
        default: '',
        filter: subject => subject.toLowerCase(),
    }
]).then(({ type, scope, subject }) => {
  const firstLine = `${type}${scope ? `(${scope})` : ''}: ${subject}`;

  if (firstLine.length > 70) {
    console.log(`First line too long, expecting less than 70 chars, got ${firstLine.length}`);
    process.exit(1);
  }

  writeFileSync('#temp_commit', firstLine);

  process.nextTick(() => {
    execSync('$EDITOR \\#temp_commit', { stdio: 'inherit' });

    const commitMsg = readFileSync('#temp_commit');
    unlinkSync('#temp_commit');

    if (!commitMsg) {
      console.log('Aborting, empty commit message.');
      process.exit(1);
    }

    spawnSync(
      'git',
      ['commit'].concat(process.argv.slice(2)),
      { stdio: 'inherit', input: commitMsg }
    );
  });
});
