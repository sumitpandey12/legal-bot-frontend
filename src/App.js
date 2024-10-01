import { useEffect } from "react";
import Container from "./components/Container";
import IconButton from "./components/IconButton";
import { IoIosChatbubbles } from "react-icons/io";
import Space from "./components/Space";
import ColorUtils from "./Utils/ColorUtils";
import Utils from "./Utils/Utils";

function App() {
  return (
    <div className="h-screen w-screen flex gap-4">
      <FilesSection />
      <ChatSection />
    </div>
  );
}

function ChatSection() {
  return (
    <div className="w-full md:w-3/4 p-4">
      {" "}
      {/* Added some styling */}
      <h1 className="text-lg md:text-xl font-bold text-white">
        Legal Assistance
      </h1>
      <Space />
      <IconButton>
        <IoIosChatbubbles />
      </IconButton>
    </div>
  );
}

function FilesSection() {
  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    try {
      fetch("https://legal-bot-backend-beta.vercel.app/api/files", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`w-full md:w-1/4 bg-[${ColorUtils.backgroundColor2}] p-4`}>
      <h1 className="text-lg md:text-xl font-bold text-white">Files</h1>
      <Space />
      <Container>
        <h1 className="text-lg md:text-xl font-bold text-white">File 1</h1>
      </Container>
    </div>
  );
}

export default App;
