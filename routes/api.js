const express = require('express');
const { writeFileSync } = require('fs');
const db = require('../database/dbwrapper');
const calculate = require('../structures/calculate');

const router = express.Router();

router.post('/respond', express.text(), async (req, res) => {
    if(req.header("X-auth") !== req.session.user.id) return res.status(401).send("Stop that");
    if(req.config.mode !== "respond") return res.status(406).send("Hey, you can't access this resource right now!");
    db.handleInput(req.config.round, req.session.user.id, req.body);
    res.sendStatus(200);
});

router.post('/vote', express.text(), (req, res) => {
    if(req.header("X-auth") !== req.session.user.id) return res.status(401).send("Stop that");
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
    if(!req.query.round) return res.sendStatus(400);
    let votes = await db.getVotes(req.query.round);
    res.send(calculate(votes)); 
})

module.exports = router; 