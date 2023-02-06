import React, { useEffect, useState } from "react"

export function OpenMenu() {
  const [maxH, setMaxH] = useState("0%")

  useEffect(() => {
    setMaxH("100%")
    return function cleanup() {
      setMaxH("0%")
    }
  }, [])

  return (
    <div id="openMenu" style={{ maxHeight: maxH }}>
      <ul>
        <li className="notReady">לוג-אין</li>
        <li className="notReady">סטטיסטיקות</li>
        <li className="notReady">מפת הפדיברס העברי</li>
        <li className="notReady">אודות</li>
        <li>
          <a style={{ color: "black" }} href="https://kishkush.net/@dino">
            צור קשר
          </a>
        </li>
      </ul>
    </div>
  )
}
