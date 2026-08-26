import { useState } from "react";
import { motion } from "framer-motion";
import FileDrop from "../components/FileDrop";
import GlassButton from "../components/GlassButton";
import GlassMorphism from "../components/GlassMorphism";
import { PDFDocument } from "pdf-lib";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: import("framer-motion").Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(
      (f) => f.type === "application/pdf"
    );

    if (!pdfFile) {
      setError("Please upload a PDF file.");
      return;
    }

    setFile(pdfFile);
    setResult(null);
    setError(null);
  };

  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(p => p.trim()).filter(Boolean);

    if (parts.length === 0) throw new Error("Please specify at least one page number.");

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > maxPages) {
          throw new Error(`Invalid range: ${part}. Pages must be between 1 and ${maxPages}.`);
        }
        for (let i = start; i <= end; i++) {
          pages.add(i - 1); // 0-indexed for pdf-lib
        }
      } else {
        const num = parseInt(part);
        if (isNaN(num) || num < 1 || num > maxPages) {
          throw new Error(`Invalid page: ${part}. Pages must be between 1 and ${maxPages}.`);
        }
        pages.add(num - 1); // 0-indexed
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) {
      setError("Please upload a PDF file first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      const requestedPages = parsePageRange(pageRange, pageCount);
      if (requestedPages.length === 0) {
        throw new Error("No valid pages selected.");
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, requestedPages);

      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const originalName = file.name.replace('.pdf', '');
      const newFile = new File([blob], `${originalName}_split.pdf`, {
        type: "application/pdf",
      });

      setResult(newFile);
    } catch (err) {
      console.error(err);
      setError(`Error splitting PDF: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setPageRange("");
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <GlassMorphism className="p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-coral-gradient">Split PDF</h1>

        <div className="mb-8 space-y-4">
          <p className="text-white/70">
            Extract specific pages from your PDF file. You can enter single pages (e.g. 1, 3, 5) or ranges (e.g. 1-5).
          </p>
        </div>

        {!file && (
          <FileDrop
            onDrop={handleDrop}
            accept=".pdf"
            multiple={false}
            label="Drop your PDF file here"
          />
        )}

        {file && !result && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 text-center">
            <p className="text-lg font-medium mb-2">File Ready for Splitting</p>
            <p className="text-white/70 mb-4">{file.name}</p>

            <div className="my-6 text-left">
              <label htmlFor="page-range" className="block text-sm font-medium mb-2 text-white/80">
                Pages to extract (e.g., 1, 3-5, 8)
              </label>
              <input
                id="page-range"
                type="text"
                placeholder="1-3, 5"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f0788a]/50 focus:ring-1 focus:ring-[#f0788a]/50 transition-colors"
              />
            </div>

            <GlassButton
              onClick={handleSplit}
              disabled={processing || !pageRange.trim()}
            >
              {processing ? "Splitting..." : "Split PDF"}
            </GlassButton>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white">
            {error}
          </div>
        )}

      </GlassMorphism>

      {result && file && (
        <div className="glass-card p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4">Split Complete</h2>

          <div className="mb-6 p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl">✂️</div>
            </div>
            <div className="text-center">
              <p className="text-white/80 mb-2">Successfully extracted pages from your PDF</p>
              <p className="text-sm text-white/60">
                New file: <span className="text-[#f0788a]">{result.name}</span>
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <GlassButton onClick={handleDownload}>
              Download New PDF
            </GlassButton>
            <GlassButton onClick={handleReset} variant="outline">
              Split Another
            </GlassButton>
          </div>
        </div>
      )}
    </motion.div>
  );
}