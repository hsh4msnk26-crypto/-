import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const image = await request.json();
    let metadata: Record<string, string | undefined> = image;
    if (typeof image.source === "string" && image.source.startsWith("{")) {
      try { metadata = { ...image, ...JSON.parse(image.source) }; } catch { metadata = image; }
    }
    const db = createAdminClient();
    if (!db) return NextResponse.json({ saved: false });
    await db.from("food_images").update({ is_selected: false }).eq("food_name", image.foodName);
    const { error } = await db.from("food_images").upsert({
      food_name: image.foodName, image_url: image.imageUrl, source: metadata.source ?? "openverse",
      creator: metadata.creator, license: metadata.license, license_url: metadata.licenseUrl,
      attribution: metadata.attribution, landing_url: metadata.landingUrl, is_selected: true,
    }, { onConflict: "food_name,image_url" });
    if (error) throw error;
    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "선택 저장에 실패했어요." }, { status: 500 });
  }
}
