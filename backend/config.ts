if (!process.env.POSTGRES_CONNECTION_STRING) {
    throw new Error("POSTGRES_CONNECTION_STRING env var not defined!");
}

export const postgresConnectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL env var is not defined!");
}

export const frontendUrl = process.env.FRONTEND_URL;

export const port = process.env.PORT || 4000;
