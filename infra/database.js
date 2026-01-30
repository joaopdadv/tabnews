import { Client } from "pg";

async function query(queryObject, params) {
    const credentials = {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        ssl: process.env.NODE_ENV === "development" ? false : true,
    };

    const client = new Client(credentials);

    console.log("Credenciais do postgres:", credentials);

    try {
        await client.connect();
        const result = await client.query(queryObject, params);
        return result;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    } finally {
        await client.end();
    }
}

export default {
    query: query,
};
