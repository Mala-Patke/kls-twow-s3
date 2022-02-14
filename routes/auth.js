const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../lib/user');

const router = express.Router();
const client = new OAuth2Client('227209584109-f54odnr6tn70muiu4fdqqrfbsbanm6cf.apps.googleusercontent.com');

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
            audience: '227209584109-f54odnr6tn70muiu4fdqqrfbsbanm6cf.apps.googleusercontent.com'
        }).then(e => {
            res(e.getPayload());
        }).catch(rej);
    });
}

router.get('/main', (req, res) => {
    res.render('login');
});

router.get('/callback', (req, res) => res.redirect("/"));

router.post('/callback', express.urlencoded(), async (req, res) => {
    let verify = await verifyToken(req.body.id).catch(res.status(403).send);
    if(verify.email !== req.body.email) return res.sendStatus(400);
    if(!req.body.email.endsWith('khanlabschool.org')) return res.status(403).send("Error: You must log in with your Khan Lab School email. Please go back to https://klstwow.herokuapp.com/ and try again.");

    let firstname = req.body.user.split(" ")[0];
    if(Object.keys(rename).includes(firstname)) req.body.user = req.body.user.replace(firstname, rename[firstname]);
    
    let userdata = await User.register(req.body.user, req.config.allowingNewUsers)
        .catch(e => res.status(403).send(e));
    if(userdata.isBanned) return res.status(403).send("You have been banned. If you think this was a mistake, please contact us.");
    req.session.user = userdata;

    //console.log(userdata, req.session.user)
    res.redirect('/');
});

module.exports = router;