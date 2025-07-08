export default function Footer() {
  return (
    <footer className="py-6 border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} Astral PDF. All Rights Reserved.
        </p>
        <p className="text-white/30 text-xs mt-2">
          Your files are processed 100% in your browser. We do not see or store your files.
        </p>
      </div>
    </footer>
  );
} 