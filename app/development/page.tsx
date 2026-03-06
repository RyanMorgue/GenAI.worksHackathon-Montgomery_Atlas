'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Search, Filter, ChevronRight, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  category: string;
  publishDate: string;
  imageUrl?: string;
  url: string;
}

export default function DevelopmentPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchTerm) params.append('search', searchTerm);
        params.append('limit', '24');

        const response = await fetch(`/api/news?${params}`);
        const data = await response.json();

        if (data.status === 'success') {
          setArticles(data.data.articles);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchNews, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const categories = [
    'culture',
    'development',
    'business',
    'recreation',
    'health',
    'government',
    'safety',
  ];

  const categoryConfig: Record<string, { color: string; gradient: string; icon: string }> = {
    culture: { color: 'text-violet-400', gradient: 'from-violet-500/20 to-purple-500/20', icon: '🎭' },
    development: {
      color: 'text-amber-400',
      gradient: 'from-amber-500/20 to-orange-500/20',
      icon: '🏗️',
    },
    business: { color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20', icon: '💼' },
    recreation: {
      color: 'text-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      icon: '🎪',
    },
    health: { color: 'text-rose-400', gradient: 'from-rose-500/20 to-pink-500/20', icon: '⚕️' },
    government: {
      color: 'text-indigo-400',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      icon: '🏛️',
    },
    safety: { color: 'text-red-400', gradient: 'from-red-500/20 to-orange-500/20', icon: '🛡️' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
            <Newspaper size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Montgomery News & Development
            </h1>
            <p className="text-zinc-400 mt-2">Stay informed about city initiatives, updates, and local stories</p>
          </div>
        </div>
      </motion.header>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Filter size={16} className="inline mr-2" />
            All News
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                selectedCategory === cat
                  ? `bg-gradient-to-r ${categoryConfig[cat].gradient} border border-white/20`
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {categoryConfig[cat].icon} {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* News Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
          />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.map((article) => {
            const config = categoryConfig[article.category] || categoryConfig.business;
            return (
              <motion.a
                key={article.id}
                variants={itemVariants}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:shadow-lg h-full flex flex-col relative`}
              >
                {/* Image Placeholder */}
                {article.imageUrl && (
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                    <img
                      src={article.imageUrl}
                      alt={article.headline}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-lg`}>{config.icon}</span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${config.color} bg-gradient-to-r ${config.gradient} border border-white/10 capitalize`}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {article.headline}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-3 flex-1">
                    {article.summary}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-white/5">
                    <span>{article.source}</span>
                    <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="p-2 rounded-full bg-blue-600/80">
                    <ChevronRight size={16} className="text-white" />
                  </div>
                </motion.div>
              </motion.a>
            );
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl p-12 text-center border border-white/10"
        >
          <Newspaper size={48} className="mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400 text-lg">No news articles found. Try adjusting your filters.</p>
        </motion.div>
      )}

      {/* Featured Stories Section */}
      {articles.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-3xl p-8 border border-amber-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp size={24} className="text-amber-400" />
            Trending Stories
          </h2>
          <div className="space-y-3">
            {articles.slice(0, 3).map((article, i) => (
              <motion.a
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="text-2xl font-bold text-amber-400">#{i + 1}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                    {article.headline}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">{article.source}</p>
                </div>
                <ChevronRight size={20} className="text-zinc-600 group-hover:text-amber-400 transition-colors flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
