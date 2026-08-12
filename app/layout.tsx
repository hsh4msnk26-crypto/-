import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"한끼 반짝 | 유치원 급식 이미지 메이커",description:"메뉴를 입력하면 실제 식판 같은 급식 이미지를 만들어 드려요."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
