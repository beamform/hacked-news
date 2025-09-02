const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export interface Story {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
}

export async function getTopStoryIds(): Promise<number[]> {
  const response = await fetch(`${BASE_URL}/topstories.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch top stories');
  }
  return response.json();
}

export async function getStory(id: number): Promise<Story> {
  const response = await fetch(`${BASE_URL}/item/${id}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch story ${id}`);
  }
  return response.json();
}

export async function getTopStories(limit = 30): Promise<Story[]> {
  const storyIds = await getTopStoryIds();
  const limitedIds = storyIds.slice(0, limit);
  
  const storyPromises = limitedIds.map(id => getStory(id));
  const stories = await Promise.all(storyPromises);
  
  return stories.filter(story => story.title && (story.url || story.id));
}