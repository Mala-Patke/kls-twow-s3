const express = require('express');
const session = require('express-session');
const { join } = require('path');
const db = require('./database/dbwrapper');
const User = require('./structures/user');
const createVotingTables = require('./structures/tables');
require('dotenv').config();

try{
    db.handleConfigUpdate(require('./config.json'));
} catch {}

const app = express();
app.set('view engine', 'ejs');
app.disable('x-powered-by'); 

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

    next();
});

app.use(express.static(__dirname + '/public'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

/**
 * Possible config modes
 * > Maintenance: Shows a "maintenance" screen. Does not require login
 * > Demo: Demo phase. Shows a "Competition will begin shortly" screen
 * > Respond: Prompt with input
 * > Vote: Voting UI
 */
app.get('/', (req, res) => {
    if(req.config.mode === "maintenance") return res.sendFile(join(__dirname, 'public/maintenance.htm'));
    if(!req.session.user) return res.redirect('/auth/main');

    let swich = {
        "demo": () => {
            res.render('demo', { user: req.session.user });
        },
        "respond": () => {
            res.render('prompt', { prompt: req.config.prompt, user: req.session.user });
        },
        "vote": () => {
            db.getResponses(req.config.round)
            .then(resps => {
                let tables = createVotingTables(resps, req.config.seed, req.config.resp_per_screen);
                res.render('voting', { tables, prompt: req.config.prompt, user: req.session.user });
            });
        }
    }
    swich[req.config.mode]();
});

app.get('faq', (req, res) => res.render('faq'));
app.get('tos', (req, res) => res.render('tos'));

app.get('/config', async (req, res) => {
    if(!req.session.user) return res.redirect('/auth/main');

    if(!["Timothy Chien", "Ali Shahid"].includes(req.session.user.username)) return res.redirect('/');
    res.render('modview', { config: req.config });    
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
})