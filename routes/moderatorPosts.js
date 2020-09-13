const express = require('express');
const Joi = require('joi');
const sql = require('mssql');

const router = express.Router();

// GET requests

router.get('/', async (req, res) => {

});

router.get('/post/:postId', async (req, res) => {

});

// POST requests

router.post('/', async (req, res) => {

});

// PUT requests

router.put('/post/:postId', async (req, res) => {

});

module.exports = router;