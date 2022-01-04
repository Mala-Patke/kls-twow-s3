const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../structures/user');

const router = express.Router();
const client = new OAuth2Client('227209584109-g2qdae2772qogtcv46ca1jmksuht1fpu.apps.googleusercontent.com');

function verifyToken(idToken){
    return new Promise((res, rej) => {
        client.verifyIdToken({
            idToken,
            audience: '227209584109-g2qdae2772qogtcv46ca1jmksuht1fpu.apps.googleusercontent.com'
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
    if(!req.query.email.endsWith('khanlabschool.org')) return res.sendStatus(403);

    let userdata = await User.registerUser(req.query.user);

    req.session.user = userdata; //WHY ISN"T THIS WORKING AAAAAAAAAAA
    req.session.save();

    res.redirect('/');
});

module.exports = router;