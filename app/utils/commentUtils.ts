/**
 * Utility functions for managing comments across dashboard sections
 */

export interface Comment {
  id: string;
  sectionId: string;
  author: string;
  timestamp: number;
  content: string;
  edited?: boolean;
  editedAt?: number;
}

export interface CommentThread {
  sectionId: string;
  comments: Comment[];
}

/**
 * Generate a unique comment ID
 */
export function generateCommentId(): string {
  return `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load all comments from localStorage
 */
export function loadComments(): CommentThread[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lcb-dashboard-comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved comments:', e);
      }
    }
  }
  return [];
}

/**
 * Save comments to localStorage
 */
export function saveComments(threads: CommentThread[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lcb-dashboard-comments', JSON.stringify(threads));
  }
}

/**
 * Get comments for a specific section
 */
export function getSectionComments(sectionId: string): Comment[] {
  const threads = loadComments();
  const thread = threads.find(t => t.sectionId === sectionId);
  return thread?.comments || [];
}

/**
 * Add a new comment to a section
 */
export function addComment(
  sectionId: string,
  author: string,
  content: string
): Comment {
  const threads = loadComments();
  const comment: Comment = {
    id: generateCommentId(),
    sectionId,
    author,
    timestamp: Date.now(),
    content,
  };

  const threadIndex = threads.findIndex(t => t.sectionId === sectionId);
  if (threadIndex >= 0) {
    threads[threadIndex].comments.push(comment);
  } else {
    threads.push({
      sectionId,
      comments: [comment],
    });
  }

  saveComments(threads);
  return comment;
}

/**
 * Edit an existing comment
 */
export function editComment(
  commentId: string,
  newContent: string
): Comment | null {
  const threads = loadComments();

  for (const thread of threads) {
    const comment = thread.comments.find(c => c.id === commentId);
    if (comment) {
      comment.content = newContent;
      comment.edited = true;
      comment.editedAt = Date.now();
      saveComments(threads);
      return comment;
    }
  }

  return null;
}

/**
 * Delete a comment
 */
export function deleteComment(commentId: string): boolean {
  const threads = loadComments();

  for (const thread of threads) {
    const index = thread.comments.findIndex(c => c.id === commentId);
    if (index >= 0) {
      thread.comments.splice(index, 1);
      saveComments(threads);
      return true;
    }
  }

  return false;
}

/**
 * Get comment count for a section
 */
export function getCommentCount(sectionId: string): number {
  return getSectionComments(sectionId).length;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: timestamp < now - 31536000000 ? 'numeric' : undefined,
  });
}

/**
 * Get all sections with comments
 */
export function getSectionsWithComments(): string[] {
  const threads = loadComments();
  return threads.filter(t => t.comments.length > 0).map(t => t.sectionId);
}
