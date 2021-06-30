// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import express from "express";
import http from "http";
import {
    createPool,
    DatabasePoolType,
    DatabaseTransactionConnectionType,
    sql,
} from "slonik";
import * as config from "./config";
import { ValueRecord } from "./shared-types";
import { Server as SocketIOServer } from "socket.io";

const app = express();

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: config.frontendUrl,
    },
});

type Connection = DatabasePoolType | DatabaseTransactionConnectionType;
const _connection = createPool(config.postgresConnectionString);

const getCurrentValue = async (conn: Connection): Promise<ValueRecord["value"]> => {
    return await conn.oneFirst<ValueRecord["value"]>(sql`
        SELECT value
        FROM state
    `);
};

const incrementCurrentValue = async (conn: Connection): Promise<number> =>
    await conn.transaction(async (trans) => {
        const current = await getCurrentValue(trans);

        const newValue = current + 1;
        await trans.query(sql`
                UPDATE state
                SET value = ${newValue}
            `);
        return newValue;
    });

io.on("connection", async (socket) => {
    console.log(`a user connected: ${socket.id}`);
    const currentValue = await getCurrentValue(_connection);
    socket.emit("update", currentValue);

    socket.on("increment", async () => {
        const newValue = await incrementCurrentValue(_connection);
        io.emit("update", newValue); // broadcast
    });
});

httpServer.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
});
