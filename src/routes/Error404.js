import React from "react";

const Error404 = () => {
  return (
    <div className="sm:container mx-auto mt-40 place-content-center">
      <div className="mockup-code p-5" style={{maxWidth: "400px", margin: "auto"}}>
        <pre data-prefix="$">
          <code>Find Page</code>
        </pre>
        <pre data-prefix=">" className="text-warning">
          <code>searching...</code>
        </pre>
        <pre data-prefix=">" className="text-error">
          <code>404 - Page Not Found!</code>
        </pre>
        <br />
        <button className="btn btn-block btn-error" onClick={() => window.location.href = window.location.origin}>Back To Home</button>
      </div>
    </div>
  );
};

export default Error404;
