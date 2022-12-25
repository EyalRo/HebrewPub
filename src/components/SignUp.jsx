import React from "react"
import { siteList } from "./siteList"

const SignUp = () => {
  return (
    <div id="signup">
      <div>
        בשביל לכתוב סטאטוס חדש, לעשות לייק או לפרסם סטאטוס קיים יש צורך להרשם.
        קל להרשם בכל אחד מהשרתים של הפדיברס העברי. בכדי להרשם, יש לבחור את אחד
        השרתים:
      </div>
      <div id="siteList">
        {siteList.sort(() => Math.random() - 0.5).map(site => {
          return (
            <div key={site}>
              <form action={`https://${site}`}>
                <input type="submit" value={site} />
              </form>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SignUp
