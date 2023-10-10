import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuill } from "react-quilljs";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";



const AddComment = ({refreshComments, setRefreshComments}) => {
  const [ticketWordCount, setTicketWordCount] = useState(0);

  const cookies = new Cookies();
  let params = useParams();



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
  })

  useEffect(() => {
    if (quill) {
        quill.on("text-change", (delta, oldDelta, source) => {
        var wordCount = quill.getText().length - 1;
        var limit = 350;
        setTicketWordCount(wordCount);
        if (wordCount > limit)
        quill.deleteText(limit, quill.getLength());
      });
    }
  }, [quill]);

  return (
    <div>
    <div className="mt-8 textarea quill-textarea textarea-bordered intro-stage-4">
      <div ref={quillRef} />
      <label className="label">
        <span className="label-text-alt">Ticket Reply</span>
        <span className="label-text-alt">{ticketWordCount}/350 Words</span>
      </label>
    </div>
    <br />
    <div className="text-right">
        <button className="btn btn-secondary" onClick={() => {
                try {
                  axios.post("/api/general/comments", {
                  username: cookies.get("username"),
                  org: cookies.get("org").toLowerCase(),
                  body: quill.getContents(),
                  ticket: params.ticketID
                }).then(response => {
                  console.log(response)
                  if(response.data.status_code === 201){
                    setRefreshComments(!refreshComments)
                    setTicketWordCount(0);
                    quill.clipboard.dangerouslyPasteHTML("");
                  }
                  else{
                    alert("Whoops something went wrong 1")
                  }
                })
                } catch (error) {
                  alert("Whoops something went wrong 2") 
                }
              }}>Add Comment</button>
    </div>
    </div>
  );
};

export default AddComment;
