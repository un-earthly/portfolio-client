import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with MD Alamin — Senior Full Stack Developer available for remote contracts. Book a call, or reach out via WhatsApp, Telegram, email, or LinkedIn.",
  alternates: { canonical: "https://alamin-md.xyz/contact" },
  openGraph: {
    title: "Contact | MD Alamin",
    description:
      "Book a call or message MD Alamin directly — available for remote full-stack development and technical consulting engagements.",
    url: "https://alamin-md.xyz/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
