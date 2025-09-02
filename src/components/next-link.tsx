'use client';

interface NextLinkProps {
  nextCommentId: number | null;
}

export function NextLink({ nextCommentId }: NextLinkProps) {
  if (!nextCommentId) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const element = document.getElementById(`comment-${nextCommentId}`);
    
    if (element) {
      // Scroll to element - position just below top of viewport
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <a 
      href={`#comment-${nextCommentId}`}
      className="hover:underline"
      onClick={handleClick}
    >
      next
    </a>
  );
}