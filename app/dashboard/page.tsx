import { redirect } from "next/navigation";

/** The summary is now the home page. */
export default function DashboardPage() {
  redirect("/");
}
