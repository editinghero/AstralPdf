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
        className="mx-auto max-w-5xl px-3 sm:px-4 py-4 sm:py-8 space-y-12 sm:space-y-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden rounded-3xl border border-[rgba(255,243,224,0.08)] bg-[rgba(34,25,26,0.75)] p-6 sm:p-10 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,120,138,0.12)_0%,transparent_70%)]" />
          
          <div className="relative max-w-2xl text-left">
            <motion.h1 
              className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#fff3e0] leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-coral-gradient">PDF Tools</span>
              <br />
              for the Modern Web
            </motion.h1>

            <motion.p 
              className="mt-3 text-sm sm:text-base text-[#dbc9b5] max-w-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Stash, manage, and edit your PDFs in your browser. Fast, secure, and private.
            </motion.p>

            <motion.div 
              className="mt-6 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/compress"
                className="inline-flex items-center gap-2 rounded-full bg-[#f0788a] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_rgba(240,120,138,0.3)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Get Started
              </Link>
              <motion.a
                href="#tools"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,243,224,0.09)] bg-[rgba(255,243,224,0.04)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#fff3e0] hover:bg-[rgba(255,243,224,0.08)] hover:border-[rgba(240,120,138,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
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