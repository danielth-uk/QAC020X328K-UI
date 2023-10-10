import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { useQuill } from "react-quilljs";
import { Steps } from "intro.js-react";


import AddComment from "../../components/main/AddComment";
import Comment from "../../components/main/Comment";
import LargeLoading from "../../components/main/LargeLoading";

const AdminSelectedTicket = () => {
  const [ticketData, setTicketData] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [reloadComments, setReloadComments] = useState(false);
  const [setAssigned, setSetAssigned] = useState(false);
  const [allAdmins, setAllAdmins] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagInputEnabled, setTagInputEnabled] = useState(false);

  const [showHelp ,setShowHelp] = useState(false)
  const [helpSteps, setHelpSteps] = useState([
    {
      element: ".intro-stage-0",
      intro: "This is the main ticket and subject",
    },
    {
      element: ".intro-stage-1",
      intro: "Click here to change the assigned user",
    },
    {
      element: ".intro-stage-2",
      intro: "Click here to change the tags, press enter when completed",
    }
    ,
    {
      element: ".intro-stage-3",
      intro: "Click here to close the ticket",
    }
    ,
    {
      element: ".intro-stage-4",
      intro: "Type here and click 'Add Comment' to add a comment with formatting",
    }
  ])

  const cookies = new Cookies();

  let params = useParams();

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: false
    }
  });

  useEffect(() => {
    if (quill) {
      quill.enable(false);
      if (ticketData) {
        quill.setContents(ticketData["main_body"]);
      }
    }
  }, [quill, ticketData]);

  useEffect(() => {
    axios
      .get(
        `/api/general/tickets/${
          params.ticketID
        }?org=${cookies.get("org").toLowerCase()}`
      )
      .then((response) => {
        if (response.data.status_code === undefined) {
          setTicketData(response.data);
          setLoading(false);
        } else {
          window.location.href = "/404";
        }
      });
  }, [reloadComments]);

  useEffect(() => {
    axios
      .get(
        `/api/general/tickets/${params.ticketID}/comments`
      )
      .then((response) => {
        if (response.data.status_code === undefined) {
          setComments(response.data);
          setCommentsLoading(false);
        } else {
          window.location.href = "/404";
        }
      });
  }, [reloadComments]);

  useEffect(() => {
    axios.get("/api/admin/getAdmins").then((response) => {
      setAllAdmins(response.data);
    });
  }, []);

  function handleTagInput(e) {
    if (e.key !== undefined) {
      if (e.key === "Enter") {
        setTagInputEnabled(false);
        if (tagInput !== "") {
          ticketData.tags = tagInput.split(",").join(", ");
          axios
            .put(`/api/admin/tags/`, {
              tags: tagInput,
              ticketId: params.ticketID
            })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    } else {
      setTagInput(e.target.value);
    }
  }

  return (
    <>
    <Steps
          enabled={showHelp}
          steps={helpSteps}
          initialStep={0}
          onExit={() => setShowHelp(false)}
        />
      <div className="md:container mx-auto mt-14">
        <button
          className="btn btn-accent btn-sm mb-6"
          onClick={() => (window.location.href = ".")}
        >
          Back
        </button>
        <button className="btn btn-sm ml-4 btn-info" onClick={() => setShowHelp(true)}>HELP</button>
        <div className="flex">
          <div className="columns-7xl mr-4">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body intro-stage-0">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-3 bg-slate-700 rounded w-80"></div>
                  </div>
                ) : (
                  <h2 className="card-title text-5xl">{ticketData.subject}</h2>
                )}
                <div className="quill-textarea">
                  {loading ? <LargeLoading /> : <div ref={quillRef} />}
                </div>
                <label className="label">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-2 bg-slate-700 rounded w-40"></div>
                    </div>
                  ) : (
                    <span className="label-text-alt">
                      Ticket Created:{" "}
                      {ticketData.opened_time.split("T").join(" ")}
                    </span>
                  )}
                </label>
              </div>
            </div>
            <div className="divider"></div>
            <h2 className="card-title text-5xl">Comments</h2>
            <div className="mt-5">
              {commentsLoading ? (
                <div className="text-center">
                  <button className="btn btn-accent w-80 loading">
                    Loading Comments
                  </button>
                </div>
              ) : (
                <>
                  {comments.length === 0 ? (
                    <h1 className="text-center text-xl">No Comments</h1>
                  ) : (
                    comments.map((comment) => (
                      <Comment
                        closed={ticketData.closed}
                        body={comment["comment_body"]}
                        time={comment["posted"]}
                        name={comment["posted_name"]}
                        id={comment["id"]}
                        owner={comment["posted_by"]}
                        edited={comment["updated"]}
                        refresh={reloadComments}
                        setRefresh={setReloadComments}
                      />
                    ))
                  )}
                </>
              )}
            </div>
            {ticketData.closed === 1 ? (
              <div className="mt-10 text-center text-xl">
                <i>This ticket is now closed.</i>
              </div>
            ) : (
              <AddComment
                refreshComments={reloadComments}
                setRefreshComments={setReloadComments}
              />
            )}
          </div>

          <div className="columns-2xl ml-8">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-3 bg-slate-700 rounded w-80"></div>
                  </div>
                ) : (
                  <h2 className="card-title justify-center">
                    Ticket Number {params.ticketID}
                  </h2>
                )}

                <div className="w-ful">
                  <div className="divider"></div>
                </div>
                <div className="flex items-center p-1">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-3 bg-slate-700 rounded w-80"></div>
                    </div>
                  ) : (
                    <>
                      <span className=" text-s mr-5">Created By: </span>
                      <kbd className="kbd">{ticketData.created_name}</kbd>
                    </>
                  )}
                </div>

                <div className="flex items-center p-1">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-3 bg-slate-700 rounded w-80"></div>
                    </div>
                  ) : (
                    <>
                      <span className=" text-s  mr-5">Assigned To: </span>
                      {setAssigned && allAdmins.length > 0 ? (
                        <select
                          className="select select-bordered select-sm"
                          onChange={(e) => {
                            axios
                              .put(
                                `/api/admin/updateAdmin/${params.ticketID}`,
                                {
                                  userid: e.target.value,
                                  ticket: params.ticketID
                                }
                              )
                              .then((response) => {
                                setSetAssigned(false);
                                setReloadComments(!reloadComments);
                              });
                          }}
                        >
                          {ticketData.assigned_name === null ? (
                            <option disabled selected>
                              Unassigned
                            </option>
                          ) : (
                            <option disabled>Unassigned</option>
                          )}
                          {allAdmins.map((admin) => (
                            <option
                              value={admin["userid"]}
                              selected={
                                ticketData.assigned_name === admin["name"]
                              }
                            >
                              {admin["name"]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <kbd
                          className="kbd intro-stage-1"
                          onClick={() =>
                            ticketData.closed === 1 ? {} : setSetAssigned(true)
                          }
                        >
                          {ticketData.assigned_name === null
                            ? "Unassigned"
                            : ticketData.assigned_name}
                        </kbd>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center p-1">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-3 bg-slate-700 rounded w-80"></div>
                    </div>
                  ) : (
                    <>
                      <span className=" text-s mr-5">Last Update: </span>
                      <kbd className="kbd">
                        {ticketData.last_message === undefined ||
                        ticketData.last_message === null ? (
                          "None"
                        ) : (
                          <>{ticketData.last_message.split("T").join(" ")}</>
                        )}
                      </kbd>
                    </>
                  )}
                </div>
                <div className="divider">Tags</div>
                {tagInputEnabled ? (
                  <>
                    <input
                      className="input input-bordered"
                      value={tagInput}
                      placeholder="Separate each tag with a comma..."
                      onKeyDown={handleTagInput}
                      onChange={handleTagInput}
                    />
                  </>
                ) : (
                  <div className="intro-stage-2">
                    {ticketData.tags === undefined ||
                    ticketData.tags === null ? (
                      <div
                        className="text-center"
                        onClick={() => setTagInputEnabled(true)}
                      >
                        <kbd className="kbd ">No Tags</kbd>
                      </div>
                    ) : (
                      <>
                        <div
                          className="card-actions justify-center "
                          onClick={() => {
                            setTagInput(ticketData.tags);
                            setTagInputEnabled(true);
                          }}
                        >
                          {ticketData.tags.split(", ").map((tag) => (
                            <span className="badge">{tag}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {ticketData.closed === 1 ? (
                  <></>
                ) : (
                  <>
                    <div className="divider"></div>
                    <div className="text-center">
                      <button
                        className="btn btn-warning btn-sm intro-stage-3"
                        onClick={() => {
                          axios
                            .put(
                              `/api/admin/closeTicket/${ticketData.id}`
                            )
                            .then((response) => {
                              window.location.reload(false);
                            });
                        }}
                      >
                        close ticket
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSelectedTicket;
