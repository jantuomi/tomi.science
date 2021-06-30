import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "../styles/Home.module.css";
import * as config from "../config";

const socket = io(config.backendUrl);

const Home = (): ReactElement => {
    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected:", socket.id);
        });
        socket.on("disconnect", (reason: string) => {
            console.log("disconnected, reason:", reason);
        });
        socket.on("update", (arg: number) => {
            console.log("update:", arg);
            setValue(arg);
        });
    });

    const increment = () => {
        socket.emit("increment");
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>tomi.science</title>
                <meta name="description" content="Tomi Koskinen's academic portfolio" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                value:
                {value}
            </div>
            <div>
                <button onClick={increment}>increment</button>
            </div>
        </div>
    );
};

export default Home;
