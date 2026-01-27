import database from "infra/database";

async function status(request, response) {
    const updatedAt = new Date().toISOString();

    const databaseVersionQuery = await database.query("SHOW server_version;");
    const databaseVersion = databaseVersionQuery.rows[0].server_version;

    const maxConnectionsQuery = await database.query("SHOW max_connections;");
    const maxConnections = parseInt(
        maxConnectionsQuery.rows[0].max_connections,
    );

    const dbName = process.env.POSTGRES_DB;
    const openedConnectionsQuery = await database.query(
        `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
        [dbName],
    );
    const openedConnections = openedConnectionsQuery.rows[0].count;

    response.status(200).json({
        updated_at: updatedAt,
        dependencies: {
            database: {
                version: databaseVersion,
                max_connections: maxConnections,
                opened_connections: openedConnections,
            },
        },
    });
}

export default status;
