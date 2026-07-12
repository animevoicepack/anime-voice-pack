export interface Policy {
  title: string;
  lastUpdated: string;
  content: string[];
}

export const policies: Record<string, Policy> = {
  terms: {
    title: "Terms of Service",
    lastUpdated: "July 11, 2026",
    content: [
      "Welcome to Anime Voice Pack Bundle. By purchasing and downloading our digital products, you agree to comply with and be bound by the following terms and conditions of use.",
      "1. Digital Licensing: Upon purchase, you are granted a non-exclusive, non-transferable, revocable license to use the voice samples for personal and commercial projects. This license is limited to soundboard setups, video editing, and content creation.",
      "2. Usage Restrictions: You are strictly prohibited from reselling, redistributing, sub-licensing, or sharing the raw audio files in any voice library, audio market, or public hosting site.",
      "3. Content Usage Ethics: You agree not to use these samples to generate audio content that violates copyright laws, is defamatory, hateful, or harmful to any individual or group.",
      "4. Intellectual Property: All character names, artwork posters, and trademarks are the property of their respective copyright owners. The voice samples provided are isolated files for educational, parody, content creation, and personal use under fair use principles.",
      "5. Limitations: In no event shall Anime Voice Pack Bundle or its founders be liable for any damages arising out of the use or inability to use the products."
    ]
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "July 11, 2026",
    content: [
      "We value your privacy and are committed to protecting your personal data.",
      "1. Information We Collect: We collect your email address when you initiate a purchase or request a download link. This email is strictly required to deliver the digital package and confirm your purchase.",
      "2. How We Use Your Data: Your email is used to generate a secure Cloudflare R2 download link, dispatch the download email via Resend, and create a customer record in our Supabase secure backend. We do not sell, rent, or lease our customer lists to third parties.",
      "3. Data Retention: Your transaction details and email address are stored securely in our database. You can request deletion of your record at any time by contacting our support team.",
      "4. Security Protocols: All API operations are isolated in server-side Next.js route environments. No sensitive API keys are exposed to the client-side browser.",
      "5. Third-Party Services: We partner with Stripe for secure payment processing. Stripe processes your credit card details securely on their servers. We do not store your financial payment credentials."
    ]
  },
  refund: {
    title: "Refund Policy",
    lastUpdated: "July 11, 2026",
    content: [
      "Please read this policy carefully before purchasing.",
      "Due to the digital nature of downloadable products, all sales are final. Products are strictly non-refundable once the download link has been generated, accessed, or delivered.",
      "Once you complete your payment, your unique secure download link is immediately generated and dispatched to your email address. Because you receive instant access to the digital assets upon completion of payment, we cannot offer refunds, returns, or cancellations under any circumstances.",
      "If you experience technical issues receiving the email or downloading the package, please contact our support team at animevoicepack1@gmail.com with your transaction details. We will ensure you receive access to your files promptly."
    ]
  }
};
