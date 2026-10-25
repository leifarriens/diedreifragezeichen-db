import "server-only";
import generatedAltTexts from "@ddfdb/meta-generation/generated/alt-text.json";

const altTextByFolgeId = new Map<number, string>(
  generatedAltTexts.map(({ alt, id }) => [id, alt] as const),
);

export function getGeneratedCoverAltText(folgeId: number): string | undefined {
  const alt = altTextByFolgeId.get(folgeId);

  return alt;
}
