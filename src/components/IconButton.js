import React from "react";
import ColorUtils from "../Utils/ColorUtils";
import Loading from "./Loading";

const IconButton = (props) => {
  return (
    <button
      onClick={() => {
        if (props.isLoading) {
          return;
        }
        props.onClick();
      }}
      className={`w-full flex gap-2 items-center justify-center bg-[#2F2F2F] text-white p-2 rounded-md hover:bg-[#3d3d3d] ${props.className}`}
    >
      {props.isLoading && <Loading />}
      {props.children}
    </button>
  );
};

export default IconButton;
