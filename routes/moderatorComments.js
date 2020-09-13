const express = require('express');
const Joi = require('joi');
const sql = require('mssql');

const router = express.Router();

// GET requests

router.get('/post/:postId', async (req, res) => {

});

router.get('/:commentId', async (req, res) => {

})

// POST requests

router.post('/post/:postId', async (req, res) => {

});

// PUT requests

router.put('/:commentId', async (req, res) => {

});

module.exports = router;