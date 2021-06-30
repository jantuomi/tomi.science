import { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import * as cheerio from "cheerio";
import got from "got";
import * as config from "../config";
import styles from "../styles/Home.module.css";

const socket = io(config.backendUrl);


type Publication = {
    title: string;
    authors: string;
    publicedIn: string;
    citedBy: number;
    year: number;
}
interface HomeProps {
    publications: Publication[];
}


const getPublications = async (): Promise<Publication[]> => {
    // TODO: Gets only 100 latest. For more (":D"), need to traverse multiple pages...
    const resp = await got("https://scholar.google.com/citations?user=HMp8VyMAAAAJ&hl=en&oi=ao&cstart=0&pagesize=100", { resolveBodyOnly: true });
    const html = cheerio.load(resp);

    const titles: string[] = [];
    html("td.gsc_a_t > a.gsc_a_at").each(function() {  titles.push(html(this).text().trim()); });
    const authors: string[] = [];
    html("td.gsc_a_t > div:nth-child(2)").each(function() {  authors.push(html(this).text().trim()); });
    const publices: string[] = [];
    html("td.gsc_a_t > div:nth-child(3)").each(function() {  publices.push(html(this).text().trim()); });
    const cites: string[] = [];
    html("td.gsc_a_c > a.gsc_a_ac").each(function() {  cites.push(html(this).text().trim()); });
    const years: string[] = [];
    html("td.gsc_a_y > span.gsc_a_hc").each(function() {  years.push(html(this).text().trim()); });

    return titles.map((title, idx) => ({
        title,
        authors: authors[idx],
        publicedIn: publices[idx],
        citedBy: Number(cites[idx]),
        year: Number(years[idx]),
    }));
};

const Home: NextPage<HomeProps> = ({ publications }) => {
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

            <ul className="publications">
                {publications.map((pub) => (
                    <li key={pub.title}>
                        {pub.title}, {pub.year}
                    </li>
                ))}
            </ul>
        </div>
    );
};


// TODO: Publications don't update without re-build
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const publications = await getPublications();

    return {
        props: {
            publications,
        },
    };
};

export default Home;
