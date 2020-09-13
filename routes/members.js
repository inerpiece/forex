const express = require('express');
const Joi = require('joi');
const sql = require('mssql');

const router = express.Router();

// GET requests

router.get('/:userId', async (req, res) => {
    res.send(JSON.stringify({welcome: 'you'}));// tested to see if the route works (localhost:8577/api/members/userId) this works in postman
});

// POST requests

router.post('/', async (req, res) => {

});

// PUT requests

router.put('/:userId', async (req, res) => {

});

module.exports = router;