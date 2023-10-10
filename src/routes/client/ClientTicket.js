import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { useQuill } from "react-quilljs";

import AddComment from "../../components/main/AddComment";
import Comment from "../../components/main/Comment";
import LargeLoading from "../../components/main/LargeLoading";

const ClientTicket = () => {
  const [ticketData, setTicketData] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [reloadComments, setReloadComments] = useState(false);

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

  return (
    <>
      <div className="md:container mx-auto mt-14">
        <div className="flex">
          <div className="columns-7xl mr-4">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
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
                        body={comment["comment_body"]}
                        time={comment["posted"]}
                        name={comment["posted_name"]}
                        owner={comment["posted_by"]}
                        edited={comment["updated"]}
                        id={comment["id"]}
                        refresh={reloadComments}
                        setRefresh={setReloadComments}
                      />
                    ))
                  )}
                </>
              )}
            </div>
            {
              ticketData.closed === 1 ? <div className="mt-10 text-center text-xl"><i>This ticket is now closed.</i></div> : <AddComment
              refreshComments={reloadComments}
              setRefreshComments={setReloadComments}
            />
            }
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
                      <kbd className="kbd">
                        {ticketData.assigned_name === null
                          ? "Unassigned"
                          : ticketData.assigned_name}
                      </kbd>
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

                {ticketData.tags === undefined || ticketData.tags === null ? (
                  <></>
                ) : (
                  <>
                    <div className="divider">Tags</div>
                    <div className="card-actions justify-center">
                      {ticketData.tags.split(", ").map((tag) => (
                        <span className="badge">{tag}</span>
                      ))}
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

export default ClientTicket;
