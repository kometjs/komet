import notification from './notifications';

export commit from './commit';
export prepareCommitMessage from './prepare-commit-msg';

process.on('unhandledRejection', (err) => {
  notification.failure(err.message || err);
  process.exit(1);
});
