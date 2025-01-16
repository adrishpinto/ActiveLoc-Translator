import express from "express";
import generateXliff from "./xliffApiFunc.js";
import { cache } from "../index.js";
import pdf from "pdf-parse";
import mammoth from "mammoth"; 

const router = express.Router();

router.get("/xliff", async (req, res) => {
  try {
    const sourceFile = cache.get("sourceFile");
    const targetFile = cache.get("targetFile");
    const extension = cache.get("extension");
    console.log(extension);

    if (!sourceFile) {
      return res.status(400).send("Source file is missing or empty");
    }

    if (!targetFile) {
      return res.status(400).send("Target file is missing or empty");
    }

    let source = "";
    let target = "";

    // Handle TXT files
    if (extension === "txt") {
      source = sourceFile ? sourceFile.toString("utf-8") : "";
      target = targetFile ? targetFile.toString("utf-8") : "";
    }

    // Handle PDF files
    if (extension === "pdf") {
      source = sourceFile ? (await pdf(sourceFile)).text : "";
      target = targetFile ? (await pdf(targetFile)).text : "";
    }

    // Handle DOCX files
    if (extension === "docx") {
      source = sourceFile
        ? (await mammoth.extractRawText({ buffer: sourceFile })).value
        : "";
      target = targetFile
        ? (await mammoth.extractRawText({ buffer: targetFile })).value
        : "";
    }

    // Fallback for unsupported or missing extensions
    if (!source || !target) {
      return res.status(400).send("Unsupported file type or empty content");
    }

    // Generate XLIFF file
    const outputFilePath = await generateXliff(source, target);

    if (!outputFilePath) {
      return res.status(500).send("Error generating XLIFF file");
    }

    // Set headers and send file for download
    res.setHeader("Content-Disposition", "attachment; filename=output.xliff");
    res.setHeader("Content-Type", "application/xml");

    res.sendFile(outputFilePath);
  } catch (error) {
    res.status(500).send(error.message || "Error generating XLIFF file");
  }
});

export default router;
