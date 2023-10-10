import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios"

import AdminNavigation from "../admin/AdminNavigation";
import ClientNavigation from "../client/ClientNavigation";
import Footer from "./Footer";

const NavigationBars = (props) => {
  const cookies = new Cookies();

  axios.defaults.headers.common['Authorization'] = cookies.get('jwt')
    
  // Checks page Auth
  useEffect(() => {
    if (
      (props.admin &&
        window.location.pathname.split("/")[1].toLowerCase() === "admin" &&
        cookies.get("Authorized") === "Admin") ||
      (props.client &&
        window.location.pathname.split("/")[1].toLowerCase() === "client" &&
        cookies.get("Authorized") === "Client")
    ) {
      //pass
    } else {
      window.location.href = window.location.origin;
    }

  }, []);


  return (
    <div>
      <div>{props.client ? <ClientNavigation /> : <AdminNavigation />}</div>
      <div style={wrapper}>{props.page}</div>
      <div><Footer /></div>
    </div>
  );
};

const wrapper ={
  minHeight: "calc(100vh - 116px)",
  paddingTop: "3.5rem",
  paddingBottom: "3.5rem"
}

export default NavigationBars;


