const express = require('express');
const  router = express.Router();

router.get('/', (req, res) => {
    res.send('server is well and up');
});

module.exports = {
    router
}