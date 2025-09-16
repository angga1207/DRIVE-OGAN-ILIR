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
    index: false,
    follow: false,
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
        className={`${redHat.variable} antialiased`}>
        <div
          className="min-h-full">

          <AuthProvider>
            <Header />

            <main>
              <div className="mx-auto">
                {children}
              </div>

              <AppVersion />


              <div className="fixed bottom-2 right-2">
                <div className="hidden sm:block text-center text-[10px] text-gray-500">
                  © 2023 - {new Date().getFullYear()} Diskominfo Ogan Ilir. All rights reserved.
                </div>
              </div>
            </main>
          </AuthProvider>

        </div>
      </body>
    </html>
  );
}
