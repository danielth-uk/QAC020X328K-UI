import React, { useState } from "react";
import axios from "axios";

function inputClean(string, state) {
  state(string.replace(/\s/g, ""));
}
function capitalizeFirstLetter(string) {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (error) {
    return string;
  }
}

const AdminNewUser = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const [userAdded, setUserAdded] = useState(false);
  const [newOrg, setNewOrg] = useState("");

  console.log(newOrg);
  return (
    <div>
      <div className="container p-5 pr-10">
        <div className="indicator w-full mt-4">
          <span className="indicator-item badge">Required</span>
          <input
            type="text"
            placeholder="User's Name"
            className={
              showError
                ? "input input-bordered w-full input-error"
                : "input input-bordered w-full"
            }
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setShowError(false);
            }}
          />
        </div>
        <div className="indicator w-full mt-6">
          <span className="indicator-item badge">Required</span>
          <input
            type="text"
            placeholder="New Username"
            onChange={(e) => {
              inputClean(e.target.value, setNewUsername);
              setShowError(false);
            }}
            value={newUsername}
            className={
              showError
                ? "input input-bordered w-full input-error"
                : "input input-bordered w-full"
            }
          />
        </div>
        {props.org ? (
          <div className="indicator w-full mt-6">
            <span className="indicator-item badge">Required</span>
            <select
              className={
                showError
                  ? "select select-bordered w-full input-error"
                  : "select select-bordered w-full"
              }
              onChange={(e) => setNewOrg(e.target.value)}
            >
              <option value="">New Org</option>
              <option disabled>Select Org</option>
              {props.org.map((element) => (
                <option value={element}>
                  {capitalizeFirstLetter(element)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <></>
        )}

        <div className="indicator w-full mt-6">
          <input
            type="text"
            placeholder="Enter new org name..."
            onChange={(e) => {
              inputClean(e.target.value, setNewOrg);
              setShowError(false);
            }}
            value={newOrg}
            className={
              showError
                ? "input input-bordered w-full input-error"
                : "input input-bordered w-full"
            }
          />
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
      <div
        className="alert alert-success shadow-lg"
        style={{ display: showPassword ? "block" : "none" }}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {newUsername}'s password is:{" "}
            <kbd className="kbd" style={{ color: "white" }}>
              {password}
            </kbd>
          </span>
        </div>
      </div>

      <div className="modal-action">
        {!userAdded ? (
          <>
            <button
              className="btn"
              style={{ marginLeft: "0px" }}
              onClick={() => {
                setUserAdded(false);
                setShowError(false);
                setShowPassword(false);
                setNewUsername("");
                setNewName("");
                props.changeState(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                setShowError(false);
                if (
                  newName === "" || newUsername === "" || props.org
                    ? newOrg === ""
                    : ""
                ) {
                  setShowError(true);
                  setErrorText("All fields must have an input");
                } else {
                  axios
                    .post("/api/admin/users/", {
                      username: newUsername,
                      org: props.org ? newOrg : "qa",
                      name: newName,
                      admin: props.org ? false : true
                    })
                    .then((response) => {
                      if (response.data.status_code === 201) {
                        props.setForceReload(!props.forceReload);

                        setShowPassword(true);
                        setPassword(response.data.headers["password"]);
                        setUserAdded(true);
                      } else if (response.data.status_code === 412) {
                        setShowError(true);
                        setErrorText("Error, Username already exists.");
                      } else {
                        setShowError(true);
                        setErrorText("Whoops! Something went wrong.");
                      }
                    });
                }
              }}
            >
              Add
            </button>
          </>
        ) : (
          <button
            className="btn"
            style={{ marginLeft: "0px" }}
            onClick={() => {
              setUserAdded(false);
              setShowError(false);
              setShowPassword(false);
              setNewUsername("");
              setNewName("");
              props.changeState(false);
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminNewUser;
