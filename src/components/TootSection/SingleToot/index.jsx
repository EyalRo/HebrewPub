import React, { useEffect, useState, useRef } from "react"
import { TootBody } from "./TootBody"
import "./toot.scss"
import { UserIdentity } from "./UserIdentity"
import useIntersection from "./useIntersection"
import axios from "axios"
import { Hidden, Stack } from "@mui/material"

export const Toot = ({ toot, addToots, loadOldToots }) => {
  const ref = useRef()
  const inViewport = useIntersection(ref, "500px")
  const url = new URL(toot.url)

  const [showThread, setShowThread] = useState(false)
  const [tootSeen, setSeen] = useState(false)
  const [context, setContext] = useState({
    ancestors: [],
    descendants: [],
  })

  const getContext = () => {
    axios
      .get(`https://${url.hostname}/api/v1/statuses/${toot.id}/context`)
      .then(function (response) {
        if (
          response.data.descendants.length > 0 ||
          response.data.ancestors.length > 0
        ) {
          addToots([...response.data.ancestors, ...response.data.descendants])
          setContext(response.data)
        }
      })
      .catch(function (error) {
        //console.log(error)
        setSeen(false)
      })
      .then(function () {
        // window.scrollTo(0, 0)
      })
  }

  useEffect(() => {
    if (tootSeen && url !== undefined) {
      getContext()
      loadOldToots(url.hostname, true)
    }
  }, [tootSeen])

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (inViewport && tootSeen === false) {
        setSeen(true)
      }
    }, 100)
    if (inViewport === false) {
      clearTimeout(timerId)
    }
  }, [inViewport])

  return (
    <div className={`toot`} key={toot.id} id={toot.id} ref={ref}>
      <div className="descendants">
        {context.descendants
          .filter(descendant => descendant.in_reply_to_id === toot.id)
          .map(descendant => {
            return (
              <div style={{ flex: 1 }} key={`rep-to-${descendant.id}`}>
                <a
                  style={{ direction: "rtl" }}
                  className={"threadButton"}
                  href={`#${descendant.id}`}
                  onClick={function () {
                    addToots(context.descendants)
                  }}
                >
                  {`תגובה מאת ${descendant.account.display_name}`}
                </a>
              </div>
            )
          })}
      </div>
      <div className="header" key={"header"}>
        <UserIdentity toot={toot} />
        <div className="buttons">
          <a href={toot.url} target="_blank" rel="noopener noreferrer">
            {new Date(toot.created_at).toLocaleString("he-IL")}
          </a>
        </div>
      </div>
      <TootBody toot={toot} />
      <div className="footer">
        {`
        פיברוטים ${toot.favourites_count} בוסטים ${toot.reblogs_count} תגובות ${toot.replies_count}`}
      </div>
      <div style={{ direction: "rtl" }}>
        {context.ancestors.length > 0 && (
          <div>
            {`קודם בשרשור... `}
            <span
              className="threadArrow"
              style={{
                display: "inline-block",
                rotate: `${showThread ? 0 : 180}deg`,
                transition: "rotate 0.5s ease",
              }}
              onClick={function () {
                setShowThread(!showThread)
              }}
            >
              🔽
            </span>
          </div>
        )}
      </div>
      <Stack
      className={"ancestors"}
      style={{height:showThread?"auto":0, overflow:"hidden"}}
      >
        {context.ancestors.map(ancestor => (
          <div className="toot" key={ancestor.id}>
            <UserIdentity toot={ancestor} />
            <TootBody toot={ancestor} />
          </div>
        ))}
      </Stack>
    </div>
  )
}
