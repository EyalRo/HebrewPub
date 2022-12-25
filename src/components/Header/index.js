import React, { useState } from "react"
import MenuIcon from "./menu.svg"
import {OpenMenu} from "./OpenMenu"
import "./header.scss"

const Header = () => {
  const [menuOpen, toggleMenu] = useState(false)
  return (
    <header>
      <div id="title">🦕הפדיברס העברי הראשון🐇</div>
      <div id={"menuButton"}>
        <button onClick={() => toggleMenu(!menuOpen)}>
          <img src={MenuIcon} alt={`Menu icon`} />
        </button>
      </div>
      {menuOpen && <OpenMenu />}
    </header>
  )
}

export default Header
