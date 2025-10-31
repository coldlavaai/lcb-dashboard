'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, TrendingUp, Globe, Database } from 'lucide-react';

type ViewMode = 'overview' | 'spreads' | 'markets' | 'data';

interface BottomNavigationProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function BottomNavigation({ activeView, onViewChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'overview' as ViewMode, label: 'Overview', icon: LayoutGrid },
    { id: 'spreads' as ViewMode, label: 'Spreads', icon: TrendingUp },
    { id: 'markets' as ViewMode, label: 'Markets', icon: Globe },
    { id: 'data' as ViewMode, label: 'Data', icon: Database },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#1A2332]/98 to-[#0D1B2A]/98 backdrop-blur-xl border-t-2 border-[#D4AF37]/30 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-4 gap-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all ${
                isActive ? 'text-[#D4AF37]' : 'text-white/60'
              }`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-semibold mt-1 ${isActive ? 'text-[#D4AF37]' : 'text-white/60'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
