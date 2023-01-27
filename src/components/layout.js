import React from "react"

import Header from "./Header"
import SignUp from "./SignUp"
import "./layout.scss"

const Layout = ({ children }) => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="פדעברי: המקום הכי קל לקרוא את החצרוצים בעברית. לא מצריך הרשמה. פי 1000 יותר כיף"/> 
      <Header />
      <SignUp />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
        }}
      >
        <main>{children}</main>
      </div>
      <div id={"bottomofpage"} />
    </>
  )
}

export default Layout
