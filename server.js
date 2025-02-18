import express from 'express';
import { configDotenv } from 'dotenv';
import { sequelize } from './database.js'

configDotenv();

const PORT = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
    res.send("Hello World");
});

try {
    await sequelize.authenticate();
    console.log('connected to DB')
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
} catch (error) {
    console.error('error in DB connection', error);
}