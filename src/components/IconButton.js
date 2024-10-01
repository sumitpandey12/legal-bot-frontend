import React from "react";
import ColorUtils from "../Utils/ColorUtils";

const IconButton = (props) => {
  return (
    <div
      style={{
        backgroundColor: ColorUtils.secondaryColor,
      }}
      onClick={props.onClick}
      className={`flex gap-2 items-center px-4 py-2 text-white bg-green-600 rounded-md cursor-pointer ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default IconButton;
