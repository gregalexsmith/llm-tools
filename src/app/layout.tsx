import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "LLM Tools",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/logo192.png" />
      </Head>

      <ClerkProvider>
        <html lang="en">
          <body className={`font-sans ${inter.variable} flex h-full flex-col`}>
            <nav className="flex justify-center gap-4 pb-2 text-center">
              <Link href="/threads" className="pb-0">
                Threads
              </Link>
              <Link href="/agents" className="pb-0">
                Agents
              </Link>
              <Link href="/actions" className="pb-0">
                Actions
              </Link>
              <Link href="/settings" className="pb-0">
                Settings
              </Link>
            </nav>
            {children}
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
