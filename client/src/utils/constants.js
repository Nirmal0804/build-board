export const CATEGORIES = [
  {
    id: 'Projects',
    name: 'Projects',
    description: 'Show off what you built, gather community feedback, and find collaborators.',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    icon: '🚀',
  },
  {
    id: 'Help',
    name: 'Help',
    description: 'Ask technical questions, debug stubborn errors, and share architectural advice.',
    color: '#ef4444',
    bgColor: '#fef2f2',
    icon: '💡',
  },
  {
    id: 'Learning',
    name: 'Learning',
    description: 'Curated tutorials, technical articles, roadmaps, and guides that helped you level up.',
    color: '#10b981',
    bgColor: '#f0fdf4',
    icon: '📚',
  },
  {
    id: 'Opportunities',
    name: 'Opportunities',
    description: 'Hackathons, open source bounties, team calls, and mentorship openings.',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    icon: '🎯',
  },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
