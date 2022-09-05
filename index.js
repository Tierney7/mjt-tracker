require('dotenv').config()
const chalk = require('chalk');
const dbConfig = require('./config/dbConfig');

async function main() {
    console.info(chalk.blue("=".repeat(30)));
    console.info(chalk.blue("Connecting to database..."));
    console.info(chalk.blue("=".repeat(30)));
    const dbConnection = await dbConfig();
    console.info(chalk.blue("=".repeat(30)));
    console.info(chalk.blue("Connected to database!"));
    console.info(chalk.blue("=".repeat(30)));
}

main();