import { db } from "@/db/init";
import { linkClicks, shortLinks } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";

type IpInfo = {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
};

type linkClicksType = typeof linkClicks.$inferInsert;

self.onmessage = async (event: MessageEvent) => {
  const { ip, userAgent, referer, id } = event.data;

  const increment = await db
    .update(shortLinks)
    .set({
      clickCount: sql`${shortLinks.clickCount} + 1`,
    })
    .where(eq(shortLinks.id, id))
    .returning({
      clickCount: shortLinks.clickCount,
    });

  const linkClick = await db
    .insert(linkClicks)
    .values({
      linkId: id,
      ipAddress: ip,
    })
    .onConflictDoNothing({
      target: [linkClicks.linkId, linkClicks.ipAddress],
    })
    .returning({
      id: linkClicks.id,
    });

  if (linkClick.length > 0) {
    console.log("new ip detected");

    await db
      .update(shortLinks)
      .set({
        uniqueCount: sql`${shortLinks.uniqueCount} + 1`,
      })
      .where(eq(shortLinks.id, id));
  }

  console.log("linkClick", linkClick);

  const request = await fetch(`http://ip-api.com/json/${ip}`);
  const ipInfo: IpInfo = await request.json();

  const country = ipInfo.country;
  const countryCode = ipInfo.countryCode;
  const city = ipInfo.city;
  const region = ipInfo.regionName;
  const regionCode = ipInfo.region;

  const deviceType = getDeviceType(userAgent);

  const data: linkClicksType = {
    linkId: id,
    country,
    countryCode,
    city,
    region,
    regionCode,
    deviceType: deviceType,
    ipAddress: ip,
    userAgent,
    referer: referer,
  };

  await db
    .insert(linkClicks)
    .values(data)
    .onConflictDoUpdate({
      target: [linkClicks.linkId, linkClicks.ipAddress],
      set: data,
    });

  postMessage("worker done");
};

function getDeviceType(referer: string) {
  let deviceType = "";

  switch (true) {
    case referer.includes("mobile"):
      deviceType = "Mobile";
      return deviceType;
    default:
      deviceType = "Desktop";
      return deviceType;
  }
}
