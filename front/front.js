const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.sendFile('index.html')
})

router.get('/user/:username', (req, res) => {
   res.sendFile('profile.html')
})

module.exports = router;
