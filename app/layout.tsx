import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {ThemeProvider} from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "跨境服务平台",
  description:
    "TikTok Shop跨境电商服务平台，覆盖美国、日本、英国、欧盟十二国、东南亚、墨西哥等站点，提供邀请码代申请、店铺代入驻、本土/跨境类目报白等服务，流程规范，资料真实有效。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1 relative">{children}</main>

          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
