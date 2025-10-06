import { users, linkClicks, shortLinks } from "@/db/schema";
import { db } from "@/db/init";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("Clearing existing data...");
  await db.delete(linkClicks);
  await db.delete(shortLinks);
  await db.delete(users);

  // Seed Users
  console.log("Seeding users...");
  const mockUsers = [
    {
      email: "hasnain@yopmail.com",
      passwordHash:
        "$argon2id$v=19$m=65536,t=2,p=1$qZsOhbMDy4bfCuXz+1N2synIcGQ/0e2wMgmYsUE+wE0$2E7xQqBkAckOq9IOScW1grGe6s0Ao/MoGmCjaG0Y4BE",
    },
  ];

  const insertedUsers = await db.insert(users).values(mockUsers).returning();
  console.log(`✓ Created ${insertedUsers.length} users\n`);

  // Seed Short Links
  console.log("Seeding short links...");
  const mockLinks = [
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://github.com/drizzle-team/drizzle-orm",
      shortUrl: "drizzle",
      clickCount: 42,
      uniqueCount: 35,
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://www.example.com/very/long/url/that/needs/shortening",
      shortUrl: "ex123",
      clickCount: 156,
      uniqueCount: 120,
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      shortUrl: "yt-music",
      clickCount: 1337,
      uniqueCount: 890,
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://stackoverflow.com/questions/12345678",
      shortUrl: "so-help",
      clickCount: 89,
      uniqueCount: 78,
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://www.reddit.com/r/programming",
      shortUrl: "r-prog",
      clickCount: 234,
      uniqueCount: 198,
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://news.ycombinator.com",
      shortUrl: "hn",
      clickCount: 512,
      uniqueCount: 423,
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      shortUrl: "mdn-js",
      clickCount: 78,
      uniqueCount: 65,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    },
    {
      createdBy: insertedUsers[0].id,
      originalUrl: "https://www.typescriptlang.org/docs",
      shortUrl: "ts-docs",
      clickCount: 145,
      uniqueCount: 112,
    },
  ];

  const insertedLinks = await db.insert(shortLinks).values(mockLinks).returning();
  console.log(`✓ Created ${insertedLinks.length} short links\n`);

  // Seed Link Clicks
  console.log("Seeding link clicks...");
  const mockClicks = [];

  // Mock data arrays for realistic click tracking
  const ipAddresses = ["192.168.1.1", "10.0.0.5", "172.16.0.10", "203.0.113.42", "198.51.100.23", "8.8.8.8"];

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36",
    "Mozilla/5.0 (iPad; CPU OS 14_7 like Mac OS X) AppleWebKit/605.1.15",
  ];

  const referrers = [
    "https://google.com",
    "https://twitter.com",
    "https://reddit.com",
    "https://news.ycombinator.com",
    null,
    null, // Direct traffic
  ];

  const locations = [
    {
      country: "United States",
      countryCode: "US",
      region: "California",
      regionCode: "CA",
      city: "San Francisco",
    },
    { country: "United Kingdom", countryCode: "GB", region: "England", regionCode: "ENG", city: "London" },
    { country: "Canada", countryCode: "CA", region: "Ontario", regionCode: "ON", city: "Toronto" },
    { country: "Germany", countryCode: "DE", region: "Berlin", regionCode: "BE", city: "Berlin" },
    { country: "Japan", countryCode: "JP", region: "Tokyo", regionCode: "13", city: "Tokyo" },
    { country: "Australia", countryCode: "AU", region: "New South Wales", regionCode: "NSW", city: "Sydney" },
  ];

  const deviceTypes = ["desktop", "mobile", "tablet", "desktop", "mobile"]; // More desktop/mobile

  // Generate random clicks for each link
  for (let i = 0; i < insertedLinks.length; i++) {
    const link = insertedLinks[i];
    const numClicks = Math.min(link.clickCount || 0, 20); // Create up to 20 click records per link

    // Create a shuffled array of IP addresses to ensure uniqueness per link
    const shuffledIPs = [...ipAddresses].sort(() => Math.random() - 0.5);

    for (let j = 0; j < numClicks; j++) {
      const location = locations[Math.floor(Math.random() * locations.length)];
      // Use a unique IP for each click on this link by cycling through shuffled IPs and adding a suffix if needed
      const ipAddress =
        j < shuffledIPs.length
          ? shuffledIPs[j]
          : `${shuffledIPs[j % shuffledIPs.length]}.${Math.floor(j / shuffledIPs.length)}`;

      mockClicks.push({
        linkId: link.id,
        ipAddress: ipAddress,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        referer: referrers[Math.floor(Math.random() * referrers.length)],
        country: location.country,
        countryCode: location.countryCode,
        region: location.region,
        regionCode: location.regionCode,
        city: location.city,
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
      });
    }
  }

  const insertedClicks = await db.insert(linkClicks).values(mockClicks).returning();
  console.log(`✓ Created ${insertedClicks.length} link clicks\n`);

  // Display summary
  console.log("📊 Seeding Summary:");
  console.log("==================");
  console.log(`Users: ${insertedUsers.length}`);
  console.log(`Short Links: ${insertedLinks.length}`);
  console.log(`Link Clicks: ${insertedClicks.length}`);
  console.log("\n✅ Database seeding completed successfully!");
}

main().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
