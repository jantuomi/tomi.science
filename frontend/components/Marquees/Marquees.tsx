import React, { ReactElement } from "react";
import styles from "./Marquee.module.css";
import Marquee from "./Marquee";

export interface MarqueeLink {
  title: string;
  url: string;
}

interface Props {
    links: MarqueeLink[]
}

const getRandomDelayBetween = (start: number, end: number) => `${Math.random() * (end - start) + start}s`;
const getTopFromIndex = (index: number, n: number) => `calc((100% - 50px) * (${index} / ${n - 1}))`;
const getRandomAnimationName = () => Math.random() > 0.5 ? "right" : "left";

const Marquees = ({ links }: Props): ReactElement => {
    return (
        <div className={styles.marqueeContainer}>
            { links.map((link, idx) => (
                <Marquee
                    key={idx}
                    url={link.url}
                    text={link.title}
                    delayShorthand={getRandomDelayBetween(0, 9)}
                    topShorthand={getTopFromIndex(idx, links.length)}
                    direction={getRandomAnimationName()}
                />
            ))}
        </div>
    );
};

export default Marquees;
