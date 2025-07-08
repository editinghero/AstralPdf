import { useCallback, useState } from "react";

interface FileDropProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
}

export default function FileDrop({ 
  onDrop, 
  accept, 
  multiple = true, 
  label = "Drag & drop files here or click to select"
}: FileDropProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) {
        onDrop(Array.from(e.dataTransfer.files));
      }
    },
    [onDrop]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onDrop(Array.from(e.target.files));
      }
    },
    [onDrop]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`
        relative block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
        backdrop-blur-md backdrop-saturate-150 bg-white/5
        ${dragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/30 hover:border-purple-400/10'}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-5xl mb-2 text-purple-300">
          📁
        </div>
        <p className="text-lg font-medium">
          {label}
        </p>
        <p className="text-sm text-white/50">
          Your files will be processed securely in your browser
        </p>
      </div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
} 