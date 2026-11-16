import { redirect } from "next/navigation";

/** The worker layout now lives on the home page. */
export default function WorkersPage() {
  redirect("/");
}
