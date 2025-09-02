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
      href={`#comment-${prevCommentId}`}
      className="hover:underline"
      onClick={handleClick}
    >
      prev
    </a>
  );
}