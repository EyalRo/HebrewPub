import React, { useState } from "react"
import MenuIcon from "./menu.svg"
import {OpenMenu} from "./OpenMenu"
import "./header.scss"
import Alpha from "./alpha.svg"

const Header = () => {
  const [menuOpen, toggleMenu] = useState(false)
  return (
    <header>
      <img src={Alpha} alt={'Alpha Version'} id={"alpha"}/>
      <div id="title">פדעברי</div>
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
