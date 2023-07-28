import React, { useEffect } from "react";
import { Login, UserExpert } from "grommet-icons";
import { Button } from "grommet";
import { useSelector, useDispatch } from "react-redux";

import { clearToken } from "../features/toots/allTootSlice";

const LoginButton = () => {
  const serverURL = `${window.location.protocol}//${window.location.host}`;
  const response_type = "code";
  const client_id = "7vD5-BJ20Kb1pefqWCuPwqEW406UzXV_TRg_OYSxLpE";
  const redirect_uri = `${window.location.protocol}//${window.location.host}`;
  const hrefTarget = `${serverURL}/oauth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  const dispatch = useDispatch();
  const loginCode = useSelector((state) => state.allToots.loginToken);

  useEffect(() => {
    genID();
  }, []);

  return loginCode ? (
    <Button icon={<UserExpert />} onClick={() => dispatch(clearToken())} />
  ) : (
    <Button icon={<Login />} success={false} href={hrefTarget} />
  );
};

export default LoginButton;

async function genID() {
  let domain = new URL(`${window.location.protocol}//${window.location.host}`);
  domain = domain.hostname.replace("heb.", "");

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

  const response = await fetch(`${window.location.protocol}//${domain}/api/v1/apps`, {
    method: "POST",
    body: formData,
  });

  console.log(response);
  return(response)
}
