import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const CONNECTION_STRING = process.env.TARGET_CONNECTION_STRING;
const CONTAINER_NAME = "target";
const BLOB_NAME = "file1c32dee0-d3d7-11ef-975b-b93bfa00f4f4t.txt";

async function downloadBlob() {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const blockBlobClient = containerClient.getBlockBlobClient(BLOB_NAME);

  try {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const readableStream = downloadBlockBlobResponse.readableStreamBody;

    if (readableStream) {
      const LOCAL_FILE_NAME = `C:/Users/adris/OneDrive/Desktop/ActiveLoc Services/downloads/${BLOB_NAME}`;

      const fileStream = fs.createWriteStream(LOCAL_FILE_NAME);

      await new Promise((resolve, reject) => {
        readableStream.pipe(fileStream);
        readableStream.on("end", resolve);
        readableStream.on("error", reject);
      });

      console.log(`File downloaded successfully to ${LOCAL_FILE_NAME}`);
    } else {
      console.error("No readable stream found in the blob.");
    }
  } catch (error) {
    console.error("Error downloading blob:", error.message);
  }
}

downloadBlob();
