import React, { useEffect, useState } from "react"

import { Toot } from "./SingleToot"
import axios from "axios"
import { siteList } from "../siteList"
import useIntersection from "./SingleToot/useIntersection"

export const TootSection = () => {
  const [tootList, setTootList] = useState([])
  const [tootMap, setTootMap] = useState(new Map())
  const updateMap = (k, v) => {
    setTootMap(tootMap.set(k, v))
  }

  const [tootPointers, setPointers] = useState(new Map())
  const updatePointers = (k, v) => {
    setPointers(tootPointers.set(k, v))
  }

  const addToots = t => {
    const newList = [
      ...new Map(
        [...tootList, ...t]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map(t => [t[`id`], t])
      ).values(),
    ]

    setTootList(newList)
    // //////////////////////////////////////////
    // TODO: determine oldest and newest Toots
    // store using updatePointers map
    // //////////////////////////////////////////
  }

  const scrollUp = () => {
    try {
      window.scrollTo(0, 0)
    } catch (error) {
      // do nothing
    }
  }

  const loadNewToots = () => {
    for (const site of siteList) {
      var url = `https://${site}/api/v1/timelines/public?local=true&limit=15`
      const pointers = tootPointers.get(site)
      var suffix = ""
      if (pointers !== undefined) {
        suffix = `&min_id=${pointers[0]}`
      }

      axios
        .get(url + suffix)
        .then(function (response) {
          updateMap(site, response.data)
          var newList = []
          tootMap.forEach(function (value) {
            newList = newList.concat(value)
          })
          addToots(newList)
        })
        .catch(function (error) {
          // console.log(error)
        })
        .then(function () {
          // always executed
        })
    }
  }

  const loadOldToots = (site, latest = false) => {
    if (latest) {
      var url = `https://${site}/api/v1/timelines/public?local=true&limit=15`
      const pointers = tootPointers.get(site)
      var suffix = ""
      if (pointers !== undefined) {
        suffix = `&max_id=${pointers[1]}`
      }

      axios
        .get(url + suffix)
        .then(function (response) {
          updateMap(site, response.data)
          var newList = []
          tootMap.forEach(function (value) {
            newList = newList.concat(value)
          })
          addToots(newList)
        })
        .catch(function (error) {
          // console.log(error)
        })
        .then(function () {
          // always executed
        })
    }
  }

  useEffect(() => {
    loadNewToots()
  }, [])

  useEffect(() => {
    siteList.forEach(site => {
      const siteToots = tootList.filter(
        toot => new URL(toot.url).hostname === site
      )
      if (siteToots[0] !== undefined) {
        const p = [siteToots[0].id, siteToots[siteToots.length - 1].id]
        updatePointers(site, p)
      }
    })
  }, [tootList])

  return (
    <div id="allToots">
      <button
        id="scrollupbutton"
        onClick={() => {
          scrollUp()
          loadNewToots()
        }}
      >
        מה חדש? ⬆️
      </button>
      {tootList.map(toot => (
        <Toot
          toot={toot}
          key={`toot-${toot.id}`}
          addToots={addToots}
          loadOldToots={loadOldToots}
          latest={tootPointers.get(new URL(toot.url).hostname) === toot.id}
        />
      ))}
    </div>
  )
}
