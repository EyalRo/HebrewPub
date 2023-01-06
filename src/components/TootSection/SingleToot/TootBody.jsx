import React, { useState } from "react"
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
        <Masonry columnsCount={Math.min( toot.media_attachments.length,3)} gutter="10px">
          {toot.media_attachments.map(e => (
            <div className="image" key={e.id}>
              {e.type === "image" && (
                <div className="container">
                  <img
                    src={e.preview_url}
                    alt={"media attachment"}
                    style={{ filter: `blur(${blurImage ? "1.5rem" : 0})` }}
                  />
                  {blurImage === true && (
                    <button
                      className="centered"
                      onClick={() => {
                        setBlur(!blurImage)
                      }}
                    >
                      אזהרת תוכן 👁️👁️👁️
                    </button>
                  )}
                </div>
              )}
              {e.type === "gifv" && (
                <video
                  src={e.url}
                  alt={"media attachment"}
                  autoPlay
                  loop
                  type="video/mp4"
                />
              )}
            </div>
          ))}
        </Masonry>
      )}
    </div>
  )
}
