'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Edit2, Trash2, X, Check } from 'lucide-react';
import {
  Comment,
  getSectionComments,
  addComment,
  editComment,
  deleteComment,
  formatTimestamp,
  getCommentCount,
} from '../utils/commentUtils';

interface CommentSectionProps {
  sectionId: string;
  sectionTitle: string;
  defaultAuthor?: string;
}

export default function CommentSection({
  sectionId,
  sectionTitle,
  defaultAuthor = 'Harry',
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Load comments on mount and when sectionId changes
  useEffect(() => {
    loadSectionComments();
  }, [sectionId]);

  const loadSectionComments = () => {
    setComments(getSectionComments(sectionId));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(sectionId, defaultAuthor, newComment.trim());
      setNewComment('');
      loadSectionComments();
    }
  };

  const handleEditComment = (commentId: string) => {
    if (editContent.trim()) {
      editComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
      loadSectionComments();
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
      loadSectionComments();
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const commentCount = comments.length;

  return (
    <div className="relative">
      {/* Comment Button/Badge */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1419]/80 hover:bg-[#2C7A7B]/20 text-white/90 hover:text-[#2C7A7B] rounded-xl border border-white/10 hover:border-[#2C7A7B]/40 transition-all text-sm font-medium relative"
      >
        <MessageSquare size={16} className="text-[#2C7A7B]" />
        <span>Comments</span>
        {commentCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#2C7A7B] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            {commentCount}
          </span>
        )}
      </motion.button>

      {/* Comments Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-96 max-h-[600px] bg-gradient-to-br from-[#1A2332] to-[#2C3E50] backdrop-blur-2xl border-2 border-[#2C7A7B]/40 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#2C7A7B]/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#2C7A7B]" />
                <h3 className="text-white font-semibold text-sm">
                  {sectionTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.length === 0 ? (
                <div className="text-center text-white/50 text-sm py-8">
                  No comments yet. Be the first to add one!
                </div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[#2C7A7B] font-semibold text-sm">
                          {comment.author}
                        </span>
                        <span className="text-white/50 text-xs ml-2">
                          {formatTimestamp(comment.timestamp)}
                          {comment.edited && ' (edited)'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded text-white/60 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {editingId === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#2C7A7B] resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#2C7A7B] hover:bg-[#3B9B9B] text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Check size={14} />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/90 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* New Comment Input */}
            <div className="p-4 border-t border-white/10 bg-[#0F1419]/50">
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#2C7A7B] resize-none"
                  rows={2}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B9B] hover:from-[#3B9B9B] hover:to-[#2C7A7B] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-white/40 text-xs mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
