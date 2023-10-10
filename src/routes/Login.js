import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { validationError } from "../components/validation";
import {encode, decode} from 'base-64';


import { object, string } from "yup";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNew, setShowNew] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("password");
  const [demoCredentials, setDemoCredentials] = useState({});
  const cookies = new Cookies();

  useEffect(() => {
    axios.get("/api/auth/demo").then((response) => {
      setDemoCredentials(response.data);
    });
  }, []);

  if (cookies.get("Authorized") === "Admin") {
    window.location.href = window.location.origin + "/Admin";
  } else if (cookies.get("Authorized") === "Client") {
    window.location.href = window.location.origin + "/Client";
  }

  if (searchParams.get("newUser") === "1" && !showNew) {
    setShowNew(true);
  }

  let loginSchema = object({
    username: string()
      .required(validationError("required", "Username"))
      .min(5, validationError("min", "Username", 5))
      .max(255, validationError("max", "Username", 255))
      .trim(validationError("space", "Username")),
    password: string()
      .required(validationError("required", "Password"))
      .min(8, validationError("min", "Password", 8))
      .max(255, validationError("max", "Password", 255))
  });

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left p-5">
            <h1 className="text-5xl font-bold">QA Ticketing Solution</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <div
              className="container md:mx-auto place-content-center"
              style={{ display: "flex" }}
            >
              {Object.keys(demoCredentials).length > 0 ? (
                <div className="columns-auto p-4">
                  <div className="mockup-code">
                    <pre>
                      <code>Demo Administrator Credentials</code>
                    </pre>
                    <pre>
                      <code>
                        Username: {demoCredentials["admin"]["username"]}
                      </code>
                    </pre>
                    <pre>
                      <code>
                        Password: {decode(demoCredentials["admin"]["password"])}
                      </code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="columns-auto p-4 animate-pulse ">
                  <div className="mockup-code p-5">
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {Object.keys(demoCredentials).length > 0 ? (
                <div className="columns-auto p-4">
                  <div className="mockup-code">
                    <pre>
                      <code>Demo Customer Credentials</code>
                    </pre>
                    <pre>
                      <code>
                        Username: {demoCredentials["client"]["username"]}
                      </code>
                    </pre>
                    <pre>
                      <code>
                        Password: {decode(demoCredentials["client"]["password"])}
                      </code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="columns-auto p-4 animate-pulse ">
                  <div className="mockup-code p-5">
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
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
                <label className="label">
                  <a
                    href="./ForgotPassword"
                    className="label-text-alt link link-hover"
                  >
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    setShowError(false);
                    var temp = {
                      username: username,
                      password: encode(password)
                    };

                    try {
                      const values = await loginSchema.validate(temp, {
                        strict: true
                      });

                      axios
                        .post("/api/auth", values)
                        .then((response) => {
                          
                          if (response.data.detail === "Authenticated") {
                            cookies.set("jwt", response.data.headers["jwt"] ,{ sameSite: "strict", maxAge: 5000 })


                            cookies.set(
                              "Authorized",
                              response.data.headers["Authorization"],
                              { sameSite: "strict", maxAge: 5000 }
                            );
                            cookies.set("name", response.data.headers["name"], {
                              sameSite: "strict",
                              maxAge: 5000
                            });
                            cookies.set("username", username, {
                              sameSite: "strict",
                              maxAge: 5000
                            });
                            cookies.set("org", response.data.headers["org"], {
                              sameSite: "strict",
                              maxAge: 5000
                            });
                            if (response.data.headers["Authorization"] === "Admin")
                              window.location.href = "../Admin";
                            else if (
                              response.data.headers["Authorization"] === "Client"
                            ) {
                              window.location.href = "../Client";
                            } else window.location.href = "../404";
                          } else {
                            setErrorText(
                              "Error! Incorrect Username or Password"
                            );
                            setShowError(true);
                          }
                        }).catch(error => {
                          setErrorText(
                            "Error! Incorrect Username or Password"
                          );
                          setShowError(true);
                        })
                    } catch (error) {
                      setShowError(true);
                      setErrorText(error.message);
                    }
                  }}
                >
                  Login
                </button>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => (window.location.href = "../Register")}
                >
                  Register Here
                </button>

                <div
                  className="alert alert-success shadow-lg mt-5"
                  style={{ display: showNew ? "block" : "none" }}
                >
                  <div>
                    <span>Your user was successfully created!</span>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
