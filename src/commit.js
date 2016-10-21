/* eslint no-console: 'off' */
import argv from 'minimist-argv';
import { unlinkSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import prepareCommitMessage from './prepare-commit-msg';
import notification from './notifications';

export default function () {
  ['p', 'C', 'c', 'm', 't'].forEach((argKey) => {
    if (argv[argKey]) {
      notification.failure(`Argument -${argKey} not supported`);
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
  ].forEach((argKey) => {
    if (argv[argKey]) {
      notification.failure(`Argument --${argKey} not supported`);
      process.exit(1);
    }
  });

  argv.path = '#temp_commit';
  prepareCommitMessage()
    .then(() => {
      execSync('$EDITOR \\#temp_commit', { stdio: 'inherit' });

      spawnSync(
        'git',
        ['commit', `-F${argv.path}`].concat(process.argv.slice(2)),
        { stdio: 'inherit' },
      );
    })
    .then(() => {
      unlinkSync(argv.path);
    })
    .catch((msg) => {
      notification.failure(msg);
      process.exit(1);
    });
}
