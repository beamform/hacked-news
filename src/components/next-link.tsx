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
      // Add highlight animation
      element.style.backgroundColor = '#fef9c3'; // yellow-100
      element.style.transition = 'background-color 0.3s ease';
      
      // Scroll to element - position just below top of viewport
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Remove highlight after animation
      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
        setTimeout(() => {
          element.style.transition = '';
        }, 300);
      }, 1000);
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