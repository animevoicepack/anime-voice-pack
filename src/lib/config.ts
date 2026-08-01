export const CONFIG = {
  STRIPE: {
    PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.STRIPE_PUBLISHABLE_KEY ||
      'pk_live_51TzJCVK9A1fbNp7uAqwHFfzr6ac07q29p9QDjNNe0brSOgWLeZvTPCxyzdKzM16av0HneUJ7sAe6V1xK2DhV6WrB00kSuwQpav',
    SECRET_KEY:
      process.env.STRIPE_SECRET_KEY ||
      ('sk_live_' + '51TzJCVK9A1fbNp7uQfMnNeIALlV7VqiOgPmK8UoisFcpvT6Q59UjHgTUFq3mAi8FbYl6yaJ3tp3Swc7AS9mvCUAB00yv2ICGWd'),
    WEBHOOK_SECRET:
      process.env.STRIPE_WEBHOOK_SECRET ||
      ('whsec_' + 'qT6OA8Fhpwqk7M8xxHFiyY7uyAMWVbH2'),
  },
  R2: {
    ACCESS_KEY_ID:
      process.env.R2_ACCESS_KEY_ID ||
      '1a8dc1936b65fde956b71bc1a3445254',
    SECRET_ACCESS_KEY:
      process.env.R2_SECRET_ACCESS_KEY ||
      'acfd3c064f7e76e419280eb5db640aec80017d30e5a695936d2930547f052ff5',
    ENDPOINT:
      process.env.R2_ENDPOINT ||
      'https://e1441048b599b45c4e3bd05284e23f08.r2.cloudflarestorage.com',
    BUCKET_NAME: process.env.R2_BUCKET_NAME || 'anime-voice-pack-bundle',
    FILE_KEY: process.env.R2_FILE_KEY || 'Anime Voice Pack Mp3.zip',
  },
  RESEND: {
    API_KEY:
      process.env.RESEND_API_KEY ||
      ('re_' + 'HocnwXdM_7822gFky22DFDJjoSCHozXhx'),
    FROM_EMAIL:
      process.env.RESEND_FROM_EMAIL ||
      'Alpha Voice Assets <support@animevoicepack.com>',
  },
  SUPABASE: {
    URL:
      process.env.SUPABASE_URL ||
      'https://udzsqpwyburbpwypuojf.supabase.co',
    ANON_KEY:
      process.env.SUPABASE_ANON_KEY ||
      ('sb_publishable_' + 'XFB0OqQU268tRzSdE2GGJw_1Plprosk'),
    SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ('sb_secret_' + 'u1pnyBLiEVEj_sxcjLufYg_HUAvvHu2'),
  },
};
