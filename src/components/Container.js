import React from "react";
import ColorUtils from "../Utils/ColorUtils";

const Container = (props) => {
  return (
    <div
      className={`w-full h-min px-2 py-2 text-white rounded-md cursor-pointer hover:bg-[${ColorUtils.secondaryColor}] ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default Container;
