import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';

const catalogPath = new URL('../src/content/speciesCatalog.ts', import.meta.url);
const imagesPath = new URL('../src/content/speciesImages.ts', import.meta.url);
const thumbnailSize = 640;
const chunkSize = 10;

const catalogSource = await fs.readFile(catalogPath, 'utf8');
const species = [...catalogSource.matchAll(/createSpecies\(\s*'([^']+)'\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*'([^']+)'/g)].map(
  ([, id, scientificName]) => ({
    id,
    scientificName,
  }),
);

if (species.length === 0) {
  throw new Error('No species definitions found in src/content/speciesCatalog.ts.');
}

const queryWikipediaImages = (chunk) => {
  const titles = chunk.map((entry) => entry.scientificName).join('|');
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages' +
    `&piprop=thumbnail&pithumbsize=${thumbnailSize}&titles=${encodeURIComponent(titles)}`;
  const raw = execFileSync('curl', ['--ipv4', '--silent', '--show-error', '--max-time', '25', url], {
    encoding: 'utf8',
  });
  const payload = JSON.parse(raw);
  const redirects = new Map((payload.query?.redirects ?? []).map((entry) => [entry.from, entry.to]));
  const pages = Object.values(payload.query?.pages ?? {});
  const pagesByTitle = new Map(pages.map((page) => [page.title, page]));

  return chunk.map((entry) => {
    const resolvedTitle = redirects.get(entry.scientificName) ?? entry.scientificName;
    const page = pagesByTitle.get(resolvedTitle);
    const photoUrl = page?.thumbnail?.source ?? null;

    if (!page || !photoUrl) {
      throw new Error(`Missing thumbnail for ${entry.id} (${entry.scientificName}) via title "${resolvedTitle}".`);
    }

    return {
      ...entry,
      photoUrl,
    };
  });
};

const resolvedSpecies = [];
for (let index = 0; index < species.length; index += chunkSize) {
  resolvedSpecies.push(...queryWikipediaImages(species.slice(index, index + chunkSize)));
}

const output = `${[
  'export const speciesImageUrls: Record<string, string> = {',
  ...resolvedSpecies.map((entry) => `  '${entry.id}': '${entry.photoUrl}',`),
  '};',
  '',
].join('\n')}`;

await fs.writeFile(imagesPath, output);

console.log(`Updated ${resolvedSpecies.length} species image URLs.`);
