import type {Metadata} from "next";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

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
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
