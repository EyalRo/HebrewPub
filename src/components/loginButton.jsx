import React, { useEffect } from "react";
import { Login, Logout, UserExpert } from "grommet-icons";
import { Button } from "grommet";
import { useSelector, useDispatch } from "react-redux";

import { clearToken } from "../features/toots/allTootSlice";

const LoginButton = () => {
  const dispatch = useDispatch();
  const loginCode = useSelector((state) => state.allToots.loginToken);

  return loginCode ? (
    <Button icon={<Logout />} onClick={() => dispatch(clearToken())} />
  ) : (
    <Button icon={<Login />} onClick={() => loginFunc()} />
  );
};

export default LoginButton;

const loginFunc = async () => {
  const domain = window.location.hostname.replace("heb.", "").replace("fedivri.", "");
  const homeInstanceURL = `https://${domain}`

  const appID = await genID(homeInstanceURL);
  if (appID) {
    login(appID, homeInstanceURL);
  } else console.error(`Cannot generate app ID on server ${domain}`);
};

const genID = async (homeInstanceURL) => {
  const formData = new FormData();

  formData.append("client_name", "פדעברי: הפדיברס העברי");
  formData.append(
    "redirect_uris",
    `${window.location.protocol}//${window.location.host}`
  );
  formData.append(
    "website",
    `${window.location.protocol}//${window.location.host}`
  );

  const response = await fetch(
    `${homeInstanceURL}/api/v1/apps`,
    {
      method: "POST",
      body: formData,
    }
  );

  const appID = await response.json();
  return appID;
};

const login = (appID, homeInstanceURL) => {
  const response_type = "code";
  const client_id = appID.client_id;
  const redirect_uri = appID.redirect_uri;

  const hrefTarget = `${homeInstanceURL}/oauth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  window.location.replace(hrefTarget);
};
