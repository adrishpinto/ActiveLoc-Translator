import express from "express";
import cors from "cors";
import translateDoc from "./transalate_routes/translateDoc.js";
import uploadRoute from "./transalate_routes/blobUploadReact.js";
import test from "./transalate_routes/test.js";
import NodeCache from "node-cache";
import blobDownloadReact from "./transalate_routes/blobDownloadReact.js";
import dotenv from "dotenv";
import xliff_router from "./xliff_routes/xliff_router.js";
//create cache keys 
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
const cache = new NodeCache();

app.use(cors());
cache.set("blobName", "file1c32dee0-d3d7-11ef-975b-b93bfa00f4f4t.txt");
cache.set("sourceFile", "empty");
cache.set("targetFile", "empty");
export { cache };

app.use(express.json());

app.use(translateDoc);

app.use("/api", uploadRoute);

app.use(test);
app.use(blobDownloadReact);
app.use(xliff_router);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
