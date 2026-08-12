import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { searchFoodImages } from "@/lib/image-search/openverse";

export async function POST(request: Request) {
  try {
    const { foodName } = await request.json();
    if (!foodName?.trim()) return NextResponse.json({ error: "음식 이름을 입력해 주세요." }, { status: 400 });
    const supabase = createAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("food_images")
        .select("image_url,source,creator,license,license_url,attribution,landing_url")
        .eq("food_name", foodName.trim())
        .order("is_selected", { ascending: false })
        .limit(6);
      if (data?.length) return NextResponse.json({
        cached: true,
        images: data.map((image) => ({
          url: image.image_url, thumbnail: image.image_url, title: foodName,
          source: image.source, creator: image.creator, license: image.license,
          licenseUrl: image.license_url, attribution: image.attribution, landingUrl: image.landing_url,
        })),
      });
    }
    const images = await searchFoodImages(foodName.trim());
    if (!images.length) return NextResponse.json({ error: "사용 가능한 무료 사진을 찾지 못했어요. 직접 찍은 사진을 올려 주세요." }, { status: 404 });
    return NextResponse.json({ cached: false, images });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "이미지를 찾지 못했어요." }, { status: 500 });
  }
}
