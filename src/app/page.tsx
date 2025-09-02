import { StoryList } from '@/components/story-list';
import { getTopStories } from '@/lib/hacker-news';

export default async function Home() {
  const stories = await getTopStories(30);

  return <StoryList stories={stories} />;
}
