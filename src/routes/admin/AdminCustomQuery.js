import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Steps } from "intro.js-react";


const AdminCustomQuery = () => {
  const [responseData, setResponseData] = useState("");
  const [responseStatus, setResponseStatus] = useState(200);
  const [query, setQuery] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");
  const [selectedPrevious, setSelectPrevious] = useState(false)

  const [showHelp ,setShowHelp] = useState(false)
  const [helpSteps, setHelpSteps] = useState([
    {
      element: ".intro-stage-0",
      intro: "Here you can run any query in the database, the existing tables are 'tbl_users', 'tbl_ticket_comments' and 'tbl_tickets' and you will get the results below the query input.",
    }
  ])


  const inputItem = useRef(null)

  function runQuery() {
    axios
      .post("/api/admin/danger", { query: query })
      .then((e) => {
        // console.log(e.data);
        if (e.data.status_code === 500) {
          setResponseStatus(500);
          if (e.data.headers.error._full_msg) {
            setResponseData(e.data.headers.error._full_msg);
          } else {
            setResponseData(e.data.headers.reason);
          }
        } else if (e.data.status_code === 204) {
          setResponseStatus(204);
          setResponseData("Success - No Data Returned");
        } else {
          setResponseStatus(200);
          setResponseData(JSON.stringify(e.data.headers.data));
        }
        setPreviousQuery(query);
      }).catch(response => {
        console.log(response)
      })
    setQuery("");
  }
  


  return (
    <div className="container mx-auto text-center">
      <Steps
          enabled={showHelp}
          steps={helpSteps}
          initialStep={0}
          onExit={() => setShowHelp(false)}
        />
      <h1 className="text-2xl">Custom Database Query</h1>
      <div className="text-right">
       <button className="btn btn-sm btn-info float-left" onClick={() => setShowHelp(true)}>Help</button> <span>Press Enter to run query</span>
      </div>
      <br />
      <div className="mockup-code text-left">
        <pre data-prefix="$">
          <code>
            <input
              autoFocus
              ref={ref => ref && ref.focus()}
              type="text"
              value={query}
              onKeyDown={(e) => {
                switch (e.key) {
                  case 'Enter':
                    if(query !== ""){
                      runQuery();
                    }
                    
                    break;
                  case 'ArrowUp':
                    setQuery(previousQuery);
                    break;
                  case 'ArrowDown':
                    setQuery("");
                    break;
                  default:
                    return null
                }}}
              // onKeyDown={(e) => (e.key === "Enter" ? runQuery() : e.key === "ArrowUp" ? {
              //   setQuery(previousQuery)
              //   focus()
              //  } : e.key === "ArrowDown" ? setQuery("") : {})}
              onChange={(e) => {
                setQuery(e.target.value)
              }}
              className="bg-transparent focus:outline-none hover:outline-none active:outline-none w-11/12 intro-stage-0"
              placeholder="Start typing here..."
            />
          </code>
        </pre>
        {previousQuery !== "" ? (
          <>
            <pre data-prefix=">" className="text-primary">
              Previous Query: {previousQuery}
            </pre>
          </>
        ) : (
          <></>
        )}

        {responseData !== "" ? (
          <>
            <pre data-prefix=">" className="text-info">
              Running...
            </pre>
            <div style={{ marginLeft: "50px", marginRight: "10px" }}>
              <samp
                className={
                  responseStatus === 200
                    ? "text-success"
                    : responseStatus === 204
                    ? "text-warning"
                    : "bg-error text-error-content"
                }
              >
                {responseData}
              </samp>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* <textarea
        className="textarea textarea-bordered"
        style={{ width: "100%" }}
        onChange={(e) => setQuery(e.target.value)}
      ></textarea> */}
      {/* 
      <br />
      <br />
      <button
        className="btn btn-warning"
        onClick={() => {
          axios
            .post("/api/admin/danger", { query: query })
            .then((e) => {
              console.log(e.data);
              if (e.data.status_code !== 200) {
                setResponseData(e.data.headers.reason);
              } else {
                setResponseData(JSON.stringify(e.data.headers.data));
              }
            });
        }}
      >
        Execute
      </button>
      <br />
      <br />
      <textarea
        className="textarea textarea-bordered"
        style={{ width: "100%" }}
        placeholder={responseData}
        disabled
      ></textarea> */}
    </div>
  );
};

export default AdminCustomQuery;
