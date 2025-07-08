import { PDFDocument, StandardFonts, rgb, RotationTypes, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import jszip from "jszip";

// Set the workerSrc to avoid issues with vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type CompressionLevel = 'low' | 'medium' | 'high';

export async function compressPdf(file: File, quality: number) {
  // If quality is 100%, return the original file without processing
  if (quality === 1) {
    return file;
  }
  
  const bytes = await file.arrayBuffer();
  
  // Use pdf.js to render each page to a canvas
  const pdfJsDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
  const numPages = pdfJsDoc.numPages;

  const newPdfDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2 }); // Use a fixed scale for high quality

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (!context) {
      throw new Error("Could not create canvas context");
    }

    await page.render({ canvasContext: context, viewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const image = await newPdfDoc.embedJpg(dataUrl);
    
    const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }
  
  const pdfBytes = await newPdfDoc.save({ useObjectStreams: true });
  
  // Return original file if compressed version is larger
  if (pdfBytes.length > file.size) {
    return file;
  }
  
  return new File([pdfBytes], `compressed_${file.name}`, {
    type: "application/pdf",
  });
}

export async function mergePdfs(files: File[]) {
  const merged = await PDFDocument.create();
  for (const f of files) {
    const bytes = await f.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const copied = await merged.copyPages(src, src.getPageIndices());
    copied.forEach((p) => merged.addPage(p));
  }
  const out = await merged.save({ useObjectStreams: true });
  return new File([out], "merged.pdf", { type: "application/pdf" });
}

export async function addWatermark(file: File, text: string) {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const watermarkOpacity = 0.2;
    const watermarkColor = rgb(0.6, 0.6, 0.6);
    const fontSize = Math.min(width, height) / 15;
    
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    
    const margin = 20;

    const options = {
      size: fontSize,
      font,
      color: watermarkColor,
      opacity: watermarkOpacity,
    };

    const rotation = degrees(-45);

    // Top-Left corner
    page.drawText(text, { ...options, x: margin, y: height - margin, rotate: rotation });
    
    // Top-Right corner
    page.drawText(text, { ...options, x: width - margin, y: height - margin, rotate: rotation });
    
    // Bottom-Left corner
    page.drawText(text, { ...options, x: margin, y: margin + textHeight, rotate: rotation });

    // Bottom-Right corner
    page.drawText(text, { ...options, x: width - margin, y: margin + textHeight, rotate: rotation });
  }

  // Flatten the PDF to make it non-editable
  const watermarkedBytes = await pdfDoc.save({ useObjectStreams: true });
  const flatPdfDoc = await PDFDocument.create();
  
  const pdfJsDoc = await pdfjsLib.getDocument(watermarkedBytes).promise;

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    if (!context) throw new Error("Could not create canvas context");

    await page.render({ canvasContext: context, viewport }).promise;
    
    const pngDataUrl = canvas.toDataURL("image/png");
    const pngImage = await flatPdfDoc.embedPng(pngDataUrl);
    
    const newPage = flatPdfDoc.addPage([viewport.width, viewport.height]);
    newPage.drawImage(pngImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
  }

  const pdfBytes = await flatPdfDoc.save({ useObjectStreams: true });

  return new File([pdfBytes], `watermarked_${file.name}`, {
    type: "application/pdf",
  });
}

export async function imagesToPdf(files: File[]) {
  const doc = await PDFDocument.create();
  for (const f of files) {
    const imgBytes = await f.arrayBuffer();
    let image;
    if (f.type === "image/jpeg" || f.type === "image/jpg") {
      image = await doc.embedJpg(imgBytes);
    } else {
      image = await doc.embedPng(imgBytes);
    }
    const page = doc.addPage();
    const { width, height } = image.scale(1);
    page.setSize(width, height);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }
  const out = await doc.save({ useObjectStreams: true });
  return new File([out], "images_to_pdf.pdf", { type: "application/pdf" });
}

export async function extractImages(file: File): Promise<string[]> {
  const bytes = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument(bytes);
  const pdf = await loadingTask.promise;
  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // High resolution
    
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(`Could not create canvas context for page ${i}`);
    }
    
    await page.render({ canvasContext: context, viewport: viewport }).promise;

    images.push(canvas.toDataURL("image/png"));
  }

  return images;
}

function appendSuffix(filename: string, suffix: string) {
  const base = filename.replace(/\.pdf$/i, "");
  return `${base}${suffix}`;
} 