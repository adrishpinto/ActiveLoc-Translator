import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const listBlobs = async () => {
  const accountName = "translatefiles";
  console.log(process.env.PORT);
  const sasToken =
    "sp=rwl&st=2025-01-13T04:49:00Z&se=2025-01-18T12:49:00Z&spr=https&sv=2022-11-02&sr=c&sig=jQjaSN2WtsW4jFUOG7oIYQfUes%2BF8fiiy6S4KxSlE8A%3D";

  const containerName = "source";

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  console.log("\nListing blobs...");

  for await (const blob of containerClient.listBlobsFlat()) {
    const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
    console.log(`\n\tName: ${blob.name}\n\tURL: ${tempBlockBlobClient.url}\n`);
  }
};

listBlobs().catch((error) => {
  console.error("Error listing blobs:", error.message);
});
