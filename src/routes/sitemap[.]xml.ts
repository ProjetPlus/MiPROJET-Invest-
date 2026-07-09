import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PROJECTS } from "@/lib/mock-data";

const BASE_URL = "https://miprojetinvest.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/projets", changefreq: "daily", priority: "0.9" },
          { path: "/secteurs", changefreq: "weekly", priority: "0.7" },
          { path: "/ecosysteme", changefreq: "monthly", priority: "0.7" },
          { path: "/processus", changefreq: "monthly", priority: "0.6" },
          { path: "/premium", changefreq: "monthly", priority: "0.6" },
          { path: "/a-propos", changefreq: "monthly", priority: "0.5" },
          { path: "/securite", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/guide-investissement-afrique", changefreq: "monthly", priority: "0.7" },
          { path: "/cgu", changefreq: "yearly", priority: "0.3" },
          { path: "/mentions-legales", changefreq: "yearly", priority: "0.3" },
        ];

        const projectEntries: SitemapEntry[] = PROJECTS.map((p) => ({
          path: `/projets/${p.id}`,
          changefreq: "weekly",
          priority: "0.8",
        }));

        const entries = [...staticEntries, ...projectEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
