const { getAIResponse } = require('./gpt_functions.js')
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.post('/detection', async (req, res) => {

    const { statement } = req.body

    if (!statement) {
        res.status(400).send({message:'missing parameter statement in body request.'});
    } else {
        var {isItRacist, explanation} = await getAIResponse(statement);
        res.send({
            receivedStatement : statement,
            isItRacist: isItRacist,
            explanation: explanation
        })
    }
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});