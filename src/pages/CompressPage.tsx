import { useState } from "react";
import { motion } from "framer-motion";
import FileDrop from "../components/FileDrop";
import GlassButton from "../components/GlassButton";
import GlassMorphism from "../components/GlassMorphism";
import { compressPdf } from "../utils/pdfUtils";

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

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.75);
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

  const handleCompress = async () => {
    if (!file) {
      setError("Please upload a PDF file first");
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const compressed = await compressPdf(file, quality);
      setResult(compressed);
    } catch (err) {
      console.error(err);
      setError(`Error compressing PDF: ${err instanceof Error ? err.message : "Unknown error"}`);
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
    setQuality(0.75);
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
        <h1 className="text-3xl font-bold mb-6 gradient-text">Compress PDF</h1>
        
        <div className="mb-8 space-y-4">
          <p className="text-white/70">
            This tool reduces the file size of your PDFs by converting each page into an optimized JPEG image. 
            You have direct control over the image quality, which determines the final file size.
          </p>
          <p className="text-sm text-white/50">
            Note: For PDFs that are mostly text or simple vector graphics, setting the quality to 100% might result in a larger file size. 
            This is because a high-resolution image can be larger than the simple instructions needed to draw text or shapes. 
            For the best results with such files, try a quality setting between 70-90%.
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
            <p className="text-lg font-medium mb-2">File Ready for Compression</p>
            <p className="text-white/70 mb-4">{file.name}</p>

            <div className="my-6">
              <label htmlFor="quality-slider" className="block text-lg font-medium mb-3">
                PDF Quality: <span className="text-purple-300">{Math.round(quality * 100)}%</span>
              </label>
              <input
                id="quality-slider"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
               <p className="text-xs text-white/50 mt-2">
                Higher quality may increase file size for simple or text-based PDFs.
              </p>
            </div>

            <GlassButton
              onClick={handleCompress}
              disabled={processing}
            >
              {processing ? "Compressing..." : "Compress PDF"}
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
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Compression Result</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 mb-2">Original Size</p>
                <p className="text-xl font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="text-3xl text-white/30">→</div>
              <div>
                <p className="text-white/60 mb-2">Compressed Size</p>
                <p className="text-xl font-medium">{(result.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-white/70">Compression Savings</p>
                <p className="text-sm font-medium">
                  {Math.round((1 - result.size / file.size) * 100)}%
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-300 h-2 rounded-full"
                  style={{
                    width: `${Math.round((1 - result.size / file.size) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            {Math.round((1 - result.size / file.size) * 100) < 5 && (
              <p className="text-xs text-center text-white/50 mt-4">
                Note: If savings are low, your PDF may already be well-optimized.
              </p>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <GlassButton onClick={handleDownload}>
              Download Compressed PDF
            </GlassButton>
            <GlassButton onClick={handleReset} variant="outline">
              Compress Another
            </GlassButton>
          </div>
        </div>
      )}
    </motion.div>
  );
} 