import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Ma_Shan_Zheng, Noto_Sans_SC } from "next/font/google";
import { cn } from "@/lib/utils";

const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fuzz - AI 疗愈助手",
  description: "帮大学生用 3 分钟/天做情绪签到",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn(maShanZheng.variable, notoSansSC.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} antialiased`}
        style={{ fontFamily: "var(--font-body), 'Noto Sans SC', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
