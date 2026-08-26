import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassMorphism from '../components/GlassMorphism';
import { 
  DocumentIcon, 
  ArrowDownTrayIcon, 
  DocumentDuplicateIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';
import CursorCircle from '../components/CursorCircle';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <>
      <CursorCircle />
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center py-20 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-[#f0788a]/10 to-[#ff9a9e]/10 blur-3xl"></div>
            </div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-coral-gradient">PDF Tools</span>
              <br />
              <span className="text-white">for the Modern Web</span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Stash, manage, and edit your PDFs in your browser. Fast, secure, and private.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 w-full px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/compress"
                className="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-[#f0788a] to-[#ff9a9e] rounded-lg font-medium text-white hover:from-[#f0788a] hover:to-[#ffa8b6] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#f0788a]/20"
              >
                Get Started
              </Link>
              <motion.a
                href="#tools"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto text-center px-8 py-4 bg-white/5 rounded-lg font-medium text-white hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                View Tools
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="tools" className="relative py-20 z-10 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={ArrowDownTrayIcon}
                title="Compress PDF"
                description="Reduce file size while maintaining quality"
                link="/compress"
              />
              <FeatureCard
                icon={DocumentDuplicateIcon}
                title="Merge PDFs"
                description="Combine multiple PDFs into one file"
                link="/merge"
              />
              <FeatureCard
                icon={DocumentDuplicateIcon}
                title="Split PDF"
                description="Split one PDF into multiple files or extract pages"
                link="/split"
              />
              <FeatureCard
                icon={DocumentTextIcon}
                title="Add Watermark"
                description="Protect your documents with watermarks"
                link="/watermark"
              />
              <FeatureCard
                icon={DocumentIcon}
                title="Convert"
                description="Convert between PDF and images"
                link="/pdf-to-images"
              />
            </motion.div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="relative py-20 z-10">
          <div className="max-w-4xl mx-auto px-4">
            <GlassMorphism className="rounded-2xl">
              <motion.div 
                className="px-6 py-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">100% Private & Secure</h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                  Your files never leave your device. All processing happens locally in your browser,
                  ensuring complete privacy and security for your sensitive documents.
                </p>
              </motion.div>
            </GlassMorphism>
          </div>
        </section>
      </motion.div>
    </>
  );
}

function FeatureCard({ icon: Icon, title, description, link }: {
  icon: any;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={link}>
        <GlassMorphism className="h-full p-6 rounded-xl transition-all duration-300 hover:bg-white/10">
          <Icon className="w-12 h-12 text-[#f0788a] mb-4" />
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-white/60">{description}</p>
        </GlassMorphism>
      </Link>
    </motion.div>
  );
} 