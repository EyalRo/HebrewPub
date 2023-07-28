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
  const url = `${window.location.protocol}//${window.location.host}`;
  let domain = new URL(url);
  domain = domain.hostname.replace("heb.", "");
  const appID = await genID(domain);
  if (appID) {
    console.log(appID);
  } else console.log("undefined?");
};

const genID = async (domain) => {
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
    `${window.location.protocol}//${domain}/api/v1/apps`,
    {
      method: "POST",
      body: formData,
    }
  );

  const appID = await response.json();
  return appID;
};

const login = (appID, domain) => {
  const serverURL = `${window.location.protocol}//${domain}`;
  const response_type = "code";
  const client_id = appID.client_id;
  const redirect_uri = appID.redirect_uri;

  const hrefTarget = `${serverURL}/oauth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  window.location.replace(hrefTarget);
};
