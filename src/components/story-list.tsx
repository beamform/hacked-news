import { Story } from '@/lib/hacker-news';

interface StoryListProps {
  stories: Story[];
}

export function StoryList({ stories }: StoryListProps) {
  return (
    <ul>
      {stories.map((story) => (
        <li key={story.id}>
          <a
            href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {story.title}
          </a>
        </li>
      ))}
    </ul>
  );
}