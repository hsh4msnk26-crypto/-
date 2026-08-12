export type OpenverseImage = {
  url: string;
  thumbnail: string;
  title: string;
  source: "openverse";
  creator?: string;
  license?: string;
  licenseUrl?: string;
  attribution?: string;
  landingUrl?: string;
};

type OpenverseResult = {
  url: string;
  thumbnail?: string;
  title?: string;
  creator?: string;
  license?: string;
  license_url?: string;
  attribution?: string;
  foreign_landing_url?: string;
};

const ENGLISH_FOOD_TERMS: Record<string, string> = {
  "미역국": "Korean seaweed soup",
  "배추김치": "Korean kimchi",
  "김치": "Korean kimchi",
  "볶음밥": "Korean fried rice",
  "잡채": "Korean japchae",
  "불고기": "Korean bulgogi",
  "비빔밥": "Korean bibimbap",
};

async function requestOpenverse(query: string) {
  const params = new URLSearchParams({
    q: query,
    page_size: "10",
    mature: "false",
    license_type: "commercial,modification",
    categories: "photograph",
  });
  const response = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { "User-Agent": "KindergartenMealTray/1.0" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error("무료 이미지 검색이 잠시 원활하지 않아요.");
  const data = (await response.json()) as { results?: OpenverseResult[] };
  return data.results ?? [];
}

export async function searchFoodImages(foodName: string): Promise<OpenverseImage[]> {
  const primary = await requestOpenverse(`${foodName} 음식`);
  const fallbackTerm = Object.entries(ENGLISH_FOOD_TERMS).find(([term]) => foodName.includes(term))?.[1];
  const fallback = primary.length >= 6 || !fallbackTerm ? [] : await requestOpenverse(fallbackTerm);
  const unique = new Map<string, OpenverseResult>();
  for (const image of [...primary, ...fallback]) if (image.url) unique.set(image.url, image);
  return [...unique.values()].slice(0, 6).map((image) => ({
    url: image.url,
    thumbnail: image.thumbnail ?? image.url,
    title: image.title ?? foodName,
    source: "openverse",
    creator: image.creator,
    license: image.license?.toUpperCase(),
    licenseUrl: image.license_url,
    attribution: image.attribution,
    landingUrl: image.foreign_landing_url,
  }));
}
