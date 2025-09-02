const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export interface Story {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  kids?: number[];
}

export interface Comment {
  id: number;
  by?: string;
  time: number;
  text?: string;
  kids?: number[];
  parent?: number;
  deleted?: boolean;
  dead?: boolean;
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

export async function getComment(id: number): Promise<Comment> {
  const response = await fetch(`${BASE_URL}/item/${id}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comment ${id}`);
  }
  return response.json();
}

async function fetchAllComments(commentIds: number[], allComments: Map<number, Comment> = new Map()): Promise<Map<number, Comment>> {
  const newCommentPromises = commentIds
    .filter(id => !allComments.has(id))
    .map(id => getComment(id));
    
  if (newCommentPromises.length === 0) {
    return allComments;
  }
  
  const newComments = await Promise.all(newCommentPromises);
  
  // Add new comments to the map
  newComments.forEach(comment => {
    if (comment && !comment.deleted && !comment.dead) {
      allComments.set(comment.id, comment);
    }
  });
  
  // Get all child comment IDs
  const childIds = newComments
    .filter(comment => comment && !comment.deleted && !comment.dead && comment.kids)
    .flatMap(comment => comment.kids || []);
  
  if (childIds.length > 0) {
    return fetchAllComments(childIds, allComments);
  }
  
  return allComments;
}

export async function getStoryWithComments(id: number): Promise<{ story: Story; comments: Comment[] }> {
  const story = await getStory(id);
  
  if (!story.kids || story.kids.length === 0) {
    return { story, comments: [] };
  }
  
  // Fetch all comments recursively
  const allCommentsMap = await fetchAllComments(story.kids);
  
  // Return only top-level comments, but all comments are now available for parent links
  const topLevelComments = story.kids
    .map(id => allCommentsMap.get(id))
    .filter((comment): comment is Comment => !!comment);
  
  return { 
    story, 
    comments: topLevelComments
  };
}

export async function getTopStories(limit = 30): Promise<Story[]> {
  const storyIds = await getTopStoryIds();
  const limitedIds = storyIds.slice(0, limit);
  
  const storyPromises = limitedIds.map(id => getStory(id));
  const stories = await Promise.all(storyPromises);
  
  return stories.filter(story => story.title && (story.url || story.id));
}