import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import encrypt from "../../utils/encrypt";
import { checkStatus } from "../../utils/passwordStrength";

import InputComponent from "../../components/inputComponent/inputComponent";

import { getBasicData } from "../../scripts/_getBasicData";
import packageJson from "../../../package.json";

import "../Login/_style.sass";

const userSVG: string = require("../../assets/login/user.svg").default;

const apiLink = packageJson.proxy;

interface dataI {
  username: string;
  hashedPassword: string;
}

const SignUp = () => {
  const sendData = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (password0 !== password1){
      alert("Passwords do not match");
      return;
    }

    const hashedPassword = encrypt(password0);
    const data: dataI = { username, hashedPassword };

    axios
      .post(`${apiLink}/api/users/register`, data)
      .then((res) => {
        console.log("res", res.data);
        if (res.data.success) {
          setUsername("");
          setPassword0("");
          setPassword1("");
          alert("Registration was successful");
        } else {
          alert(`Registration failed: ${res.data.data}`);
        }
      })
      .catch((err) => console.log(err));
  };

  const [username, setUsername] = useState<string>("");
  const [password0, setPassword0] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");

  const [passwordStatus, setPasswordStatus] = useState<"" | "weak" | "normal" | "strong">("");
  const [match, setMatch] = useState<"" | "passwords must match" | "match">("");

  const history = useHistory();

  useEffect(() => {
    document.title = "sign up";
    getBasicData({ history });
  }, []);

  useEffect(() => {
    checkStatus(password0, password1, setPasswordStatus, setMatch);
  }, [password0, password1]);

  return (
    <div className="sign-up">
      <div className="top">
        <img src={userSVG} alt="user" className="user" />
        <h2 className="title">Member sign up</h2>
      </div>

      <InputComponent input={username} setInput={setUsername} defaultText="Username" type="text" />
      <div className="signup-password">
        <InputComponent input={password0} setInput={setPassword0} defaultText="Password" type="password" />
        <h5 className={`${passwordStatus !== "" ? "display" : ""} ${passwordStatus === "strong" ? "green" : ""}`}>{passwordStatus}</h5>
      </div>
      <div className="signup-password">
        <InputComponent input={password1} setInput={setPassword1} defaultText="Repeat password" type="password" />
        <h5 className={`${match !== "" ? "display" : ""} ${match === "match" ? "green" : ""}`}>{match}</h5>
      </div>

      <button className="button margin-top" onClick={(event) => sendData(event)}>
        SIGN UP
      </button>
      <a href="#" className="back">
        ← go back
      </a>
    </div>
  );
};

export default SignUp;
