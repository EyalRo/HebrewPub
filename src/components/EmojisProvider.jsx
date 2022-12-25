import React, { useState, useEffect, createContext, useContext } from "react"
import axios from "axios"
import { siteList } from "./siteList"

// const { Consumer: OpenCvConsumer, Provider } = createContext();
const emojisContext = createContext();

export const EmojisProvider = ({ children }) => {
    const [emojis, setEmojis] = useState({});

    useEffect(() => {
        const mergedEmojis = {}
        siteList.forEach(async site => {
            const url = `https://${site}/api/v1/custom_emojis`;
            const siteEmojis = (await axios.get(url)).data;
            const siteXrefEmojies = Object.fromEntries(siteEmojis.map(e => [e.shortcode, e]));
            mergedEmojis[site] = siteXrefEmojies;
            setEmojis(mergedEmojis);
        });
    }, [])

    return (
        <emojisContext.Provider value={emojis}>
            {children}
        </emojisContext.Provider>
    )
}

export const useEmojis = () => {
    return useContext(emojisContext);
}
