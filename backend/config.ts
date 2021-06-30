if (!process.env.POSTGRES_CONNECTION_STRING) {
    throw new Error("POSTGRES_CONNECTION_STRING env var not defined!");
}

export const postgresConnectionString = process.env.POSTGRES_CONNECTION_STRING;
export const port = process.env.PORT || 4000;
