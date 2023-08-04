const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.post('/deteccion', (req, res) => {

    const { frase } = req.body
    var esRacista = calculateRacism(frase);

    if (!frase) {
        res.status(401).send({message:'missing parameter frase in body request.'});
    }
    res.send({
        esRacista: esRacista,
        explicacion: 'This is an explanation'
    })
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware functions

function calculateRacism(frase) {
    if(frase.includes("negro")) {
        return true;
    };
    return false;
}