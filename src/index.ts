import dotenv from 'dotenv';
import path from 'path';

// Specify the path to the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import fs from 'fs';
import mysql from 'mysql2';

// Log environment variables (excluding sensitive information)
console.log('Database Host:', process.env.DATABASE_HOST);
console.log('Database User:', process.env.DATABASE_USER);
console.log('Database Name:', process.env.DATABASE_NAME);
console.log('Database Port:', process.env.DATABASE_PORT);

interface Resource {
    name: string;
    icon: string;
    quantity: number;
    price: number;
}

// Read JSON file
const data: Resource[] = JSON.parse(fs.readFileSync('../resource/resource.json', 'utf8'));

// Create a MySQL connection using environment variables
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT)
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

    // Insert data into MySQL
    const query = 'INSERT INTO dinos.resource (name, icon, quantity, price) VALUES ?';
    const values = data.map(item => [item.name, item.icon, item.quantity, item.price]);

    connection.query(query, [values], (err) => {
        if (err) throw err;
        console.log('Data inserted');
        connection.end();
    });
});
