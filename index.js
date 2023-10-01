const { getAIResponse } = require('./gpt_functions.js');
const { MongoClient } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Mongo database connection
const mongo_uri = require('./atlas_uri.js');
const client = new MongoClient(mongo_uri);
const dbname = "racist-o-meter";
const collection_name = "generated_answers";
const dbCollection = client.db(dbname).collection(collection_name)

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Successfully connected to the ${dbname} database`);
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
    }
}

// Checks if the received statement is already in the database
const checkDatabase = async (statement) => {
    try {
        // Formats statement removing spaces and making all lowercase, to avoid redundancies in the DB.
        const formattedStatement = statement.toLowerCase().replace(/\s/g, '');
        console.log(formattedStatement);
        const statementQuery = {
            receivedStatement: formattedStatement
        }
        
        const queryResult = await dbCollection.findOne(statementQuery);
        if (queryResult) {
            console.log(queryResult);
            return {
                receivedStatement: statement,
                isItRacist: queryResult.isItRacist,
                explanation: queryResult.explanation
            }
        } else {
            console.log(`No results for the query: '${statement}', asking Chat-GPT...`);
            return null;
        }
    } catch (err) {
        console.error(`Error checking database: ${err}`);
    }
}

// Uploads new response to the database
const uploadResponse = async (result) => {
    try{
        console.log("Uploading answer...");
        await dbCollection.insertOne(result);
    } catch (err) {
        console.error(`Error uploading to database: ${err}`);
    }
}

connectToDatabase();

// Express
app.use(cors());
app.use(express.json());

app.post('/detection', async (req, res) => {
    
    const { statement } = req.body

    if (!statement) {
        res.status(400).send({ message: 'missing parameter statement in body request.' });
    } else {
        const db_result = await checkDatabase(statement);
        console.log(db_result);
        if (db_result != null) {
            const result = db_result;
            res.send(result);
            return
        }
        const { isItRacist, explanation } = await getAIResponse(statement);
        const result = {
            receivedStatement: statement.toLowerCase().replace(/\s/g, ''),
            isItRacist: isItRacist,
            explanation: explanation
        }
        await uploadResponse(result);
        res.send(result);
        console.log("GPT response at " + new Date().toISOString() + ":")
        console.log(result);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});