const { exec } = require("node:child_process");

function checkPostgres() {
    exec(
        "docker exec tabnews-database pg_isready --host localhost",
        handleReturn,
    );

    function handleReturn(error, stdout, stderr) {
        if (stdout.search("accepting connections") === -1) {
            process.stdout.write(".");
            checkPostgres();
            return;
        }

        console.log("\nPostgreSQL está pronto!\n");
    }
}

process.stdout.write("Aguardando o PostgreSQL iniciar ");
checkPostgres();
