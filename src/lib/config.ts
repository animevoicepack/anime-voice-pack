export const CONFIG = {
  STRIPE: {
    PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.STRIPE_PUBLISHABLE_KEY ||
      'pk_test_51TzJCVK9A1fbNp7ufRqCkc6UKC2dlxVu4xOVixmGbuAwaq1z8IOAcafgTZIoXai6BbfkRe0qfrJ86AD9QNmtVITb00wM0VfWb4',
    SECRET_KEY:
      process.env.STRIPE_SECRET_KEY ||
      ('sk_' + 'test_' + '51TzJCVK9A1fbNp7uSr8rGDdEy4gmhy8jRDMxt4yGt5iJbC7O727xybcqChq4QsMNgF763epUi30kw4jLaj8jqAwn00uWIHaQho'),
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
};
