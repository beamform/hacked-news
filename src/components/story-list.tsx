import { Story } from '@/lib/hacker-news';

interface StoryListProps {
  stories: Story[];
}

export function StoryList({ stories }: StoryListProps) {
  return (
    <ul>
      {stories.map((story, index) => (
        <li key={story.id} className="flex">
          <span className="text-right w-8 mr-2 text-gray-500">{index + 1}.</span>
          <a
            href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black"
          >
            {story.title}
          </a>
        </li>
      ))}
    </ul>
  );
}