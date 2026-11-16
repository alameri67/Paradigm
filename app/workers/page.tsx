import { redirect } from "next/navigation";

/** The worker view now lives at /details. */
export default function WorkersPage() {
  redirect("/details");
}
