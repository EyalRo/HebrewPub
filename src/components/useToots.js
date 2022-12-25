import { useEffect, useReducer } from "react"
import axios from "axios"
import { siteList } from "./siteList"
import { useState } from "react"
// import { siteFromUsername } from "./toot/UserIdentity"

const readTootsFromSite = async (site) => {
    try {
        const url = `https://${site}/api/v1/timelines/public?local=true&limit=40`;
        const newToots = (await axios.get(url)).data
        newToots.forEach(toot => toot.site = site);
        return newToots;
    } catch (error) {
        console.log(error)
        return [];
    }
}

const readSpecificToot = async (tootid, tootsite) => {
    try {
        const url = `https://${tootsite}/api/v1/statuses/${tootid}`;
        const newToot = (await axios.get(url)).data;
        newToot.site = tootsite;
        // newToot.site = siteFromUsername(newToot.account.url); // TODO this results in an error when going to the next ancestor
        return [newToot];
    } catch (error) {
        console.log(error)
        return [];
    }
}

const dedupToots = (someToots) => {
    const uniqToots = [...new Map(someToots.map(t => [t[`id`], t])).values()];
    return uniqToots;
}

const sortToots = (someToots) => {
    someToots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return someToots;
}

const mergeToots = (newToots, oldToots) => {
    const allToots = oldToots.concat(newToots);
    return sortToots(dedupToots(allToots));
}

export const useToots = () => {
    const [tootsPerSite, dispatchToots] = useReducer((currToots, { newToots }) => {
        const sites = [...new Set(newToots.map(t => t.site))];
        const merged = { ...currToots };
        sites.forEach(site => {
            const prevOnSite = currToots[site] || [];
            const newOnSite = mergeToots(newToots, prevOnSite);
            merged[site] = newOnSite;
        });
        return merged;
    }, {});
    const [toots, setToots] = useState([]);

    const loadLatest = () => {
        siteList.forEach(async site => {
            const newToots = await readTootsFromSite(site);
            dispatchToots({ newToots })
        });
    }

    const loadToot = async (tootid, tootsite) => {
        const newToots = await readSpecificToot(tootid, tootsite);
        dispatchToots({ newToots });
    }

    useEffect(() => {
        const uniqToots = Object.values(tootsPerSite).flat();
        setToots(sortToots(uniqToots));
    }, [tootsPerSite]);

    useEffect(() => {
        loadLatest();
    }, [])

    return { toots, loadLatest, loadToot };
}