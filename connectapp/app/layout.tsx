import type { Metadata } from "next";
import { Geist, Geist_Mono, Inconsolata } from "next/font/google";
import "./globals.css";

// components 
import Bar from "@/navBar/bar";
import Footer from "@/footer/footer";
import {ContextWrap} from "@/notifications/Provider";
import { Toaster, toast } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "connect 4 🕹️",
  description: "a very fun connect 4 game to play with your friends!",
};

// the whole app :
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inconsolata.className} ${/*geistMono.variable*/ ""} antialiased h-screen`}
      >
        <Toaster position="top-center"/>       
        <ContextWrap>
          <Bar></Bar>
          {children}
          <Footer></Footer>
        </ContextWrap>
      </body>
    </html>
  );
}
