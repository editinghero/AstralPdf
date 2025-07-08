import { useState } from "react";
import { motion } from "framer-motion";
import FileDrop from "../components/FileDrop";
import GlassButton from "../components/GlassButton";
import GlassMorphism from "../components/GlassMorphism";
import { addWatermark } from "../utils/pdfUtils";

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

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (acceptedFiles[0].type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      setFile(acceptedFiles[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    if (!watermarkText.trim()) {
      setError("Please enter the watermark text.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const watermarkedFile = await addWatermark(file, watermarkText);
      setResult(watermarkedFile);
    } catch (err) {
      console.error(err);
      setError(`Error adding watermark: ${err instanceof Error ? err.message : "An unknown error occurred"}`);
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
    setWatermarkText("CONFIDENTIAL");
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
        <h1 className="text-3xl font-bold mb-6 gradient-text">Add Watermark</h1>
        
        <div className="mb-8 space-y-4">
          <p className="text-white/70">
            Protect your documents by applying a custom text watermark. Your watermark will be added diagonally across all pages of the PDF in a semi-transparent fashion, ensuring it's visible but doesn't obscure the content. 
            We add it multiple times on two different angles for complete coverage.
          </p>
        </div>
        
        {result ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Watermark Added!</h2>
            <p className="text-white/70 mb-6">Your protected PDF is ready for download.</p>
            <div className="flex justify-center gap-4">
              <GlassButton onClick={handleDownload}>
                Download PDF
              </GlassButton>
              <GlassButton onClick={handleReset} variant="outline">
                Start Over
              </GlassButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">1. Watermark Text</h3>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g., CONFIDENTIAL"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <h3 className="text-lg font-bold mb-3">2. Upload PDF</h3>
            <FileDrop
              onDrop={handleDrop}
              accept="application/pdf"
              label={file ? `Selected: ${file.name}` : "Drag & Drop PDF File"}
            />

            {file && (
              <div className="flex justify-center mt-8">
                <GlassButton
                  onClick={handleProcess}
                  disabled={processing}
                >
                  {processing ? "Adding Watermark..." : "Add Watermark"}
                </GlassButton>
              </div>
            )}
          </>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white">
            {error}
          </div>
        )}
      </GlassMorphism>
    </motion.div>
  );
} 