import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";
import AuthProvider from "./providers/SessionProvider";
import AppVersion from "./Components/AppVersion";
const redHat = Red_Hat_Display({
  variable: "--font-red-hat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drive Ogan Ilir",
  description: "Drive Ogan Ilir",
  // favicon
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL('https://acme.com'),
  // open graph
  openGraph: {
    title: "Drive Ogan Ilir",
    description: "Drive Ogan Ilir",
    url: "https://drive.oganilir.go.id",
    siteName: "Drive Ogan Ilir",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id-ID",
    type: "website",
  },
  // twitter
  twitter: {
    card: "summary_large_image",
    title: "Drive Ogan Ilir",
    description: "Drive Ogan Ilir",
    images: ["/favicon.png"],
  },
  // verification
  verification: {
    google: "google-site-verification=5J1g4q9J8h8x8h8x8h8x8h8x8h8x8h8x8h8x",
    // add other verification methods here
  },
  // robots
  robots: {
    index: true,
    follow: true,
    noarchive: false,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${redHat.variable} antialiased`}
      >
        <div className="min-h-full">

          <AuthProvider>
            <Header />

            <main>
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>

              <AppVersion />
            </main>
          </AuthProvider>

        </div>
      </body>
    </html>
  );
}
