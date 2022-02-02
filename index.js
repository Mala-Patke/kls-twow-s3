const express = require('express');
const session = require('express-session');
const { join } = require('path');
const db = require('./database/dbwrapper');
const createVotingTables = require('./lib/tables');
const User = require('./lib/user');
const log = require('./lib/webhooklogger');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.disable('x-powered-by'); 

function handleError(e) {
    log(`Hey <@674140360079048714>, there's an error with TWOW: \`${e}.\` Check the logs for a stacktrace.`);
    console.error(e);
}

process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

app.use(async (req, res, next) => {
    try{
        //This is very inneficient. I do not like this
        req.config = await db.getConfig();
    } catch (e){
        next(e)
    }
    if(req.session.user) req.session.user = await User.build(req.session.user.id);
    next();
});

app.use(express.static(__dirname + '/public'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

function auth(req, res, next){
    if(!req.session.user) return res.redirect('/auth/main');
    next();
}

function restrict(req, res, next){
    if(!["Timothy Chien", "Ali Shahid"].includes(req.session.user.username)) return res.redirect('/');
    if(req.params.page) req.config.mode = req.params.page;
    next();
}

/**
 * Possible config modes
 * > Maintenance: Shows a "maintenance" screen. Does not log in
 * > Demo: Demo phase. Shows a "Competition will begin shortly" screen
 * > Respond: Prompt with input
 * > Vote: Voting UI
 */
function main(req, res) {
    if(req.config.mode === "maintenance") return res.sendFile(join(__dirname, 'public/maintenance.htm'));

    let swich = {
        "demo": () => {
            res.render('demo', { user: req.session.user });
        },
        "respond": () => {
            res.render('prompt', { round: req.config.round, prompt: req.config.prompt, user: req.session.user, leaderboard: req.config.leaderboard });
        },
        "vote": () => {
            db.getResponses(req.config.round)
            .then(resps => {
                let tables = createVotingTables(resps, req.config.round, req.session.user.id, req.config.resp_per_screen);
                res.render('voting', { tables, round: req.config.round, prompt: req.config.prompt, user: req.session.user, leaderboard: req.config.leaderboard });
            });
        }
    }
    swich[req.config.mode]();
}

app.get('/', auth, main);

app.get('/config', auth, restrict, (req, res) => {
    res.render('modview', { config: req.config });    
});

app.get('/test/:page', auth, restrict, main);

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
});