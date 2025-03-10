//////////////////////////////
// List of Fedivri Servers  //

import { clearToken, setURL } from "../features/toots/allTootSlice";

//////////////////////////////
export const mastodonServerList = [
  "tooot.im",
  "kishkush.net",
  "hed.im",
  "hayu.sh",
  "leftodon.social",
  "reshet.social",
  "toot.org.il",
];

//////////////////////////////
//        Functions         //
//////////////////////////////

export const fetchTootsByServer = async (server) => {
  const res = await fetch(
    `https://${server}/api/v1/timelines/public?local=true`
  );
  const data = await res.json();
  return data;
};

export const fetchOldTootsByServer = async (server, pointer) => {
  const res = await fetch(
    `https://${server}/api/v1/timelines/public?local=true&max_id=${pointer}`
  );
  const data = await res.json();
  return data;
};

try {
 fetchHomeByServer = async (server, code) => {
    const res = await fetch(`https://${server}/api/v1/timelines/home`, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });
    const data = await res.json();
    return data;
  };
} catch (error) {
  alert(error);
  clearToken();
}
export var fetchHomeByServer

export const fetchOldHomeByServer = async (server, code, pointer) => {
  const res = await fetch(
    `https://${server}/api/v1/timelines/home&max_id=${pointer}`
  );
  const data = await res.json();
  return data;
};

export const replaceTokens = (text, urlMap) => {
  var result = text.replaceAll(/:([a-zA-Z0-9_]*):/g, (substr, token) => {
    if (token in urlMap) {
      var url = urlMap[token];
      return `<img style='vertical-align:middle;' height='22' title='${substr}' src='${url}'>`;
    }
    return substr;
  });
  return result;
};

export const getHomeInstanceURL = () => {
  const domain = window.location.hostname.replace("heb.", "").replace("fedivri.", "");
  const homeInstanceURL = `https://${domain}`;

  return (mastodonServerList.includes(domain)) ? homeInstanceURL : null;
};

export const interactURL = (url) => {
  const homeInstanceURL = getHomeInstanceURL();
  return (homeInstanceURL != null && !url.startsWith(homeInstanceURL))
    ? `${homeInstanceURL}/authorize_interaction?uri=${url}`
    : url;
};