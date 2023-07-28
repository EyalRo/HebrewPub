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
  await genID(domain).then((appID) => {
    console.log(appID);
    console.log(domain);
    login(appID, domain);
  });
};

async function genID(domain) {
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

  await fetch(`${window.location.protocol}//${domain}/api/v1/apps`, {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}

const login = (appID, domain) => {
  const serverURL = `${window.location.protocol}//${domain}`;
  const response_type = "code";
  const client_id = appID.client_id;
  const redirect_uri = appID.redirect_uri;

  const hrefTarget = `${serverURL}/oauth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  window.location.replace(hrefTarget);
};
