'use client';

import { motion } from 'framer-motion';
import { MessageSquare, User, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface CommentaryPanelProps {
  spread: string;
}

const mockCommentary = {
  'CZCE - ICE': {
    analysis: 'CZCE-ICE spread widening significantly due to Pakistan logistics delays and port congestion. Container freight costs up 15% week-over-week. Expect convergence by month-end as new shipments clear Karachi port. Chinese domestic demand remains strong with textile orders up 8% MoM.',
    keyPoints: [
      'Pakistan port congestion driving spread expansion',
      'Freight costs elevated (+15% WoW)',
      'Chinese textile demand robust (+8% MoM)',
      'Expected convergence within 2-3 weeks',
    ],
    outlook: 'Bullish short-term on spread narrowing. Monitor Pakistani infrastructure developments and Chinese PMI data.',
    author: 'Harry Bennett',
    timestamp: '2 hours ago',
    sentiment: 'bullish',
  },
  'AWP - ICE': {
    analysis: 'AWP maintaining steady premium over ICE futures. Indian and Brazilian supply strong with harvest season progressing well. Weather conditions favorable across both regions. Global demand steady but Chinese buying has slowed slightly ahead of Golden Week.',
    keyPoints: [
      'Indian harvest on track, quality good',
      'Brazilian supply strong, weather favorable',
      'Chinese demand cooling pre-holiday',
      'Spread expected to remain stable 12-15 range',
    ],
    outlook: 'Neutral. Watch for Chinese demand post-holiday period and any weather disruptions in Brazil.',
    author: 'Harry Bennett',
    timestamp: '5 hours ago',
    sentiment: 'neutral',
  },
  'MCX - ICE': {
    analysis: 'Indian MCX significantly discounted to ICE due to rupee weakness and strong domestic harvest. Gujarat crop estimates revised upward by 7%. Local demand moderate as textile mills build inventory. Export competitiveness improving with currency advantage.',
    keyPoints: [
      'Rupee weakness driving discount',
      'Gujarat crop estimates up 7%',
      'Export competitiveness improving',
      'Mills building inventory ahead of festival season',
    ],
    outlook: 'Moderately bearish on spread. Indian exports likely to increase, putting pressure on spread narrowing.',
    author: 'Harry Bennett',
    timestamp: '1 day ago',
    sentiment: 'bearish',
  },
};

export default function CommentaryPanel({ spread }: CommentaryPanelProps) {
  const commentary = mockCommentary[spread as keyof typeof mockCommentary] || mockCommentary['CZCE - ICE'];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'bearish':
        return <TrendingUp size={16} className="text-red-400 rotate-180" />;
      default:
        return <AlertCircle size={16} className="text-yellow-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#D4AF37]">Expert Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          {getSentimentIcon(commentary.sentiment)}
          <span className={`text-sm font-semibold uppercase ${getSentimentColor(commentary.sentiment)}`}>
            {commentary.sentiment}
          </span>
        </div>
      </div>

      {/* Analysis */}
      <div className="mb-4 relative z-10">
        <p className="text-white/90 leading-relaxed text-sm">{commentary.analysis}</p>
      </div>

      {/* Key Points */}
      <div className="mb-4 relative z-10">
        <h4 className="text-[#D4AF37] text-sm font-semibold mb-2">Key Points</h4>
        <ul className="space-y-2">
          {commentary.keyPoints.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-white/80 text-sm flex items-start gap-2"
            >
              <span className="text-[#D4AF37] mt-1">•</span>
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Outlook */}
      <div className="p-4 bg-[#0F1419]/50 backdrop-blur-sm rounded-lg border-l-4 border-[#2C7A7B] mb-4 relative z-10">
        <h4 className="text-[#2C7A7B] text-sm font-semibold mb-1">Market Outlook</h4>
        <p className="text-white/80 text-sm">{commentary.outlook}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-white/50 text-xs pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <User size={14} />
          <span>{commentary.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{commentary.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
}
