const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../structures/user');

const router = express.Router();
const client = new OAuth2Client('227209584109-ut44j08p0m1mrr70k0d6jhp3nus7rgc6.apps.googleusercontent.com');

const rename = {
    "Katarina":"Ainsel",
    "Eric":"Sylvan",
    "Leia":"Raine",
    "Alisha":"Zaiga",
};

function verifyToken(idToken){
    return new Promise((res, rej) => {
        client.verifyIdToken({
            idToken,
            audience: '227209584109-ut44j08p0m1mrr70k0d6jhp3nus7rgc6.apps.googleusercontent.com'
        }).then(e => {
            res(e.getPayload());
        }).catch(rej);
    });
}

router.get('/main', (req, res) => {
    res.render('login');
});

router.get('/callback', async (req, res) => {
    let verify = await verifyToken(req.query.id).catch(res.status(403).send);
    if(verify.email !== req.query.email) return res.sendStatus(400);
    if(!req.query.email.endsWith('khanlabschool.org')) return res.status(403).send("Error: You must log in with your Khan Lab School email. Please go back to https://klstwow.herokuapp.com/ and try again.");

    let firstname = req.query.user.split(" ")[0];
    if(Object.keys(rename).includes(firstname)) req.query.user = req.query.user.replace(firstname, rename[firstname]);
    
    let userdata = await User.register(req.query.user, req.config.allowingNewUsers);
    if(userdata.isBanned) return res.status(403).send("You have been banned. If you think this was a mistake, please contact us.");
    req.session.user = userdata;

    res.redirect('/');
});

module.exports = router;