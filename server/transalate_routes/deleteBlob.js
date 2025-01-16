  import { BlobServiceClient } from "@azure/storage-blob";
  import dotenv from "dotenv";

  dotenv.config({ path: "../.env" });

  const CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING;
  const CONTAINER_NAME = "source";
  const BLOB_NAME = "file0e1f8850-d3df-11ef-a8cf-3d33a105161ft.txt";

  export default async function deleteBlob() {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(BLOB_NAME);

    try {
      await blockBlobClient.delete();

      console.log(`Blob ${BLOB_NAME} deleted successfully`);
    } catch (error) {
      console.error("Error deleting blob:", error.message);
    }
  }


