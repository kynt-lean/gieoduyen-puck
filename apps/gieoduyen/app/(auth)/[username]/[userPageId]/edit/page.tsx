import { Metadata } from "next";
import Client from "../_components/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; userPageId: string }>;
}): Promise<Metadata> {
  const { username, userPageId } = await params;

  return {
    title: `Chỉnh sửa trang của ${username} - Gieo Duyên`,
  };
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ username: string; userPageId: string }>;
}) {
  const { username, userPageId } = await params;

  return <Client username={username} userPageId={userPageId} isEdit={true} />;
}

export const dynamic = "force-dynamic";

