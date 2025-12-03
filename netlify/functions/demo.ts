import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Move your API logic here or call external services
  const demoData = {
    success: true,
    count: 3,
    pain_points: [
      { pain_summary: 'Pricing issues', category: 'Pricing', pain_score: 85 },
      { pain_summary: 'Bug reports', category: 'Bugs', pain_score: 72 },
      { pain_summary: 'Feature requests', category: 'Feature', pain_score: 65 }
    ]
  };

  return new Response(JSON.stringify(demoData), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config: Config = {
  path: "/api/demo"
};
