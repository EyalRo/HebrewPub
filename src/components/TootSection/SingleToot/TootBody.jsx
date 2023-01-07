import React, { useState } from "react"
import { isMobile } from "react-device-detect"

import { TextWithEmojis } from "../../TextWithEmojies"
import Masonry from "react-responsive-masonry"

export const TootBody = ({ toot }) => {
  const [hidden, setHidden] = useState(toot.spoiler_text.length > 0)
  const [blurImage, setBlur] = useState(toot.sensitive)

  return (
    <div className="body">
      {toot.spoiler_text.length > 0 && (
        <button
          className={"contentwarning"}
          onClick={function () {
            setHidden(!hidden)
          }}
          onKeyDown={function () {
            setHidden(!hidden)
          }}
        >
          {toot.spoiler_text}
        </button>
      )}
      {hidden ? null : (
        <div className="content">
          <TextWithEmojis
            text={toot.content}
            tootsite={toot.site}
          ></TextWithEmojis>
        </div>
      )}
      {toot.media_attachments.length > 0 && (
        <button
          className="centered"
          onClick={() => {
            setBlur(!blurImage)
          }}
        >
          הצג\הסתר
        </button>
      )}
      <Masonry
        columnsCount={Math.min(toot.media_attachments.length, isMobile ? 2 : 3)}
        gutter="1px"
      >
        {toot.media_attachments
          .filter(a => a.type === "image")
          .map((e, index) => (
            <img
              className={"tootImg"}
              key={`i-${e.id}-${index}`}
              src={e.preview_url}
              alt={"media attachment"}
              style={{ filter: `blur(${blurImage ? "1.5rem" : 0})` }}
            />
          ))}

        {toot.media_attachments
          .filter(a => a.type === "gifv")
          .map((e, index) => (
            <video
              className="tootVid"
              src={e.url}
              key={`v-${e.id}-${index}`}
              alt={"media attachment"}
              autoPlay
              loop
              type="video/mp4"
              style={{ filter: `blur(${blurImage ? "1.5rem" : 0})` }}
            />
          ))}
      </Masonry>
    </div>
  )
}
