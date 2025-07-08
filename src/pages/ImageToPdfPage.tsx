import { useState } from "react";
import { motion } from "framer-motion";
import FileDrop from "../components/FileDrop";
import GlassButton from "../components/GlassButton";
import GlassMorphism from "../components/GlassMorphism";
import { imagesToPdf } from "../utils/pdfUtils";

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

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(f => f.type.startsWith("image/"));
    
    if (imageFiles.length !== acceptedFiles.length) {
      setError("Please upload image files only.");
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...imageFiles]);
    setResult(null);
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError("Please upload at least one image file.");
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const pdf = await imagesToPdf(files);
      setResult(pdf);
    } catch (err) {
      console.error(err);
      setError(`Error creating PDF: ${err instanceof Error ? err.message : "An unknown error occurred"}`);
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
    setFiles([]);
    setResult(null);
    setError(null);
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
        <h1 className="text-3xl font-bold mb-6 gradient-text">Images to PDF</h1>
        <p className="text-white/70 mb-8">
          Convert your JPG, PNG, and other image files into a single, easy-to-share PDF document. 
          Add multiple images, and they will be combined into one PDF.
        </p>
        
        {result ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Conversion Complete!</h2>
            <p className="text-white/70 mb-6">Your PDF is ready to be downloaded.</p>
            <div className="flex justify-center gap-4">
              <GlassButton onClick={handleDownload}>
                Download PDF
              </GlassButton>
              <GlassButton onClick={handleReset} variant="outline">
                Convert More Images
              </GlassButton>
            </div>
          </div>
        ) : (
          <>
            <FileDrop
              onDrop={handleDrop}
              accept="image/*"
              multiple={true}
              label={files.length > 0 ? "Add More Images" : "Drag & Drop Image Files"}
            />

            {files.length > 0 && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="font-medium mb-3">{files.length} Image{files.length > 1 ? 's' : ''} Selected</h3>
                <div className="flex justify-center mt-4">
                  <GlassButton
                    onClick={handleProcess}
                    disabled={processing}
                  >
                    {processing ? "Converting..." : `Convert to PDF`}
                  </GlassButton>
                </div>
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