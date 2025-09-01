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

export function StoryList({ stories }: StoryListProps) {
  return (
    <ul>
      {stories.map((story, index) => {
        const domain = extractDomain(story.url);
        return (
          <li key={story.id} className="flex mb-2">
            <span className="text-right w-8 mr-2 text-gray-500">{index + 1}.</span>
            <div>
              <div>
                <a
                  href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black"
                >
                  {story.title}
                </a>
                {domain && <span className="text-gray-500"> ({domain})</span>}
              </div>
              <div className="text-xs text-gray-500">
                {story.score} points by {story.by}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}