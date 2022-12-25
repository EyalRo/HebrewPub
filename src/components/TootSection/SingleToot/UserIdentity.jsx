import React from "react"
import { TextWithEmojis } from "../../TextWithEmojies"

export const siteFromUsername = (userUrl) => {
    const serverName = userUrl.replace(/^(.*\/\/[^/?#]*).*$/, "$1")
    const serverRaw = serverName.substring(serverName.lastIndexOf("/") + 1)
    return serverRaw;
}

export const UserIdentity = ({ toot }) => {
    const serverRaw = siteFromUsername(toot.account.url);
    const showName = toot.account.username + "@" + serverRaw;

    return (
        <div className="identity">
            <div className="avatar">
                <img
                    src={toot.account.avatar}
                    alt={`avatar for ${toot.account.display_name}`}
                    style={{ margin: 0 }}
                />
            </div>
            <div className="names">
                <div className="displayName">
                    <TextWithEmojis text={toot.account.display_name} tootsite={toot.site}></TextWithEmojis>
                </div>
                <div className="userName">
                    <a
                        href={toot.account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {showName}
                    </a>
                </div>
            </div>
        </div>
    )
}