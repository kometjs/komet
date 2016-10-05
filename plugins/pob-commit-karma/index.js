const regexp = /^(?:(feat|fix|docs|style|refactor|test|chore)?(?:\(([^)])*\))?:)?(.*)?([.\s]*)$/;

module.exports = (message = '') => {
  console.log(message);
  const [, type, scope, subject, anythingelse] = regexp.exec(message);
  return {
    questions: [
      {
        type: 'list',
        name: 'type',
        default: type,
        message: 'type:',
        choices: [
          {
            name: 'feat: new feature for the user, not a new feature for build script',
            value: 'feat',
            short: 'feat',
          },
          {
            name: 'fix: bug fix for the user, not a fix to a build script',
            value: 'fix',
            short: 'fix',
          },
          {
            name: 'docs: changes to the documentation',
            value: 'docs',
            short: 'docs',
          },
          {
            name: 'style: formatting, missing semi colons, etc; no production code change',
            value: 'style',
            short: 'style',
          },
          {
            name: 'refactor: refactoring production code, eg. renaming a variable',
            value: 'refactor',
            short: 'refactor',
          },
          {
            name: 'test: adding missing tests, refactoring tests; no production code change',
            value: 'test',
            short: 'test',
          },
          {
            name: 'chore: updating tasks, dependencies etc; no production code change',
            value: 'chore',
            short: 'chore',
          },
        ],
      },
      {
        name: 'scope',
        message: 'scope:',
        default: scope,
        filter: scope => scope.toLowerCase(),
      },
      {
        name: 'subject',
        message: 'subject:',
        default: subject,
        filter: subject => subject.toLowerCase(),
      },
    ],

    processAnswers({ type, scope, subject }) {
      const firstLine = `${type}${scope ? `(${scope})` : ''}: ${subject}`;

      if (firstLine.length > 70) {
        console.log(`First line too long, expecting less than 70 chars, got ${firstLine.length}`);
        process.exit(1);
      }

      return firstLine + (anythingelse ? `\n${anythingelse}` : '');
    },
  };
};
