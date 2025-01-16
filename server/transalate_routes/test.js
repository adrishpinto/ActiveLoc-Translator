import { Router } from "express";
import { cache } from "../index.js";

const router = Router();

router.get("/test", (req, res) => {
  const name = cache.get("blobName");
  const file = cache.get("sourceFile");
  if (name) {
    console.log(name);
    console.log(file);
    res.status(200).json({ message: "Blob URL fetched successfully", name });
  } else {
    console.log("Blob URL not found in cache");
    res.status(404).json({ message: "Blob URL not found" });
  }
});

export default router;
