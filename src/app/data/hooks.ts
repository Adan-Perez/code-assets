export const AVAILABLE_HOOKS = {
  React: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_REACT,
  TailwindCSS: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_TAILWINDCSS,
  Database: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_DATABASE,
  Misc: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_MISC,
  NodeJS: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_NODEJS,
  AI: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_AI,
} as Record<string, string>;
