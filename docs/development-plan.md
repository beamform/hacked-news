# Hacker News Client Development Plan

## Goal
Create a simple Hacker News client that displays the top stories page (equivalent to https://news.ycombinator.com/news) with story links only.

## API Research
- **Base URL**: `https://hacker-news.firebaseio.com/v0/`
- **Top Stories Endpoint**: `topstories.json` - returns array of up to 500 story IDs
- **Individual Story**: `item/{id}.json` - returns story details including title and url

## Development Tasks

### 1. API Integration
- [x] Create utility functions to fetch new story IDs
- [x] Create function to fetch individual story details
- [x] Handle API errors gracefully

### 2. Components
- [ ] Build `StoryList` component to render list of stories
- [ ] Each story displays as a simple link with title
- [ ] No additional metadata (score, comments, etc.)

### 3. Page Implementation
- [ ] Replace default Next.js home page
- [ ] Integrate story list component
- [ ] Basic styling for clean link display

### 4. Testing
- [ ] Verify stories load correctly
- [ ] Test link functionality
- [ ] Ensure performance is acceptable

## Tech Stack
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Native fetch API for HTTP requests