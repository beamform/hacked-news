'use client';

interface PrevLinkProps {
  prevCommentId: number | null;
}

export function PrevLink({ prevCommentId }: PrevLinkProps) {
  if (!prevCommentId) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const element = document.getElementById(`comment-${prevCommentId}`);
    
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
      href={`#comment-${prevCommentId}`}
      className="hover:underline"
      onClick={handleClick}
    >
      prev
    </a>
  );
}