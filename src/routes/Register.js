import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import {encode} from 'base-64';
import PasswordChecklist from "react-password-checklist";

const Register = () => {
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [name, setName] = useState("")
  const [adminCode, setAdminCode] = useState("")
  

  const [stage, setStage] = useState(1);

  const cookies = new Cookies();

  if (cookies.get("Authorized") === "Admin") {
    window.location.href = window.location.origin + "/Admin";
  } else if (cookies.get("Authorized") === "Client") {
    window.location.href = window.location.origin + "/Client";
  }

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content">
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="card-title text-2xl font-bold text-center">
                QA Ticketing Solution Register
              </div>
              {
                {
                  1: (
                    <div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Enter your organization*
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Organization"
                          value={organization}
                          className={
                            showError
                              ? "input input-bordered input-error "
                              : "input input-bordered"
                          }
                          onChange={(e) => {
                            setOrganization(e.target.value);
                            setShowError(false);
                          }}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Enter your name*
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Name"

                          value={name}
                          className={
                            showError
                              ? "input input-bordered input-error "
                              : "input input-bordered"
                          }
                          onChange={(e) => {
                            setName(e.target.value);
                            setShowError(false);
                          }}
                        />
                      </div>
                      <div className="form-control mt-6 ">
                        <div className="flex">
                        <button
                          className="btn btn-primary m-1"
                          style={{ width: "calc(50% - 0.5rem)" }}
                          onClick={() => {
                            window.location.href = "../Login"
                          }}
                        >
                          Have an Account?
                        </button>
                        <button
                          className="btn btn-accent m-1"
                          style={{ width: "calc(50% - 0.5rem)" }}
                          onClick={() => {
                            setStage(2);
                          }}
                        >
                          Next
                        </button>
                        </div>
                        <div
                          className="alert alert-error shadow-lg mt-5"
                          style={{ display: showError ? "block" : "none" }}
                        >
                          <div>
                            <span>{errorText}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                  2: (
                    <div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Username</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Username"
                          value={username}
                          className={
                            showError
                              ? "input input-bordered input-error "
                              : "input input-bordered"
                          }
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setShowError(false);
                          }}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          className={
                            showError
                              ? "input input-bordered input-error "
                              : "input input-bordered"
                          }
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setShowError(false);
                          }}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confPassword}
                          className={
                            showError
                              ? "input input-bordered input-error "
                              : "input input-bordered"
                          }
                          onChange={(e) => {
                            setConfPassword(e.target.value);
                            setShowError(false);
                          }}
                        />
                      </div>
                      <br />
                      <PasswordChecklist
                          rules={["minLength","specialChar","number","capital","match"]}
                          minLength={10}
                          value={password}
                          valueAgain={confPassword}
                          onChange={(isValid) => setValidPassword((isValid))}
                        />
                      <div className="form-control mt-6">
                        <div className="text-center">
                          <div className="flex">
                            <button
                              className="btn btn-secondary m-1"
                              style={{ width: "calc(50% - 0.5rem)" }}
                              onClick={() => {
                                setStage(1);
                              }}
                            >
                              Back
                            </button>
                            <button
                              className="btn btn-accent m-1"
                              style={{ width: "calc(50% - 0.5rem)" }}
                              onClick={() => {
                                setStage(3);
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                        <div
                          className="alert alert-error shadow-lg mt-5"
                          style={{ display: showError ? "block" : "none" }}
                        >
                          <div>
                            <span>{errorText}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                  3: (
                    <div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Admin Code (Optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Admin Code"
                          value={adminCode}
                          className={
                            showError
                              ? "input input-bordered input-error "
                              : "input input-bordered"
                          }
                          onChange={(e) => {
                            setAdminCode(e.target.value);
                            setShowError(false);
                          }}
                        />
                      </div>
                      <div className="form-control mt-6">
                        <div className="text-center flex">
                          <button
                            className="btn btn-secondary m-1"
                            style={{ width: "calc(50% - 0.5rem)" }}
                            onClick={() => {
                              setStage(2);
                            }}
                          >
                            Back
                          </button>
                          <button
                            className="btn btn-accent m-1"
                            style={{ width: "calc(50% - 0.5rem)" }}
                            onClick={() => {
                              if(validPassword){
                                if(username === "" || organization === "" || name === "" || password === "" || confPassword === ""){
                                  setShowError(true)
                                  setErrorText("You are missing a field")
                                }
                                else{
                                  if(username.includes(" ")){
                                    setShowError(true)
                                    setErrorText("You cannot have a space in the username")
                                  }
                                  else{
                                    axios.post("/api/register", {
                                      "username": username,
                                      "org": organization,
                                      "password": encode(password),
                                      "name": name,
                                      "admin": adminCode !== "" ? true : false,
                                      "adminCode": adminCode
                                    }).then(response => {
                                      window.location.href = "/Login?newUser=1"
                                    }).catch(error => {
                                      setShowError(true)
                                    setErrorText(error.response.data.reason)
                                    })
                                  }

                                }

                              }
                              else{
                                setShowError(true)
                                setErrorText("Passwords do not meet requirements")
                              }

                            }}
                          >
                            Complete
                          </button>
                        </div>
                        <div
                          className="alert alert-error shadow-lg mt-5"
                          style={{ display: showError ? "block" : "none" }}
                        >
                          <div>
                            <span>{errorText}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }[stage]
              }
            </div>
          </div>
          <div className="mockup-code">
            <pre>
              <code>Admin Code</code>
            </pre>
            <pre>
              <code>Code: `123456789`</code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
