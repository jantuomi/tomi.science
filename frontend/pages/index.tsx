import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { io } from "socket.io-client";
import * as config from "../config";
import styles from "../styles/Home.module.css";

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

    const rotateDeg = value !== undefined ? 10 * value : 0;

    return (
        <div className={styles.container}>
            <Head>
                <title>tomi.science</title>
                <meta name="description" content="Tomi Koskinen's academic portfolio" />
                <link rel="icon" href="/tomi_sq.png" />
            </Head>
            <button onClick={increment} className={styles.tomiBtn} style={{
                transform: `rotate(${rotateDeg}deg)`,
            }}>
                <div className={styles.btnInner}>
                    <span className={styles.counter}>{value}</span>
                    { /* eslint-disable-next-line @next/next/no-img-element */ }
                    <img src="/tomi_sq.png" alt="" />
                </div>
            </button>
            {/* <div>
                value:
                {value}
            </div>
            <div>
                <button onClick={increment}>increment</button>
            </div> */}
        </div>
    );
};

export default Home;
