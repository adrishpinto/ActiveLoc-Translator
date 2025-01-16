import { Router } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import { cache } from "../index.js";

dotenv.config();

const router = Router();

const CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "target";

router.get("/download", async (req, res) => {
  const BLOB_NAME = cache.get("blobName");

  console.log(BLOB_NAME);
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(BLOB_NAME);

  //cache file download
  const fileBuffer = await blockBlobClient.downloadToBuffer();
  cache.set("targetFile", fileBuffer);
  console.log("???", fileBuffer.toString());

  try {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const readableStream = downloadBlockBlobResponse.readableStreamBody;

    if (readableStream) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${BLOB_NAME}"`
      );
      res.setHeader(
        "Content-Type",
        downloadBlockBlobResponse.contentType || "application/octet-stream"
      );

      readableStream.pipe(res);
      readableStream.on("end", () => {
        console.log(`File ${BLOB_NAME} streamed to client successfully.`);
      });
      readableStream.on("error", (error) => {
        console.error("Error streaming blob to client:", error.message);
        res.status(500).send("Error streaming blob to client.");
      });
    } else {
      console.error("No readable stream found in the blob.");
      res.status(500).send("No readable stream found in the blob.");
    }
  } catch (error) {
    console.error("Error downloading blob:", error.message);
    res.status(500).send(`Error downloading blob: ${error.message}`);
  }
});

router.get("/extension", async (req, res) => {
  const BLOB_NAME = cache.get("blobName");
  try {
    if (!BLOB_NAME) {
      return res.status(400).json({ message: "No blob name is given" });
    }

    const extension = BLOB_NAME.slice(-3);

    res.status(200).json({ extension });
  } catch (error) {
    console.error("Error fetching extension:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

export default router;
