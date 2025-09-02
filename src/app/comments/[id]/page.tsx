import { getStoryWithComments } from '@/lib/hacker-news';
import { StoryHeader } from '@/components/story-header';
import { CommentThreadClient } from '@/components/comment-thread-client';

interface CommentsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { id } = await params;
  const { story, comments } = await getStoryWithComments(Number(id));
  
  return (
    <div>
      <StoryHeader story={story} />
      <CommentThreadClient comments={comments} storyId={story.id} />
    </div>
  );
}