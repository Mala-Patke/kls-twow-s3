const express = require('express');
const { AES, enc:{ Utf8 } } = require('crypto-js');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const { join} = require('path');
const db = require('../database/dbwrapper');
const calculate = require('../lib/calculate');
require('dotenv').config();

const router = express.Router();

router.post('/respond', express.text(), async (req, res) => {
    if(req.header("X-auth") !== req.session.user.id) return res.status(401).send("User mismatch error. Please refresh and try again.");
    if(req.config.mode !== "respond") return res.status(406).send("Hey, you can't access this resource right now!");
    db.handleInput(req.config.round, req.session.user.id, req.body);
    res.sendStatus(200);
});

router.post('/vote', express.text(), (req, res) => {
    if(req.header("X-auth") !== req.session.user.id) return res.status(401).send("User mismatch error. Please refresh and try again.");
    if(req.config.mode !== "vote") return res.status(406).send("Hey, you can't access this resource right now!");
    db.handleVote(req.config.round, req.session.user.id, req.body);
    res.sendStatus(200);
});

router.post('/updateconfig', express.text(), async (req, res) => {
    let data = JSON.parse(req.body); //Couldn't figure out how to do it with application/json lmao
    if(!["Timothy Chien", "Ali Shahid"].includes(req.session.user.username)) return res.sendStatus(403);

    db.handleConfigUpdate(data)
    writeFileSync('./config.json', JSON.stringify(data));
    res.sendStatus(200);
});

router.get('/rounddata', async (req, res) => {
    if(!req.query.round) req.query.round = req.config.round;
    let votes = await db.getVotes(req.query.round);
    let users = await db.getUsers();
    let responses = await db.getResponses(req.query.round);
    res.send(calculate(votes, users, responses).replace(/\n/gi, '<br>')); 
});

//Doing this horribleness all to avoid having to store emails in the database
const exemptions = [
    "Derek", "Brandon", "Brianna", "Jessica", "Chi-Ray", "Chris", "Lejoi"
];

router.get('/emails', (req, res) => {
    if(!req.query.code || AES.decrypt(req.query.code, process.env.SALT).toString(Utf8) !== "artichoke") return res.sendStatus(403);
    /*
    //This is super dumb but I'm too lazy to implement it properly lmao
    let rawusers = execSync(`node query list_users ${req.query.ref} not`, { cwd: join(__dirname, "../scripts")})
        .toString()
        .replace(/'/g, '"')
        .replace(/[^a-z"\[\], ]/gi, '');
    let users = JSON.parse(rawusers);
    console.log(users);
    let emails = [];
    for(let user of users){
        let ret = "";
        ret += user.split(" ")[0];
        if(!exemptions.includes(user)) ret += user.split(" ")[1][0];
        ret += "@khanlabschool.org";
        emails.push(ret.toLowerCase());
    }
    res.send(emails);*/
    res.send(['vibhass@khanlabschool.org', ]);
});

module.exports = router; 