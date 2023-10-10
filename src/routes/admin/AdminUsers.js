import React, { useEffect, useState } from "react";
import axios from "axios";

import TableLoading from "../../components/main/TableLoading";
import Modal from "../../components/main/Modal";
import AdminNewUser from "../../components/admin/AdminNewUser";
import AdminEditUser from "../../components/admin/AdminEditUser";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editModalData, setEditModalData] = useState([]);
  const [forceReload, setForceReload] = useState(false)
  useEffect(() => {
    axios
      .get("/api/admin/users/admin")
      .then((response) => {
        setUsers(response.data);
      });
  }, [forceReload]);

  return (
    <>
      <Modal
        open={modalState}
        title={modalType === "new" ? "New User Modal" : "Edit User Modal"}
      >
        {modalType === "new" ? (
          <AdminNewUser changeState={setModalState}  forceReload={forceReload} setForceReload={setForceReload}/>
        ) : (
          <AdminEditUser changeState={setModalState} editModalData={editModalData} forceReload={forceReload} setForceReload={setForceReload}/>
        )}
      </Modal>
      <div className="md:container mx-auto mt-14">
        <div className="text-center">
          <h1 className="text-lg">Admin Users</h1>
        </div>
        <div className="text-right">
          <button
            className="btn btn-success modal-button"
            onClick={() => {
              setModalState(true);
              setModalType("new");
            }}
          >
            Add{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <table className="table w-full bg-base-200">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            {users.length === 0 ? (
              <TableLoading columns={3} />
            ) : (
              <tbody>
                {users.map((row) => (
                  <tr className="hover" key={row["userid"] + "-row"}>
                    {console.log(row)}
                    <td>{row["userid"]}</td>
                    <td>{row["name"]}</td>
                    <td className="text-right pr-10">
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => {
                          setModalState(true);
                          setModalType("edit");
                          setEditModalData(row)
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>{" "}
                      <button className="btn btn-sm btn-square" onClick={() =>{
                        axios.delete(`/api/admin/users/${row["userid"]}`).then(response => {
                          setForceReload(!forceReload)
                        })
                      }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
