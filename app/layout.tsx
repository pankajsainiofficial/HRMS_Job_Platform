import type { Metadata } from "next";
import { ReduxProvider } from "./_redux/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireOnDeck Jobs Dashboard",
  description:
    "A responsive jobs page and job detail modal for HireOnDeck.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
