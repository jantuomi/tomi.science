/* eslint-disable @typescript-eslint/no-var-requires */
import { SlonikMigrator } from "@slonik/migrator";
import { createPool } from "slonik";
import dotenv from "dotenv";
dotenv.config();

import * as config from "./config";

// in an existing slonik project, this would usually be setup in another module
const slonik = createPool(config.postgresConnectionString); // e.g. 'postgresql://postgres:postgres@localhost:5433/postgres'

const migrator = new SlonikMigrator({
    migrationsPath: __dirname + "/migrations",
    migrationTableName: "migration",
    slonik,
    logger: console,
});

migrator.runAsCLI();
