import { IoMdSend } from "react-icons/io";
import ColorUtils from "../Utils/ColorUtils";
import React, { useEffect, useState } from "react";
import Utils from "../Utils/Utils";

const MessageInputBox = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleSearch = async (question) => {
    setIsLoading(true);
    const chatHistory = JSON.stringify(props.chatHistory);
    try {
      const resonse = await fetch(`${Utils.BASE_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, chatHistory }),
      });
      const data = await resonse.json();
      console.log(data);
      props.onResponse(data.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
    if (e.target.value !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === "") return;
    if (isLoading) return;
    props.onSubmit(value);
    handleSearch(value);
    document.getElementById("message").value = "";
    setValue("");
    setIsActive(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ background: ColorUtils.secondaryColor }}
      className="flex gap-2 items-center rounded-full p-1 shadow-lg w-full"
    >
      <input
        type="text"
        id="message"
        value={value}
        onChange={handleInputChange}
        placeholder="Type something..."
        className="w-full p-3 bg-transparent text-white focus:outline-none"
      />
      <button
        style={{
          background: isActive
            ? ColorUtils.textColor
            : ColorUtils.secondaryColor2,
          color: isActive ? ColorUtils.secondaryColor2 : ColorUtils.textColor,
        }}
        className={`px-4 py-2 flex gap-2 items-center mr-1 text-white rounded-full hover:bg-[#3d3d3d] transition duration-200 ease-in-out shadow-md ${
          isActive ? "" : "cursor-not-allowed"
        }`}
      >
        Send
        {!isLoading && <IoMdSend size={20} />}
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
        )}
      </button>
    </form>
  );
};

export default MessageInputBox;
