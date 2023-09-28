const { getAIResponse } = require('./gpt_functions.js');
const { MongoClient } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Mongo database connection
const mongo_uri = require('./atlas_uri.js');
const client = new MongoClient(mongo_uri);
const dbname = "racist-o-meter"

const connectToDatabase = async () => {
    try{
        await client.connect();
        console.log(`Successfully connected to the ${dbname} database`);
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
    }
}

const main = async () => {
    try {
        await connectToDatabase();
        
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
    } finally {
        await client.close();
    }
}

main()

// Express
app.use(cors());
app.use(express.json());

app.post('/detection', async (req, res) => {

    const { statement } = req.body

    if (!statement) {
        res.status(400).send({message:'missing parameter statement in body request.'});
    } else {
        var {isItRacist, explanation} = await getAIResponse(statement);
        let result = {
            receivedStatement : statement,
            isItRacist: isItRacist,
            explanation: explanation
        }
        res.send(result);
        console.log("GPT response at " + new Date().toISOString() + ":")
        console.log(result);
    }
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
});