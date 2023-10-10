import React from "react";

const Modal = (props) => {
  return (
    <>
      <input
        type="checkbox"
        id="pageModal"
        className="modal-toggle"
        checked={props.open}
        aria-label="Open or close modal"
      />
      <div className="modal" style={{ marginTop: "-40vh" }}>
        <div
          className={props.size == "large" ? "modal-box max-w-5xl w-11/12  mockup-window border bg-base-300" : "modal-box w-11/12  mockup-window border bg-base-300"}
          style={{ padding: "0px", paddingTop: "1.25rem" }}
        >
          <div className="px-4 py-10 bg-base-200">
            <h3 className="font-bold text-lg">{props.title}</h3>
            <div>{props.children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
