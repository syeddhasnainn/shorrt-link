import { BunRequest } from "bun";
import { db } from "@/db/init";
import { linkClicks, shortLinks, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as jose from "jose";

function shortCodeGenerator() {
  const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let shortCode = "";

  while (shortCode.length < 8) {
    const selectedIndex = Math.floor(Math.random() * 61);
    shortCode += BASE62[selectedIndex];
  }

  return shortCode;
}

function addCors(headers: Headers) {
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return headers;
}
const worker = new Worker("./src/workers/worker.ts");

worker.onmessage = (event) => {
  console.log("ip info:", event.data);
};

worker.onerror = (error) => {
  console.error("Worker error:", error);
};

Bun.serve({
  port: 3001,
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: addCors(new Headers({ "Content-Type": "application/json" })) });
    }
    return fetch(req);
  },
  routes: {
    "/": {
      async GET(req, server) {
        const jwt = await jwtChecker(req);

        if (jwt.authenticated === false) {
          return Response.json({ message: "unauthorized" });
        }

        return Response.json(
          { message: "You shouldn't be here" },
          {
            headers: addCors(new Headers({ "Content-Type": "application/json" })),
          },
        );
      },
    },

    "/api/shorten": {
      async POST(req, server) {
        const { link } = await req.json();
        const jwt = await jwtChecker(req);

        if (!jwt.authenticated) {
          return Response.json({ error: "jwt missing" });
        }

        if (!link) {
          return Response.json({
            message: "Link is required",
            method: "GET",
          });
        }

        const userId = jwt.payload!.userId as number;

        const short_code = shortCodeGenerator();

        const data = {
          originalUrl: link,
          shortUrl: short_code,
          createdBy: userId,
        };

        const result = await db.insert(shortLinks).values(data).returning({
          id: shortLinks.id,
          originalUrl: shortLinks.originalUrl,
          shortUrl: shortLinks.shortUrl,
          createdBy: shortLinks.createdBy,
        });

        return Response.json(
          { result },
          { headers: addCors(new Headers({ "Content-Type": "application/json" })) },
        );
      },
    },

    "/:shortCode": {
      async GET(req, server) {
        const shortCode = req.params.shortCode;

        const result = await db
          .select()
          .from(shortLinks)
          .where(eq(shortLinks.shortUrl, shortCode))
          .then((rows) => rows[0] ?? null);

        if (!result) {
          return Response.json({ message: "invalid short code" }, { status: 404 });
        }

        const ip = req.headers.get("x-forwarded-for");
        const userAgent = req.headers.get("user-agent") || "unknown";
        const referer = req.headers.get("referer") || "none";

        worker.postMessage({ ip, userAgent, referer, id: result.id });

        return Response.redirect(result.originalUrl, 302);
      },
    },

    "/api/getUrls": {
      async GET(req, server) {
        const isJwtValid = await jwtChecker(req);

        if (!isJwtValid.authenticated) {
          return Response.json({ message: "jwt missing or invalid" });
        }

        const userId = isJwtValid.payload!.userId as number;

        const urls = await db.select().from(shortLinks).where(eq(shortLinks.createdBy, userId));

        return Response.json(
          { urls, message: "urls fetched successfully", isJwtValid },
          { headers: addCors(new Headers({ "Content-Type": "application/json" })) },
        );
      },
    },

    "/api/signup": {
      async POST(req, server) {
        const { email, password } = await req.json();

        if (!email || !password) {
          return Response.json(
            { message: "email and password are required" },
            { headers: addCors(new Headers({ "Content-Type": "application/json" })) },
          );
        }

        const isUserExist = await db.select().from(users).where(eq(users.email, email));

        if (isUserExist.length > 0) {
          return Response.json(
            { message: "User already exists" },
            { headers: addCors(new Headers({ "Content-Type": "application/json" })) },
          );
        }

        const passwordHash = await Bun.password.hash(password);

        await db.insert(users).values({ email, passwordHash });

        return Response.json(
          { message: "user signed up" },
          { headers: addCors(new Headers({ "Content-Type": "application/json" })), status: 201 },
        );
      },
    },

    "/api/login": {
      async POST(req, server) {
        const { email, password } = await req.json();

        if (!email || !password) {
          return Response.json({ message: "email and password are required" });
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .then((row) => row[0]);

        if (!user) {
          return Response.json(
            { message: "email not found" },
            { headers: addCors(new Headers({ "Content-Type": "application/json" })) },
          );
        }

        const isMatch = await Bun.password.verify(password, user.passwordHash);

        if (!isMatch) {
          return Response.json(
            { message: "invalid password" },
            { headers: addCors(new Headers({ "Content-Type": "application/json" })) },
          );
        }

        const jwtSecret = new TextEncoder().encode(import.meta.env.JWT_SECRET);

        const jwt = await new jose.SignJWT({ userId: user.id, userEmail: user.email })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setIssuer("urn:example:issuer")
          .setAudience("urn:example:audience")
          .setExpirationTime("24h")
          .sign(jwtSecret);

        return Response.json(
          { message: "logged in", jwt },
          { headers: addCors(new Headers({ "Content-Type": "application/json" })), status: 200 },
        );
      },
    },

    "/api/getClickData": {
      async POST(req, server) {
        const { shortCode } = await req.json();

        if (!shortCode) {
          return Response.json({ message: "short code is required" });
        }

        const isJwtValid = await jwtChecker(req);

        if (!isJwtValid.authenticated) {
          return Response.json({ message: "jwt missing or invalid" });
        }

        try {
          const shortLinkData = await db.select().from(shortLinks).where(eq(shortLinks.shortUrl, shortCode));

          const linkId = shortLinkData[0].id;

          const clickData = await db.select().from(linkClicks).where(eq(linkClicks.linkId, linkId));

          return Response.json(
            { shortLinkData, clickData },
            {
              headers: addCors(new Headers({ "Content-Type": "application/json" })),
            },
          );
        } catch (error) {
          return Response.json({ message: "error fetching link id" });
        }
      },
    },
  },
});

async function jwtChecker(req: BunRequest) {
  let jwt = req.headers.get("Authorization");

  if (!jwt) {
    return { authenticated: false, error: { message: "jwt missing" } };
  }

  jwt = jwt?.split(" ")[1];

  const jwtSecret = new TextEncoder().encode(import.meta.env.JWT_SECRET);

  try {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, jwtSecret, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });

    return { authenticated: true, payload, protectedHeader };
  } catch (error) {
    return { authenticated: false, error };
  }
}
