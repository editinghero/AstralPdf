import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import FileDrop from "../components/FileDrop";
import GlassButton from "../components/GlassButton";
import GlassMorphism from "../components/GlassMorphism";
import { extractImages } from "../utils/pdfUtils";
import { Download } from "lucide-react";

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

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (acceptedFiles[0].type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      setFile(acceptedFiles[0]);
      setImages([]);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const extracted = await extractImages(file);
      setImages(extracted);
    } catch (err) {
      console.error(err);
      setError(`Error extracting images: ${err instanceof Error ? err.message : "An unknown error occurred"}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    
    images.forEach((dataUrl, i) => {
      const blob = dataURLtoBlob(dataUrl);
      zip.file(`page_${i + 1}.png`, blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${file?.name.replace(".pdf", "") || "images"}.zip`);
  };

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  const handleReset = () => {
    setFile(null);
    setImages([]);
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
        <h1 className="text-3xl font-bold mb-6 gradient-text">PDF to Images</h1>
        <p className="text-white/70 mb-8">
          Extract every page from your PDF and download them as high-quality PNG images. 
          You can download all pages as a ZIP file or save individual images.
        </p>

        {images.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Extraction Complete!</h2>
              <div className="flex gap-4">
                <GlassButton onClick={handleDownloadAll}>
                  Download All as ZIP
                </GlassButton>
                <GlassButton onClick={handleReset} variant="outline">
                  Start Over
                </GlassButton>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((src, index) => (
                <div key={index} className="relative group border border-white/10 rounded-lg overflow-hidden">
                  <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto aspect-[3/4] object-cover" />
                  <a
                    href={src}
                    download={`page_${index + 1}.png`}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Download className="w-8 h-8 text-white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <FileDrop
              onDrop={handleDrop}
              accept="application/pdf"
              label={file ? `Selected: ${file.name}` : "Drag & Drop PDF File"}
            />

            {file && !processing && (
              <div className="flex justify-center mt-6">
                <GlassButton onClick={handleProcess}>
                  Extract Images
                </GlassButton>
              </div>
            )}
            
            {processing && (
              <div className="text-center mt-6">
                <p className="text-lg text-white/80">Extracting pages...</p>
                <div className="w-full bg-white/10 rounded-full h-2.5 mt-2">
                  <div className="bg-purple-500 h-2.5 rounded-full animate-pulse"></div>
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