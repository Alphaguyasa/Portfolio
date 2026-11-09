import { STATUS_LABEL, type Project } from "@/lib/projects";

/**
 * What a project's Open Graph image shows. Only fields the project page itself shows,
 * so the card can never claim more than the page does.
 */
export type ProjectCard = { name: string; tagline: string; status: string; stack: string[] };

/** The default image font has no arrow glyph, and a missing glyph means a network fetch at render time. */
function cardText(text: string): string {
  return text.replace(/\s*→\s*/g, ": ");
}

export function projectCard(project: Project): ProjectCard {
  return {
    name: cardText(project.name),
    tagline: cardText(project.tagline),
    status: STATUS_LABEL[project.status],
    // Four chips fit on one line of the 1200px card.
    stack: project.stack.slice(0, 4).map(cardText),
  };
}

/** Longer names shrink so a two-word name and a long one both stay on the card. */
export function nameFontSize(name: string): number {
  if (name.length <= 12) return 112;
  if (name.length <= 24) return 84;
  return 64;
}
