import { Client } from "pg";

async function query(queryObject, params) {
    var client;
    try {
        client = await getNewClient();
        const result = await client.query(queryObject, params);
        return result;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    } finally {
        await client.end();
    }
}

async function getNewClient() {
    const credentials = {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        ssl: getSslValues(),
    };

    const client = new Client(credentials);

    await client.connect();

    return client;
}

export default {
    query,
    getNewClient,
};

function getSslValues() {
    if (process.env.POSTGRES_CA) {
        return {
            ca: process.env.POSTGRES_CA,
        };
    }
    return process.env.NODE_ENV === "production" ? true : false;
}
