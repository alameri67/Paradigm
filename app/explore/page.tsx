import type { Metadata } from "next";
import { PersonaCards } from "@/components/explore/persona-cards";
import { getInterviewCards, GROUPS } from "@/lib/interviews/data";

export const metadata: Metadata = { title: "Persona cards · Paradigm" };

export default async function ExplorePage() {
  const cards = await getInterviewCards();
  return <PersonaCards cards={cards} groups={GROUPS} />;
}
