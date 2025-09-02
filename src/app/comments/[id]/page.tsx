import { getStoryWithComments } from '@/lib/hacker-news';
import { StoryHeader } from '@/components/story-header';
import { CommentThread } from '@/components/comment-thread';

interface CommentsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { id } = await params;
  const { story, comments } = await getStoryWithComments(Number(id));
  
  return (
    <div>
      <StoryHeader story={story} />
      <CommentThread comments={comments} storyId={story.id} />
    </div>
  );
}