import type { Config } from "@netlify/functions";

export default async () => {
  await fetch("https://painpointradar.onrender.com/health");
  console.log("Backend pinged to prevent cold start");
};

export const config: Config = {
  schedule: "*/10 * * * *"  // Every 10 minutes
};
