export const routes = {
  login: '/login',
  homeClient: '/home/client',
  askOlly: '/home/ask-olly',
} as const;

export type RouteKey = keyof typeof routes;
