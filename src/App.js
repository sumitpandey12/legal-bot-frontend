import { useEffect, useRef, useState } from "react";
import Container from "./components/Container";
import { IoIosChatbubbles, IoIosCloseCircle } from "react-icons/io";
import { TbReload } from "react-icons/tb";
import { CgPinBottom } from "react-icons/cg";
import { FaFilePdf } from "react-icons/fa";
import { MdFileUpload, MdDeleteForever } from "react-icons/md";

import Space from "./components/Space";
import ColorUtils from "./Utils/ColorUtils";
import Utils from "./Utils/Utils";
import IconButton from "./components/IconButton";
import MessageInputBox from "./components/MessageInputBox";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      {/* Tabs for mobile view */}
      <div className="md:hidden">
        <div className="flex border-b border-[#2F2F2F]">
          <button
            style={{
              backgroundColor:
                selectedTab === 0
                  ? ColorUtils.backgroundColor2
                  : ColorUtils.secondaryColor2,
            }}
            className="text-white w-full p-2"
            onClick={() => handleTabChange(0)}
          >
            Assistant
          </button>
          <button
            style={{
              backgroundColor:
                selectedTab === 1
                  ? ColorUtils.backgroundColor2
                  : ColorUtils.secondaryColor2,
            }}
            className="text-white w-full p-2"
            onClick={() => handleTabChange(1)}
          >
            Files
          </button>
        </div>

        {/* Render selected tab content */}
        {selectedTab === 0 ? <ChatSection /> : <FilesSection />}
      </div>

      {/* Two-column layout for large screens */}
      <div className="hidden md:flex h-screen w-screen gap-4">
        <FilesSection />
        <ChatSection />
      </div>
    </div>
  );
}

function ChatSection() {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loadFlag, seLoadFlag] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!isLoading && chatHistory.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isLoading]);

  useEffect(() => {
    if (!loadFlag) {
      if (localStorage.getItem("chatHistory")) {
        setChatHistory(JSON.parse(localStorage.getItem("chatHistory")));
      }
    }
    seLoadFlag(true);
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleClearHistory = () => {
    setIsSpinning(true);
    try {
      localStorage.removeItem("chatHistory");
      setChatHistory([]);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div
      style={{ backgroundColor: ColorUtils.backgroundColor }}
      className={`w-full md:w-3/4 p-4 flex flex-col h-full`}
    >
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white">
              Legal Assistant
            </h1>
            <span className="text-white">Research within context</span>
          </div>
          <button
            className="text-white text-sm md:text-base flex items-center border border-white px-4 py-2 rounded-xl"
            onClick={handleClearHistory}
          >
            <div className={isSpinning ? "animate-spin" : ""}>
              <TbReload size={20} />
            </div>
            <span className="ml-1">Clear History</span>
          </button>
        </div>
        <Space />
        <div className="flex flex-col gap-2 overflow-y-auto flex-grow mb-12 md:mb-0">
          {isLoading && (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item}>
                  <Simmer />
                </div>
              ))}
            </div>
          )}

          {!isLoading && chatHistory.length === 0 && (
            <div className="flex items-center justify-center mt-2">
              <h1 className="text-white">Welcome, how can I help you?</h1>
            </div>
          )}

          {!isLoading && chatHistory.length > 0 && (
            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide flex-grow">
              {chatHistory.map((chat, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  {chat.role === "user" && (
                    <div className="self-end w-2/3 flex justify-end h-min">
                      <h1
                        style={{ backgroundColor: ColorUtils.secondaryColor }}
                        className="text-white text-md md:text-lg px-4 py-2 rounded-lg"
                      >
                        {chat.content}
                      </h1>
                    </div>
                  )}
                  {chat.role !== "user" && (
                    <div className="flex gap-1 items-start w-full md:w-2/3">
                      <div
                        style={{ backgroundColor: ColorUtils.secondaryColor }}
                        className="p-2 rounded-full h-min w-min"
                      >
                        <CgPinBottom color="white" size={20} />
                      </div>
                      <h1 className="text-white text-md md:text-lg">
                        {chat.content}
                      </h1>
                    </div>
                  )}
                </div>
              ))}
              {chatHistory.length % 2 === 1 && (
                <div className="flex gap-1 items-center">
                  <div
                    style={{ backgroundColor: ColorUtils.secondaryColor }}
                    className="p-2 rounded-full h-min w-min"
                  >
                    <CgPinBottom color="white" size={20} />
                  </div>
                  <span class="relative flex h-5 w-5">
                    <span
                      style={{ backgroundColor: ColorUtils.secondaryColor2 }}
                      class={`animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75`}
                    ></span>
                    <span
                      style={{ backgroundColor: ColorUtils.secondaryColor2 }}
                      class={`relative inline-flex rounded-full h-5 w-5 bg-sky-500`}
                    ></span>
                  </span>
                </div>
              )}

              <div ref={bottomRef}></div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto fixed bottom-2 left-2 right-2 md:static md:mt-auto">
        <Space />
        <MessageInputBox
          chatHistory={chatHistory}
          onSubmit={(message) => {
            setChatHistory((prev) => [
              ...prev,
              { role: "user", content: message },
            ]);
          }}
          onResponse={(response) => {
            console.log(response);
            setChatHistory((prev) => [
              ...prev,
              { role: "assistant", content: response.message },
            ]);
          }}
        />
      </div>
    </div>
  );
}

function FilesSection() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    setIsLoading(true);
    try {
      fetch(`${Utils.BASE_URL}/api/files`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFiles(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const deleteFile = async (file) => {
    try {
      const resonse = await fetch(`${Utils.BASE_URL}/api/files/${file}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resonse.ok) {
        const data = await resonse.json();
        getFiles();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFiles = async () => {
    setDeleteLoading(true);
    try {
      const resonse = await fetch(`${Utils.BASE_URL}/api/files`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resonse.ok) {
        const data = await resonse.json();
        getFiles();
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteLoading(false);
  };

  const uploadFile = async (file) => {
    setUploadLoading(true);

    const existingFile = files.find((f) => f === file.name);
    if (existingFile) {
      setUploadLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${Utils.BASE_URL}/api/files`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        getFiles();
      }
    } catch (error) {
      console.log(error);
    }
    setUploadLoading(false);
    document.getElementById("fileInput").value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div
      style={{ backgroundColor: ColorUtils.backgroundColor2 }}
      className={`w-full md:w-1/4 p-4 flex flex-col h-[95vh] md:h-full`}
    >
      <div className="flex flex-col flex-grow overflow-y-auto">
        <h1 className="text-lg md:text-xl font-bold text-white">
          Files Context
        </h1>
        <Space />
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <IconButton
          isLoading={uploadLoading}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <MdFileUpload />
          Upload
        </IconButton>
        {isLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item}>
                <Simmer />
              </div>
            ))}
          </div>
        )}

        {!isLoading && files.length === 0 && (
          <div className="flex items-center justify-center mt-2">
            <h1 className="text-white">No files uploaded</h1>
          </div>
        )}

        {!isLoading && files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 overflow-y-auto scrollbar-hide flex-grow mb-12 md:mb-0">
            {files.map((file, index) => (
              <Container key={index}>
                <FaFilePdf color="red" size={20} />
                <h1 className="text-white truncate">{file}</h1>
                <button
                  className={`text-white hover:text-red-600`}
                  onClick={() => deleteFile(file)}
                >
                  <IoIosCloseCircle size={20} />
                </button>
              </Container>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto fixed bottom-2 left-2 right-2 md:static md:mt-auto">
        <Space />
        <IconButton isLoading={deleteLoading} onClick={deleteFiles}>
          <MdDeleteForever size={20} color="red" />
          Clear All
        </IconButton>
      </div>
    </div>
  );
}

function Simmer() {
  return (
    <div className="animate-pulse flex items-center space-x-4">
      <div className="rounded-full bg-slate-700 h-5 w-5"></div>
      <div className="flex-1 space-y-1 py-1">
        <div className="h-2 bg-slate-700 rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-700 rounded col-span-2"></div>
          <div className="h-2 bg-slate-700 rounded col-span-1"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
