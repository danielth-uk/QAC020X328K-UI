import { Routes, Route } from "react-router-dom";
import axios from "axios"
import Cookies from "universal-cookie";

import NavigationBars from "./components/main/NavigationBars";

import Login from "./routes/Login";
import Register from "./routes/Register";
import Error404 from "./routes/Error404";
import Redirect from "./routes/Redirect";

import ClientHome from "./routes/client/ClientHome";
import ClientTicket from "./routes/client/ClientTicket";

import AdminHome from "./routes/admin/AdminHome";
import AdminUsers from "./routes/admin/AdminUsers";
import AdminClients from "./routes/admin/AdminClients";
import AdminTickets from "./routes/admin/AdminTickets";
import AdminSelectedTicket from "./routes/admin/AdminSelectedTicket"
import AdminCustomQuery from "./routes/admin/AdminCustomQuery";

function App() {
  const cookies = new Cookies();

  // axios.defaults.baseURL = window.location.origin;
  axios.defaults.baseURL = "http://localhost:8000";

  return (
    <Routes>
      <Route path="*" element={<Redirect />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Admin" element={<NavigationBars admin page={<AdminHome />} />} />
      <Route path="/Admin/DB" element={<NavigationBars admin page={<AdminCustomQuery />} />}  />
      <Route path="/Admin/Users" element={<NavigationBars admin page={<AdminUsers />} />}  />
      <Route path="/Admin/Clients" element={<NavigationBars admin page={<AdminClients />} />}  />
      <Route path="/Admin/Tickets" element={<NavigationBars admin page={<AdminTickets />} />}  />
      <Route path="/Admin/Tickets/:ticketID" element={<NavigationBars admin page={<AdminSelectedTicket />} />}  />
      <Route path="/Client" element={<NavigationBars client page={<ClientHome />} />}  />
      <Route path="/Client/OrgTickets" element={<NavigationBars client page={<ClientHome org />} />}  />
      <Route path="/Client/Ticket/:ticketID" element={<NavigationBars client page={<ClientTicket org />} />}  />
      <Route path="/Client/Ticket/" element={<Error404 />}  />

    </Routes>
  );
}

export default App;
