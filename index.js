const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({
        isItRacist: true,
        explanation: 'This is an explanation'
    })
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});

