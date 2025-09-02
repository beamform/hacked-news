import { Story } from '@/lib/hacker-news';

interface StoryListProps {
  stories: Story[];
}

function extractDomain(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return null;
  }
}

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

export function StoryList({ stories }: StoryListProps) {
  return (
    <ul>
      {stories.map((story, index) => {
        const domain = extractDomain(story.url);
        return (
          <li key={story.id} className="flex mb-1">
            <span className="text-right w-8 mr-2 text-gray-500 text-sm leading-5">{index + 1}.</span>
            <div>
              <div className="leading-5">
                <a
                  href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black text-sm"
                >
                  {story.title}
                </a>
                {domain && <span className="text-xs text-gray-500"> ({domain})</span>}
              </div>
              <div className="text-xs text-gray-500">
                {story.score} points by {story.by} {formatTimeAgo(story.time)} | {' '}
                <a 
                  href={`https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:underline"
                >
                  {story.descendants || 0} comments
                </a>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}