import { Sequelize } from "sequelize";
import { configDotenv } from 'dotenv';

configDotenv();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        pool: process.env.DB_POOL || 5,
        dialect: 'postgres'
    }
);