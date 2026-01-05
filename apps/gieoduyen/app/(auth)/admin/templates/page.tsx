import { Metadata } from "next";
import AdminTemplatesClient from "./client";

export const metadata: Metadata = {
  title: "Quản lý Templates - Admin",
};

export default async function AdminTemplatesPage() {
  return <AdminTemplatesClient />;
}

