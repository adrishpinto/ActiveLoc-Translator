import { BlobServiceClient } from "@azure/storage-blob";
import { v1 as uuidv1 } from "uuid";
import fs from "fs";
import path from "path";
import dotenv from "dotenv"


const accountName = "translatefiles";
const sasToken = process.env.SRC_SAS_TOKEN;
const containerName = "source";

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const containerClient = blobServiceClient.getContainerClient(containerName);

const localFilePath =
  "C:/Users/adris/OneDrive/Desktop/ActiveLoc Services/text.txt";

const fileExtension = path.extname(localFilePath).toLowerCase();

let blobName = "file" + uuidv1();

if (fileExtension === ".txt") {
  blobName += ".txt";
} else if (fileExtension === ".pdf") {
  blobName += ".pdf";
} else {
  blobName += ".bin";
}

const blockBlobClient = containerClient.getBlockBlobClient(blobName);

console.log(
  `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${req.session.blobUrl}`
);

fs.readFile(localFilePath, async (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);

    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
  } catch (uploadError) {
    console.error("Error uploading file:", uploadError);
  }
});
