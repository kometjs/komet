import chalk from 'chalk';

export default {
    output(msg) {
        console.log(msg);
    },

    success(msg) {
        this.output(chalk.white.bold.bgGreen(` ${msg} `));
    },

    failure(msg) {
        this.output(chalk.white.bold.bgRed(` ${msg} `));
    },
}
