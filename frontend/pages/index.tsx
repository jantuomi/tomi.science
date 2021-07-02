import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Marquees, { MarqueeLink } from "../components/Marquees/Marquees";
import * as config from "../config";
import styles from "../styles/Home.module.css";

const socket = io(config.backendUrl);

const Home = (): ReactElement => {
    const [value, setValue] = useState<number | undefined>(undefined);
    const [papers, setPapers] = useState<MarqueeLink[]>([]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected:", socket.id);
        });
        socket.on("disconnect", (reason: string) => {
            console.log("disconnected, reason:", reason);
        });
        socket.on("update", (arg: number) => {
            setValue(arg);
        });
    });

    useEffect(() => {
        async function fetchPapers() {
            const resp = await fetch(`${config.backendUrl}/api/papers`);
            const data = await resp.json();

            setPapers(data);
        }
        fetchPapers();
    }, []);

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
                display: value === undefined ? "none" : "inherit",
            }}>
                <div className={styles.btnInner}>
                    <span className={styles.counter}>{value}</span>
                    { /* eslint-disable-next-line @next/next/no-img-element */ }
                    <img src="/tomi_sq.png" alt="" />
                </div>
            </button>
            <Marquees links={papers} />
        </div>
    );
};

export default Home;
