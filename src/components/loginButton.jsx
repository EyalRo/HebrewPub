import React from "react";
import { Login, UserExpert } from "grommet-icons";
import { Button } from "grommet";
import { useSelector, useDispatch } from "react-redux";

import { clearToken } from "../features/toots/allTootSlice";

const LoginButton = () => {
  const serverURL = "https://kishkush.net";
  const response_type = "code";
  const client_id = "7vD5-BJ20Kb1pefqWCuPwqEW406UzXV_TRg_OYSxLpE";
  const redirect_uri = `${window.location.protocol}//${window.location.host}`;
  const hrefTarget = `${serverURL}/oauth/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  const dispatch = useDispatch();
  const loginCode = useSelector((state) => state.allToots.loginToken);

  return loginCode ? (
    <Button icon={<UserExpert />} onClick={() => dispatch(clearToken())} />
  ) : (
    <Button icon={<Login />} success={false} href={hrefTarget} />
  );
};

export default LoginButton;
