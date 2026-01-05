import { Metadata } from "next";
import TemplatesClient from "./client";

export const metadata: Metadata = {
  title: "Danh sách Templates - Gieo Duyên",
  description: "Chọn template để bắt đầu tạo thiệp mời của bạn",
};

export default function TemplatesPage() {
  return <TemplatesClient />;
}

