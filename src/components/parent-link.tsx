'use client';

interface ParentLinkProps {
  parentId: number;
  storyId: number;
}

export function ParentLink({ parentId, storyId }: ParentLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // First try to find a comment with this ID
    let element = document.getElementById(`comment-${parentId}`);
    
    if (!element) {
      // If not found, check if parent is the story itself
      element = document.getElementById(`story-${storyId}`);
    }
    
    if (element) {
      // Scroll to element - position just below top of viewport
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Final fallback to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a 
      href={`#comment-${parentId}`}
      className="hover:underline"
      onClick={handleClick}
    >
      parent
    </a>
  );
}