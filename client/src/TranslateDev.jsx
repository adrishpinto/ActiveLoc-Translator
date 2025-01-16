import React, { useState } from "react";
import axios from "axios";

const TranslateDev = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("fr");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );
      console.log("File uploaded successfully", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const translateFile = async () => {
    const url = "http://localhost:5000/translate";
    const data = {
      language,
    };

    try {
      const response = await axios.post(url, data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const xliffDownload = async () => {
    try {
      const response = await fetch("http://localhost:5000/xliff");

      if (!response.ok) {
        throw new Error("Failed to download the file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "output.xliff";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const download = async () => {
    try {
      // Step 1: Fetch the file extension
      const extensionRes = await axios.get("http://localhost:5000/extension");
      let { extension } = extensionRes.data;
      if (extension == "ocx") {
        extension = "docx";
      }

      const res = await axios.get("http://localhost:5000/download", {
        responseType: "blob",
      });

      console.log(res);

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));

      let fileName = `downloaded-file.${extension}`;

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);

      alert("Download successful! Please check your Downloads folder.");
    } catch (error) {
      console.error("Error:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="sm:w-[80%] w-[90%] lg:w-[50%] border border-black rounded-lg bg-slate-50 shadow-lg mx-auto mt-32 p-10 flex flex-col items-center">
        <div className="w-fit">
          <input
            type="file"
            onChange={handleFileChange}
            className="border bg-slate-100 text-center w-[230px] "
          />
        </div>
        <div className="mt-5">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border bg-slate-200 text-center w-fit outline-none cursor-pointer p-2 px-4 rounded "
          >
            <option value="fr" className="text-left hover:cursor-pointer ">
              French
            </option>
            <option value="es" className="text-left hover:cursor-pointer ">
              Spanish
            </option>
            <option value="de" className="text-left hover:cursor-pointer ">
              German
            </option>
            <option value="it" className="text-left hover:cursor-pointer ">
              Italian
            </option>
            <option value="zh" className="text-left hover:cursor-pointer ">
              Chinese
            </option>
            <option value="de" className="text-left hover:cursor-pointer ">
              German
            </option>
          </select>
        </div>
        <div className="mt-10 space-y-10 sm:space-y-0 sm:space-x-10 flex sm:flex-row flex-col">
          <button
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl"
            onClick={handleUpload}
          >
            Upload
          </button>
          <button
            onClick={translateFile}
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl"
          >
            Translate
          </button>
          <button
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl"
            onClick={download}
          >
            Download
          </button>
        </div>
        <button
          className="bg-slate-100 px-3 py-1 border border-black rounded-xl mt-10"
          onClick={xliffDownload}
        >
          Xliff Download
        </button>
      </div>
    </div>
  );
};

export default TranslateDev;

// const download = async () => {
//   try {
//     const res = await axios.get("http://localhost:5000/download", {
//       responseType: "blob",
//     });

//     console.log(res);

//     const fileURL = window.URL.createObjectURL(new Blob([res.data]));

//     const disposition = res.headers['content-disposition'];
//     let fileName = 'downloaded-file';

//     if (disposition) {
//       const matches = /filename="(.+)"/.exec(disposition);
//       if (matches != null && matches[1]) {
//         fileName = matches[1];
//       }
//     }

//     const link = document.createElement("a");
//     link.href = fileURL;
//     link.setAttribute("download", fileName);
//     document.body.appendChild(link);
//     link.click();

//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(fileURL);

//     alert("Download successful! Please check your Downloads folder.");
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Download failed. Please try again.");
//   }
// };
