'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface MobileHeaderProps {
  mobileMenuButton: React.ReactNode;
  dataDate: Date;
}

export default function MobileHeader({ mobileMenuButton, dataDate }: MobileHeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="md:hidden bg-gradient-to-r from-[#0D1B2A]/98 via-[#1B263B]/98 to-[#0D1B2A]/98 backdrop-blur-xl border-b-2 border-[#D4AF37]/30 sticky top-0 z-40 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Image
              src="/lcb-logo.png"
              alt="Liverpool Cotton Brokers"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mobileMenuButton}
          </motion.div>
        </div>

        {/* Data Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-[9px] font-medium"
        >
          Data as of: {dataDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </motion.p>
      </div>
    </motion.header>
  );
}
