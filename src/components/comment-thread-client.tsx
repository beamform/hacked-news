'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/hacker-news';
import { ParentLink } from './parent-link';
import { NextLink } from './next-link';
import { PrevLink } from './prev-link';
import { CollapseLink } from './collapse-link';

function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000;
  const diffInSeconds = now - timestamp;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x3A;/g, ':')
    .replace(/&#x3D;/g, '=')
    .replace(/&#x3F;/g, '?');
}

function parseHtmlContent(html: string): JSX.Element[] {
  const paragraphHtml = html.split(/<p>/).filter(p => p.trim());
  
  return paragraphHtml.map((pContent, index) => {
    const cleanContent = pContent.replace(/<\/p>/g, '');
    
    return (
      <p key={index} className="leading-snug mb-2 last:mb-0">
        {renderTextWithLinks(cleanContent)}
      </p>
    );
  });
}

function renderTextWithLinks(html: string): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];
  let remaining = html;
  let key = 0;
  
  while (remaining) {
    const linkMatch = remaining.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
    
    if (linkMatch) {
      const [fullMatch, url, linkText] = linkMatch;
      const beforeLink = remaining.substring(0, linkMatch.index!);
      
      if (beforeLink) {
        result.push(decodeHtmlEntities(beforeLink));
      }
      
      const decodedUrl = decodeHtmlEntities(url);
      result.push(
        <a
          key={key++}
          href={decodedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          {decodeHtmlEntities(linkText)}
        </a>
      );
      
      remaining = remaining.substring(linkMatch.index! + fullMatch.length);
    } else {
      result.push(decodeHtmlEntities(remaining.replace(/<[^>]*>/g, '')));
      break;
    }
  }
  
  return result;
}

interface CommentItemProps {
  comment: Comment & { children?: Comment[] };
  depth?: number;
  storyId: number;
  nextSiblingId?: number | null;
  prevSiblingId?: number | null;
  collapsedComments: Set<number>;
  onToggleCollapse: (commentId: number) => void;
}

function CommentItem({ comment, depth = 0, storyId, nextSiblingId, prevSiblingId, collapsedComments, onToggleCollapse }: CommentItemProps) {
  if (comment.deleted || comment.dead || !comment.text) {
    return null;
  }

  const isCollapsed = collapsedComments.has(comment.id);
  const hasChildren = comment.children && comment.children.length > 0;

  return (
    <div id={`comment-${comment.id}`} className={`${depth > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''} mb-2`}>
      <div className="text-xs text-gray-500 mb-1">
        {comment.by} {formatTimeAgo(comment.time)}
        {comment.parent && (
          <>
            {' | '}
            <ParentLink parentId={comment.parent} storyId={storyId} />
          </>
        )}
        {prevSiblingId && (
          <>
            {' | '}
            <PrevLink prevCommentId={prevSiblingId} />
          </>
        )}
        {nextSiblingId && (
          <>
            {' | '}
            <NextLink nextCommentId={nextSiblingId} />
          </>
        )}
        {' '}
        <CollapseLink 
          commentId={comment.id} 
          hasChildren={hasChildren} 
          onToggle={onToggleCollapse}
          isCollapsed={isCollapsed}
        />
      </div>
      {!isCollapsed && (
        <>
          <div className="text-sm text-black mb-2">
            {parseHtmlContent(comment.text)}
          </div>
          {comment.children && comment.children.map((child, index) => {
            const prevSibling = index > 0 ? comment.children![index - 1].id : null;
            const nextSibling = index < comment.children!.length - 1 ? comment.children![index + 1].id : null;
            return (
              <CommentItem 
                key={child.id} 
                comment={child} 
                depth={depth + 1} 
                storyId={storyId}
                prevSiblingId={prevSibling}
                nextSiblingId={nextSibling}
                collapsedComments={collapsedComments}
                onToggleCollapse={onToggleCollapse}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

interface CommentThreadClientProps {
  comments: (Comment & { children?: Comment[] })[];
  storyId: number;
}

export function CommentThreadClient({ comments, storyId }: CommentThreadClientProps) {
  const [collapsedComments, setCollapsedComments] = useState<Set<number>>(new Set());

  const handleToggleCollapse = (commentId: number) => {
    setCollapsedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <div>
      {comments.map((comment, index) => {
        const prevSibling = index > 0 ? comments[index - 1].id : null;
        const nextSibling = index < comments.length - 1 ? comments[index + 1].id : null;
        return (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            storyId={storyId}
            prevSiblingId={prevSibling}
            nextSiblingId={nextSibling}
            collapsedComments={collapsedComments}
            onToggleCollapse={handleToggleCollapse}
          />
        );
      })}
    </div>
  );
}