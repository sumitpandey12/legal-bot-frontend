import { useEffect, useState } from "react";
import Container from "./components/Container";
import { IoIosChatbubbles } from "react-icons/io";
import { TbReload } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import { CgPinBottom } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { FaFilePdf } from "react-icons/fa";
import { MdFileUpload, MdDeleteForever } from "react-icons/md";

import Space from "./components/Space";
import ColorUtils from "./Utils/ColorUtils";
import Utils from "./Utils/Utils";
import IconButton from "./components/IconButton";
import MessageInputBox from "./components/MessageInputBox";

function App() {
  return (
    <div className="h-screen w-screen flex gap-4">
      <FilesSection />
      <ChatSection />
    </div>
  );
}

function ChatSection() {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const notify = (message) => toast(message);

  useEffect(() => {
    const interval = setInterval(() => {
      getChatHistory();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getChatHistory = async () => {
    try {
      const resonse = await fetch(`${Utils.BASE_URL}/api/search/chatHistory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resonse.ok) {
        const data = await resonse.json();
        setChatHistory(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearHistory = () => {
    setIsSpinning(true);

    try {
      const resonse = fetch(`${Utils.BASE_URL}/api/search/chatHistory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resonse.ok) {
        setIsSpinning(false);
        notify("Chat history cleared");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ backgroundColor: ColorUtils.backgroundColor }}
      className={`w-full md:w-3/4  p-4 flex flex-col h-screen justify-between`}
    >
      <div className="flex flex-col">
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
                  <div className="flex gap-1 items-start w-2/3">
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
          </div>
        )}
      </div>
      <ToastContainer />
      <div className="mt-auto">
        <Space />
        <MessageInputBox onSubmit={(message) => notify(message)} />
      </div>
    </div>
  );
}

function FilesSection() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const notify = (message) => toast(message);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    setIsLoading(true);
    try {
      const resonse = await fetch(`${Utils.BASE_URL}/api/files`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resonse.ok) {
        const data = await resonse.json();
        console.log(data);
        setFiles(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const deleteFiles = async (id) => {
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
        notify(data.message);
        getFiles();
      }
    } catch (error) {
      console.log(error);
      notify(error.message);
    }
    setDeleteLoading(false);
  };

  const uploadFile = async (file) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${Utils.BASE_URL}/api/files`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      notify(data.message);
      if (response.ok) {
        getFiles();
      }
    } catch (error) {
      console.log(error);
      notify(error.message);
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
      className={`w-full md:w-1/4 p-4 flex flex-col h-screen justify-between`}
    >
      <div className="flex flex-col">
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
          <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide flex-grow">
            {files.map((file, index) => (
              <Container key={index}>
                <FaFilePdf color="red" size={20} />
                <h1 className="text-white truncate">{file.name}</h1>
              </Container>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
      <div className="mt-auto">
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
