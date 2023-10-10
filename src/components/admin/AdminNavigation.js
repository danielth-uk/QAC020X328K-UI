import React from "react";
import Cookies from "universal-cookie";

const AdminNavigation = () => {
  const cookies = new Cookies();

  return (
    <div className="navbar text-neutral-content">
      <div className="navbar-start">
        <a
          className="btn btn-ghost normal-case text-xl"
          href={window.location.origin + "/Admin"}
        >
          QA Ticketing Solution - Admin
        </a>
      </div>
      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <a href={window.location.origin + "/Admin/"}>Home</a>
          </li>
          <li>
            <a href={window.location.origin + "/Admin/Tickets"}>Tickets</a>
          </li>
          <li>
            <a href={window.location.origin + "/Admin/Clients"}>Clients</a>
          </li>
          <li>
            <a href={window.location.origin + "/Admin/Users"}>Users</a>
          </li>
          <li>
            <a href={window.location.origin + "/Admin/DB"}>Custom DB Query</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end pr-5">
        {" "}
        <ul className="menu menu-horizontal p-0 mr-4">
          <li>Hello! {cookies.get("name")}</li>
        </ul>
        {" "}
        <button
          className="btn"
          onClick={() => {
            cookies.remove("Authorized");
            window.location.href = window.location.origin + "/Login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;
