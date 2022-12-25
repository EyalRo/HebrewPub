import React from "react"
import { useEmojis } from "./EmojisProvider";

export const TextWithEmojis = ({ text, tootsite }) => {
    const emojis = useEmojis();
    const siteEmojies = emojis[tootsite] || [];
    const splitted = text.split(/(:\w+:)/);
    const style = "width:20px; height:20px; margin: 0";
    const transformed = splitted.map((part, i) => {
        if (part.startsWith(':') && part.endsWith(':')) {
            const partBare = part.substring(1, part.length - 1);
            const emoji = siteEmojies[partBare];
            if (emoji) {
                const longimg = `<img src="${emoji.url}" style="${style}" alt=":${emoji.shortcode}:" />`; // TODO move emoji style to css
                return longimg;
            }
        }
        return part;
    });
    const transText = transformed.join('');

    return (
        <div
            dangerouslySetInnerHTML={{ __html: transText }}
        ></div>
    )
}