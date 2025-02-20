export interface Resource {
  id: string;
  url: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  title?: string;
  description?: string;
  favicon?: string;
  baseUrl?: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
}

export const AVAILABLE_TAGS = [
  'documentation',
  'react',
  'vue',
  'angular',
  'css',
  'tailwind',
  'ui',
  'frontend',
  'animation',
  'design',
  'database',
  'api',
  'testing',
  'backend',
  'mobile',
  'desktop',
  'tools',
  'security',
  'AI',
] as const;
