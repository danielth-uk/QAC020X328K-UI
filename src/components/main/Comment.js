import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

import { useQuill } from "react-quilljs";

const Comment = ({
  body,
  time,
  name,
  owner,
  edited,
  id,
  refresh,
  setRefresh,
  closed
}) => {
  const [editComment, setEditComment] = useState(false);

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
    if (quill) {
      if (editComment) {
        quill.enable(true);
      } else {
        quill.enable(false);
      }

      if (body) {
        quill.setContents(body);
      }
    }
  }, [quill, editComment]);

  return (
    <div className="card bg-base-200 shadow-xl p-5 mb-4">
      <label className="label">
        <span className="label-text">{name}</span>
        <span className="label-text-alt">
          Posted At: {time.split("T").join(" ")}
        </span>
      </label>
      <div
        className={
          editComment
            ? "quill-textarea quill-comment"
            : "quill-textarea quill-comment hide-toolbar"
        }
      >
        <div ref={quillRef} />
      </div>
      <label className="label">
        <span className="label-text">{edited ? <i>Edited</i> : <></>}</span>
        <span className="label-text-alt flex">
          {owner === cookies.get("username") && closed !== 1 ? (
            <>
              {editComment ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  onClick={() => {
                    axios
                      .put(`/api/general/comments/${id}`, {
                        body: quill.getContents(),
                        commentId: id
                      })
                      .then((response) => {
                        setEditComment(false);
                        setRefresh(!refresh);
                      });
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => setEditComment(true)}
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </>
              )}
            </>
          ) : (
            <></>
          )}
          {cookies.get("Authorized") === "Admin" && closed !== 1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 ml-2"
              onClick={() =>
                axios
                  .delete(`/api/admin/comment/${id}`)
                  .then((response) => {
                    window.location.reload(false);
                  })
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          ) : (
            <></>
          )}
        </span>
      </label>
    </div>
  );
};

export default Comment;

Comment.defaultProps = {
  name: "Undefined",
  time: "0000/00/00T00:00:00"
};
