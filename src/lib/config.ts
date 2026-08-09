export const CONFIG = {
  STRIPE: {
    PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.STRIPE_PUBLISHABLE_KEY ||
      "",
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  },
  R2: {
    ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
    SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
    ENDPOINT: process.env.R2_ENDPOINT || "",
    BUCKET_NAME: process.env.R2_BUCKET_NAME || "anime-voice-pack-bundle",
    FILE_KEY: process.env.R2_FILE_KEY || "Anime Voice Pack Mp3.zip",
  },
};
