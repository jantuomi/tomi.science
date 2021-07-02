// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import express from "express";
import http from "http";
import {
    createPool,
    DatabasePoolType,
    DatabaseTransactionConnectionType,
    sql,
} from "slonik";
import { parse } from "node-html-parser";
import got from "got";
import { decode } from "he";

import * as config from "./config";
import { Paper, ValueRecord } from "./shared-types";
import { Server as SocketIOServer } from "socket.io";

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

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

const extractDataFromHtml = (html: string): Paper[] => {
    const dom = parse(html);

    const tds = dom.querySelectorAll(".gsc_a_tr .gsc_a_t a");
    const data = tds.map(td => ({
        url: `https://scholar.google.com${td.getAttribute("data-href") || ""}`,
        title: decode(td.textContent),
    }));

    return data;
};

app.get("/api/papers", async (req, res) => {
    const resp = await got("https://scholar.google.com/citations?user=HMp8VyMAAAAJ", {
        responseType: "text",
        encoding: "latin1",
    });
    const html = resp.body;
    const papers = extractDataFromHtml(html);
    res.contentType("json");
    res.end(JSON.stringify(papers));
});

httpServer.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
});
