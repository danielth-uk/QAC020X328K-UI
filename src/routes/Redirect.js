import React from 'react'
import Cookies from 'universal-cookie';


const Redirect = () => {
  const cookies = new Cookies();


  if(cookies.get("Authorized") === undefined){
    window.location.href = window.location.origin + "/Login"
  }
  else if(cookies.get("Authorized") === "Admin"){
    window.location.href = window.location.origin + "/Admin"
  }
  else if(cookies.get("Authorized") === "Client"){
    window.location.href = window.location.origin + "/Client"
  }
  else {
    window.location.href = window.location.origin + "/404"
  }


  return (<></>)
}

export default Redirect