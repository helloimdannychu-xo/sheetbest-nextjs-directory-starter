import { getServerSideSitemap } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const response = await fetch(
    `https://sheet.best/api/sheets/${process.env.SHEETBEST_CONNECTION_ID}`
  );
  const items = await response.json();

  const fields = items.map((item) => ({
    loc: `${process.env.SITE_URL}/item/${item.slug}`,
    lastmod: item.createdAt || new Date().toISOString(),
  }));

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
