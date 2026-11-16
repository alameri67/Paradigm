import type { Metadata } from "next";
import { PersonaCards } from "@/components/explore/persona-cards";
import { getInterviewCards, GROUPS } from "@/lib/interviews/data";

export const metadata: Metadata = { title: "Persona cards · AI Transition Simulator" };

export default async function ExplorePage() {
  const cards = await getInterviewCards();
  return <PersonaCards cards={cards} groups={GROUPS} />;
}
