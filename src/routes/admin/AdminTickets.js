import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

import TableLoading from "../../components/main/TableLoading";
import Modal from "../../components/main/Modal";

const AdminTickets = (props) => {
  const [tableData, setTableData] = useState([]);

  const cookies = new Cookies();

  useEffect(() => {
    axios
      .get(`/api/admin/tickets`)
      .then((response) => setTableData(response.data));
  }, []);

  console.log(tableData);

  return (
    <>
      <div className="md:container mx-auto mt-14">
        <div className="text-center">
          <h1 className="text-4xl">Open Tickets</h1>
        </div>
        <br />

        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Last Updated</th>
                <th>Ticket Subject</th>
                <th>Assigned Agent</th>
                <th>Tags</th>
                <th>Created By</th>
                <th>Org</th>
                <th></th>
              </tr>
            </thead>
            {tableData.length === 0 ? (
              <TableLoading columns={7} key={"loadingTable"} />
            ) : (
              <tbody>
            {tableData.map((row) => (
              <>
                {row["closed"] === 0 ? (
                  <tr>
                    <td>
                      {row["last_message"] === null
                        ? row["opened_time"].split("T").join(" ")
                        : row["last_message"].split("T").join(" ")}
                    </td>
                    <td>{row["subject"]}</td>
                    <td>
                      {row["assigned_contact"] === null ? (
                        <div className="badge badge-secondary">Unassigned</div>
                      ) : (
                        <div className="badge badge-primary">
                          {row["assigned_name"]}
                        </div>
                      )}
                    </td>
                    <td>
                      {row["tags"] === null
                        ? ""
                        : row["tags"]
                            .split(",")
                            .map((tag) => (
                              <span className="badge badge-ghost">{tag}</span>
                            ))}
                    </td>
                    <td>{row["created_name"]}</td>
                    <td>
                      {row["org"].charAt(0).toUpperCase() + row["org"].slice(1)}
                    </td>
                    <td>
                      <a href={`/Admin/Tickets/${row["id"]}`} rel="noreferrer">
                        <button className="btn btn-ghost btn-xs">
                          Details
                        </button>
                      </a>
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
              </>
            ))}
            </tbody>
            )}
          </table>
        </div>
        <br />
        <hr />
        <br />
        <div className="text-center">
          <h1 className="text-4xl">Closed Tickets</h1>
        </div>
        <br />

        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Last Updated</th>
                <th>Ticket Subject</th>
                <th>Assigned Agent</th>
                <th>Tags</th>
                <th>Created By</th>
                <th>Org</th>
                <th></th>
              </tr>
            </thead>
            {tableData.length === 0 ? (
              <TableLoading columns={7} key={"loadingTable"} />
            ) : (
              <tbody>
                {tableData.map((row) => (
                  <>
                    {row["closed"] === 1 ? (
                      <tr>
                        <td>
                          {row["last_message"] === null
                            ? row["opened_time"].split("T").join(" ")
                            : row["last_message"].split("T").join(" ")}
                        </td>
                        <td>{row["subject"]}</td>
                        <td>
                          {row["assigned_contact"] === null ? (
                            <div className="badge badge-secondary">
                              Unassigned
                            </div>
                          ) : (
                            <div className="badge badge-primary">
                              {row["assigned_name"]}
                            </div>
                          )}
                        </td>
                        <td>
                          {row["tags"] === null
                            ? ""
                            : row["tags"]
                                .split(",")
                                .map((tag) => (
                                  <span className="badge badge-ghost">
                                    {tag}
                                  </span>
                                ))}
                        </td>
                        <td>{row["created_name"]}</td>
                        <td>
                          {row["org"].charAt(0).toUpperCase() +
                            row["org"].slice(1)}
                        </td>
                        <td>
                          <a
                            href={`/Admin/Tickets/${row["id"]}`}
                            rel="noreferrer"
                          >
                            <button className="btn btn-ghost btn-xs">
                              Details
                            </button>
                          </a>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminTickets;
