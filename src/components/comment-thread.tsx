import type { Comment } from '@/lib/hacker-news';
import { getComment } from '@/lib/hacker-news';
import { ParentLink } from './parent-link';

function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000;
  const diffInSeconds = now - timestamp;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

function parseHtmlContent(html: string): JSX.Element[] {
  // Split by <p> tags to create separate paragraphs
  const paragraphs = html
    .split(/<p>/)
    .filter(p => p.trim())
    .map(p => {
      // Clean up the paragraph content
      return p
        .replace(/<\/p>/g, '')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '$2 ($1)')
        .replace(/<[^>]*>/g, '')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
    })
    .filter(p => p);

  return paragraphs.map((paragraph, index) => (
    <p key={index} className="leading-snug mb-2 last:mb-0">
      {paragraph}
    </p>
  ));
}

interface CommentProps {
  comment: Comment;
  depth?: number;
  storyId: number;
}

async function CommentItem({ comment, depth = 0, storyId }: CommentProps) {
  if (comment.deleted || comment.dead || !comment.text) {
    return null;
  }

  let childComments: Comment[] = [];
  if (comment.kids && comment.kids.length > 0) {
    try {
      const childPromises = comment.kids.map(id => getComment(id));
      childComments = await Promise.all(childPromises);
      childComments = childComments.filter(child => child && !child.deleted && !child.dead);
    } catch (error) {
      console.error('Error fetching child comments:', error);
    }
  }

  return (
    <div id={`comment-${comment.id}`} className={`${depth > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''} mb-2`}>
      <div className="text-xs text-gray-500 mb-1">
        {comment.by} {formatTimeAgo(comment.time)}
        {comment.parent && (
          <>
            {' | '}
            <ParentLink parentId={comment.parent} storyId={storyId} />
          </>
        )}
      </div>
      <div className="text-sm text-black mb-2">
        {parseHtmlContent(comment.text)}
      </div>
      {childComments.map(child => (
        <CommentItem key={child.id} comment={child} depth={depth + 1} storyId={storyId} />
      ))}
    </div>
  );
}

interface CommentThreadProps {
  comments: Comment[];
  storyId: number;
}

export async function CommentThread({ comments, storyId }: CommentThreadProps) {
  return (
    <div>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} storyId={storyId} />
      ))}
    </div>
  );
}