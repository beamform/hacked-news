'use client';

interface CollapseLinkProps {
  commentId: number;
  hasChildren: boolean;
  onToggle: (commentId: number) => void;
  isCollapsed: boolean;
}

export function CollapseLink({ commentId, hasChildren, onToggle, isCollapsed }: CollapseLinkProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(commentId);
  };

  return (
    <a 
      href="#"
      className="hover:underline"
      onClick={handleClick}
    >
      {isCollapsed ? '[+]' : '[–]'}
    </a>
  );
}