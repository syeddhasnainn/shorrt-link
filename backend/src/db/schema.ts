import { integer, pgTable, varchar, timestamp, bigint, text, unique, index } from "drizzle-orm/pg-core";

export const shortLinks = pgTable(
  "short_links",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdBy: integer().references(() => users.id),
    originalUrl: text().notNull(),
    shortUrl: varchar({ length: 32 }).unique().notNull(),
    clickCount: bigint({ mode: "number" }).default(0),
    uniqueCount: bigint({ mode: "number" }).default(0),
    createdAt: timestamp().defaultNow().notNull(),
    expiresAt: timestamp(),
  },
  (table) => ({
    shortUrlIdx: index("short_url_idx").on(table.shortUrl),
    createdByIdx: index("created_by_idx").on(table.createdBy),
  }),
);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const linkClicks = pgTable(
  "link_clicks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    linkId: integer().references(() => shortLinks.id),
    ipAddress: text(),
    userAgent: text(),
    referer: text(),
    createdAt: timestamp().defaultNow().notNull(),

    country: varchar({ length: 255 }),
    countryCode: varchar({ length: 32 }),
    regionCode: varchar({ length: 255 }),
    region: varchar({ length: 32 }),
    city: varchar({ length: 255 }),
    deviceType: varchar({ length: 255 }),
  },
  (table) => {
    return {
      uniquePerLink: unique().on(table.linkId, table.ipAddress),
    };
  },
);
