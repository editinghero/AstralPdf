import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CompressPage from "./pages/CompressPage";
import Home from "./pages/Home";
import MergePage from "./pages/MergePage";
import WatermarkPage from "./pages/WatermarkPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImageToPdfPage from "./pages/ImageToPdfPage";
import PdfToImagePage from "./pages/PdfToImagePage";

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-28 pb-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/compress" element={<CompressPage />} />
            <Route path="/merge" element={<MergePage />} />
            <Route path="/watermark" element={<WatermarkPage />} />
            <Route path="/images-to-pdf" element={<ImageToPdfPage />} />
            <Route path="/pdf-to-images" element={<PdfToImagePage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
} 