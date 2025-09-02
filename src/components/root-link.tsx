'use client';

interface RootLinkProps {
  rootCommentId: number;
}

export function RootLink({ rootCommentId }: RootLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const element = document.getElementById(`comment-${rootCommentId}`);
    
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
      href={`#comment-${rootCommentId}`}
      className="hover:underline"
      onClick={handleClick}
    >
      root
    </a>
  );
}