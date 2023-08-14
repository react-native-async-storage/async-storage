import React from "react";

const PlatformSupport = ({ platformIcon, title }) => (
  <div
    style={{
      display: "flex",
      margin: "10px 20px",
      alignItems: "center",
      flexDirection: "row"
    }}
  >
    <img
      style={{ width: 34, height: 34 }}
      src={`/async-storage/img/${platformIcon}`}
    />
    <p style={{ margin: "0 0 0 10px", padding: 0 }}>{title}</p>
  </div>
);

export default PlatformSupport;
