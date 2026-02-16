import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request, response) {
    const allowedMethods = ["GET", "POST"];
    if (!allowedMethods.includes(request.method)) {
        return response.status(405).json({
            error: "Method Not Allowed",
            message: `Only ${allowedMethods.join(", ")} methods are allowed.`,
        });
    }

    let dbClient;

    try {
        dbClient = await database.getNewClient();

        const defaultMigrationsOptions = {
            dbClient,
            dir: join("infra", "migrations"),
            dryRun: true,
            direction: "up",
            verbose: true,
            migrationsTable: "pgmigrations",
        };

        if (request.method === "GET") {
            const pendingMigrations = await migrationRunner(
                defaultMigrationsOptions,
            );

            dbClient.end();
            response.status(200).json(pendingMigrations);
        }

        if (request.method === "POST") {
            const migratedMigrations = await migrationRunner({
                ...defaultMigrationsOptions,
                dryRun: false,
            });

            dbClient.end();

            if (migratedMigrations.length > 0) {
                response.status(201).json(migratedMigrations);
                return;
            }

            response.status(200).json(migratedMigrations);
        }
    } catch (error) {
        console.error("Migration error:", error);
        throw error;
    } finally {
        if (dbClient) {
            await dbClient.end();
        }
    }
}

export default migrations;
