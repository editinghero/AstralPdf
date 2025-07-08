import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import FileDrop from "../components/FileDrop";
import GlassButton from "../components/GlassButton";
import GlassMorphism from "../components/GlassMorphism";
import { mergePdfs } from "../utils/pdfUtils";

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

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (file) => file.type === "application/pdf"
    );
    
    if (pdfFiles.length !== newFiles.length) {
      setError("Please upload PDF files only.");
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
    setResult(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge");
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const merged = await mergePdfs(files);
      setResult(merged);
    } catch (err) {
      console.error(err);
      setError(`Error merging PDFs: ${err instanceof Error ? err.message : "Unknown error"}`);
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

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    setResult(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === files.length - 1)
    ) {
      return;
    }
    
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap files
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    
    setFiles(newFiles);
    setResult(null);
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
        <h1 className="text-3xl font-bold mb-6 gradient-text">Merge PDFs</h1>
        
        <div className="mb-8">
          <p className="text-white/70">
            Effortlessly combine multiple PDF files into one single, organized document. 
            You can add files individually or all at once, then drag and drop to reorder them before merging. 
            It's the perfect tool for consolidating reports, assignments, or any set of documents.
          </p>
        </div>
        
        <FileDrop
          onDrop={handleDrop}
          accept=".pdf"
          multiple={true}
          label={files.length > 0 ? "Add More Files" : "Drag & Drop PDF Files"}
        />
        
        {files.length > 0 && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="font-medium mb-3">Files to Merge ({files.length})</h3>
            <p className="text-sm text-white/60 mb-4">
              Files will be merged in the order shown below. You can reorder them by using the arrows.
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {files.map((file, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-xs mr-3">
                      {i + 1}
                    </span>
                    <span className="text-sm truncate max-w-xs">{file.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveFile(i, 'up')}
                      disabled={i === 0}
                      className={`p-1 rounded-md ${i === 0 ? 'text-white/20' : 'text-white/60 hover:bg-white/10'}`}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveFile(i, 'down')}
                      disabled={i === files.length - 1}
                      className={`p-1 rounded-md ${i === files.length - 1 ? 'text-white/20' : 'text-white/60 hover:bg-white/10'}`}
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => removeFile(i)}
                      className="p-1 rounded-md text-white/60 hover:bg-white/10 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white">
            {error}
          </div>
        )}
        
        {files.length > 1 && !result && (
          <div className="mt-6 flex justify-center">
            <GlassButton
              onClick={handleMerge}
              disabled={files.length < 2 || processing}
            >
              {processing ? "Merging..." : `Merge ${files.length} Files`}
            </GlassButton>
          </div>
        )}
      </GlassMorphism>
      
      {result && (
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Merge Complete</h2>
          
          <div className="mb-6">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 mb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl">📄</div>
              </div>
              <div className="text-center">
                <p className="text-white/80 mb-2">Successfully merged {files.length} PDF files</p>
                <p className="text-sm text-white/60">
                  New file: <span className="text-purple-300">{result.name}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <GlassButton onClick={handleDownload}>
              Download Merged PDF
            </GlassButton>
            <GlassButton onClick={handleReset} variant="outline">
              Merge More Files
            </GlassButton>
          </div>
        </div>
      )}
    </motion.div>
  );
} 