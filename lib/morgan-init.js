const morgan = require('morgan');
const chalk = require('chalk');

chalk.enabled = true;
chalk.level = 3;

module.exports = morgan((token, req, res) => {
    return [
        req.statusCode < 400 
            ? chalk.greenBright(token.status(req, res)) 
            : chalk.redBright(token.status(req, res)),
        req.method === "POST" 
            ? chalk.magentaBright(token.method(req, res), token.url(req, res))
            : chalk.magenta(token.method(req, res), token.url(req, res)),
        req.session.user?.username 
            ? chalk.blueBright('as', req.session.user.username) 
            : chalk.redBright("as Unauthorized"),
    ].join(" ");
});