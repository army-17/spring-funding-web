import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

function Loading() {
  return (
    <div className="contentWrap">
      <div style={{'position':'fixed', 'top': "50%", 'left': "50vw", 'transform':"translate(-50%, -50%)"}}>
        <PacmanLoader color="#00b2b2"/>
        <span> ...  Loading </span>
      </div>
    </div>
  );
}

export default Loading;
