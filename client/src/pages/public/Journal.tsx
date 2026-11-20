import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, Search, Clock, ArrowRight, Tag } from 'lucide-react';
import api from '../../api/client';
import { IJournalPost } from '../../types';

export const Journal: React.FC = () => {
  const [posts, setPosts] = useState<IJournalPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = [
    { label: 'All Dispatches', value: 'all' },
    { label: 'Essays', value: 'Essays' },
    { label: 'On Writing', value: 'On Writing' },
    { label: 'Reflections', value: 'Reflections' },
    { label: 'Behind the Quill', value: 'Behind the Quill' }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);
        if (selectedTag) queryParams.append('tag', selectedTag);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());
        queryParams.append('status', 'published');

        const res = await api.get(`/journal?${queryParams.toString()}`);
        if (res.data?.success) {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching journal posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, selectedTag, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          Reflections &bull; Craft &bull; Memory
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          The Ink Journal
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          Essays on the craft of fiction, the sensory geology of monsoon India, the rebellion of characters, and notes gathered behind the quill.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-y border-brass/30 py-4">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setSelectedTag('');
              }}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                selectedCategory === cat.value && !selectedTag
                  ? 'bg-burgundy text-ivory font-semibold'
                  : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search essays, craft notes..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-ivory border border-brass/50 text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-burgundy"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brass" />
        </div>
      </div>

      {/* Tag indicator if selected */}
      {selectedTag && (
        <div className="flex items-center gap-2 text-xs text-charcoal/70">
          <span>Filtering by tag:</span>
          <span className="font-semibold text-burgundy bg-parchment px-2 py-0.5 border border-brass/40">
            #{selectedTag}
          </span>
          <button
            onClick={() => setSelectedTag('')}
            className="text-forest underline text-[11px] ml-2"
          >
            Clear tag
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {isLoading ? (
        <div className="py-24 text-center font-reading text-burgundy text-lg">
          Unfolding the manuscript folios...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-parchment/30 border border-brass/30 p-8">
          <Feather size={32} className="mx-auto text-brass opacity-60" />
          <h3 className="font-display text-2xl text-charcoal">No journal entries found</h3>
          <p className="font-reading text-sm text-charcoal/60">
            Try adjusting your search criteria or explore other categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post._id}
              className="paper-card flex flex-col justify-between group transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-parchment/60 border-b border-brass/30">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-charcoal/80 text-ivory text-[10px] uppercase tracking-widest px-2 py-0.5">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-brass uppercase font-editorial tracking-wider">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {post.readingTimeMinutes} min read
                    </span>
                    {post.publishedAt && (
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-2xl font-bold text-burgundy leading-snug group-hover:text-forest transition-colors">
                    <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="font-reading text-xs text-charcoal/80 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTag(t)}
                          className="text-[10px] bg-parchment/70 hover:bg-parchment border border-brass/30 px-2 py-0.5 text-charcoal/70 transition-colors"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-brass/20 flex items-center justify-between">
                <Link
                  to={`/journal/${post.slug}`}
                  className="text-xs font-semibold text-forest hover:text-burgundy flex items-center gap-1"
                >
                  Read Essay <ArrowRight size={12} />
                </Link>
                {post.views > 0 && (
                  <span className="text-[10px] text-charcoal/50">
                    {post.views} readers
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
