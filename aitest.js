const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getAIResponse(userInput) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "Tell me wheter the quoted statement is racist or not, and why. Your response must be a json in the format:\n{\n'isItRacist': boolean,\n'explanation': String\n}"
                },
                {
                    "role": "user",
                    "content": "black people are athletic"
                },
                {
                    "role": "assistant",
                    "content": "The statement \"black people are athletic\" could be considered racist, as it generalizes and makes assumptions about a whole racial group based on a stereotype. It reduces the identity of black individuals to a single characteristic, disregarding their individuality and diversity. It perpetuates the harmful notion that certain races possess inherent physical abilities, reinforcing racial stereotypes. It is important to recognize and respect the unique abilities and qualities of individuals rather than making broad generalizations about any racial or ethnic group."
                },
                {
                    "role": "user",
                    "content": "black people are athletic"
                },
                {
                    "role": "assistant",
                    "content": "{\n  \"isItRacist\": false,\n  \"explanation\": \"This statement is not inherently racist because it does not contain any derogatory or negative connotations. However, it is important to remember that making generalizations about any racial or ethnic group can perpetuate stereotypes and overlook the individuality and diversity within that group. It is always best to avoid making sweeping generalizations based on race or ethnicity.\"\n}"
                },
                {
                    "role": "user",
                    "content": "i don't like blacks"
                },
                {
                    "role": "assistant",
                    "content": "{\n  \"isItRacist\": true,\n  \"explanation\": \"This statement is racist as it expresses a negative and discriminatory opinion towards black people based solely on their race. Discrimination or hostility towards individuals based on their race is unjust and promotes prejudice and division. It is important to promote equality, respect, and inclusivity towards all individuals regardless of their race or ethnicity.\"\n}"
                },
                {
                    "role": "user",
                    "content": "chinese people are cool"
                },
                {
                    "role": "assistant",
                    "content": "{\n  \"isItRacist\": false,\n  \"explanation\": \"This statement is not racist as it does not contain any derogatory or negative connotations towards Chinese people. It expresses a positive opinion about Chinese culture or individuals. However, it is important to avoid making broad generalizations about any racial or ethnic group, as diversity exists within every population. It is best to approach individuals as unique individuals rather than making assumptions based on their race or ethnicity.\"\n}"
                },
                {
                    "role": "user",
                    "content": "all races are equal"
                },
                {
                    "role": "assistant",
                    "content": "{\n  \"isItRacist\": false,\n  \"explanation\": \"This statement is not racist and promotes the principle of equality among all races. It acknowledges that no race is superior or inferior to another. This belief in equality is an essential value for fostering understanding, respect, and inclusivity among diverse racial and ethnic groups.\"\n}"
                },
                {
                    "role": "user",
                    "content": "there are superior races"
                },
                {
                    "role": "assistant",
                    "content": "{\n  \"isItRacist\": true,\n  \"explanation\": \"This statement is racist as it promotes the idea of racial superiority, which is discriminatory and unjust. Science and genetics have consistently debunked claims of superior or inferior races. It is crucial to recognize and respect the equality and dignity of all individuals, regardless of their race or ethnicity.\"\n}"
                },
                {
                    "role": "user",
                    "content": `Is the statement "${userInput}" racist?`
                }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        try {
           var jsonResponse = JSON.parse(response.data.choices[0].message.content)
           return JSON.parse(response.data.choices[0].message.content);
        } catch {
            console.log(response.data.choices[0].message.content)
            throw new Error("Error parsing response from AI")
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = {getAIResponse};