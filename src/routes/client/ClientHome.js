import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

import TableLoading from "../../components/main/TableLoading";
import Modal from "../../components/main/Modal";
import { useQuill } from "react-quilljs";

const ClientHome = (props) => {
  const [pageTitle, setPageTitle] = useState("");
  const [tableData, setTableData] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [dataLoading, setDataLoading] = useState(true)
  const [ticketWordCount, setTicketWordCount] = useState(0);
  const [ticketSubject, setTicketSubject] = useState("");
  const [refreshData, setRefreshData] = useState(false)
  const cookies = new Cookies();

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large"] }],
        [{ header: [1, 2, 3, false] }],
        [{ color: [] }, { background: [] }],
        ["clean"]
      ]
    }
  });

  useEffect(() => {
    var orgPage = false;
    if (props.org) {
      setPageTitle("My Org Tickets");
      orgPage = true;
    } else {
      setPageTitle("My Tickets");
    }
    axios
      .get(`/api/client/tickets?org=${orgPage}`)
      .then((response) => {
        setDataLoading(false)
        setTableData(response.data)
      });
  }, [refreshData]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        var wordCount = quill.getText().length - 1;
        var limit = 350;
        setTicketWordCount(wordCount);
        if (wordCount > limit) quill.deleteText(limit, quill.getLength());
      });
    }
  }, [quill]);

  return (
    <>
      <Modal open={modalState} title={"New Ticket"} size="large">
        <div>
          <div className="indicator w-full mt-4">
            <input
              type="text"
              placeholder="Subject"
              className="input input-bordered w-full"
              value={ticketSubject}
              maxLength={16}
              onChange={(e) => {
                setTicketSubject(e.target.value);
              }}
            />
          </div>

          <div className="mt-4 textarea quill-textarea textarea-bordered ">
            <div ref={quillRef} />
            <label className="label">
              <span className="label-text-alt">Ticket Body</span>
              <span className="label-text-alt">{ticketWordCount}/350 Words</span>
            </label>
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                setModalState(false);
                setTicketWordCount(0);
                setTicketSubject("");
                quill.clipboard.dangerouslyPasteHTML("");
              }}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                try {
                  axios.post("/api/client/tickets", {
                  username: cookies.get("username"),
                  org: cookies.get("org").toLowerCase(),
                  subject: ticketSubject,
                  body: quill.getContents()
                }).then(response => {
                  console.log(response)
                  if(response.data.status_code === 201){
                    setRefreshData(!refreshData)
                    setModalState(false);
                    setTicketWordCount(0);
                    setTicketSubject("");
                    quill.clipboard.dangerouslyPasteHTML("");
                  }
                  else{
                    alert("Whoops something went wrong")
                  }
                }).catch(error => {
                  alert("Whoops something went wrong")
                })
                } catch (error) {
                  alert("Whoops something went wrong") 
                }
              }}
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </Modal>

      <div className="md:container mx-auto mt-14">
        <div className="text-center">
          <h1 className="text-4xl">{pageTitle}</h1>
        </div>
        {!props.org ? (
          <div className="text-right">
            <button
              className="btn btn-success"
              onClick={() => setModalState(true)}
            >
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
              New Ticket
            </button>
          </div>
        ) : (
          <></>
        )}
        <br />

        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Last Updated</th>
                <th>Ticket Subject</th>
                <th>Assigned Agent</th>
                <th>Tags</th>
                {props.org ? <th>Created By</th> : <></>}
                <th></th>
                <th></th>
              </tr>
            </thead>
            {dataLoading ? (
              <TableLoading columns={props.org ? 5 : 4} key={"loadingTable"} />
            ) : (
              <tbody>
                {tableData.length === 0 ? <tr><td colSpan={4}  className="text-center">No Tickets</td></tr> : tableData.map((row) => (
                  <tr>
                    <td>{row["last_message"] === null ? row["opened_time"].split("T").join(" ") : row["last_message"].split("T").join(" ")}</td>
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
                      {row["tags"] === null ? "" : row["tags"].split(",").map((tag) => (
                        <span className="badge badge-ghost">{tag}</span>
                      ))}
                    </td>
                    {props.org ? <td>{row["created_name"]}</td> : <></>}
                    <td></td>
                    <td>
                      <a href={`/Client/Ticket/${row["id"]}`} rel="noreferrer">
                        <button className="btn btn-ghost btn-xs">
                          Details
                        </button>
                      </a>
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

export default ClientHome;
