import { Metadata } from "next";
import AdminTemplateEditorClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Chỉnh sửa Template - Admin`,
  };
}

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AdminTemplateEditorClient templateSlug={slug} />;
}

