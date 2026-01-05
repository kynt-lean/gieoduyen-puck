import { Metadata } from "next";
import Landing from "./_landing";

export const metadata: Metadata = {
  title: "Gieo Duyên - Wedding / Invitation / Event",
  description: "Tạo thiệp mời cưới, thiệp mời sự kiện đẹp mắt với Gieo Duyên",
};

export default function HomePage() {
  return <Landing />;
}
