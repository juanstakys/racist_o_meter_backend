const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.post('/deteccion', (req, res) => {

    const { statement } = req.body
    var esRacista = calculateRacism(statement);

    if (!statement) {
        res.status(401).send({message:'missing parameter statement in body request.'});
    }
    res.send({
        receivedStatement : statement,
        isItRacist: esRacista,
        explanation: 'This is an explanation'
    })
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware functions

function calculateRacism(statement) {
    if(statement.includes("black")) {
        return true;
    };
    return false;
}