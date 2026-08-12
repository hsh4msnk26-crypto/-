export type MealType = "rice" | "soup" | "side1" | "side2" | "side3";
export type MealItem = { type: MealType; name: string; imageUrl?: string; imageCandidates?: string[] };
export type MealTrayData = { id?: string; date: string; title: string; meals: MealItem[]; finalImageUrl?: string };
export const mealLabels: Record<MealType,string> = { rice:"밥",soup:"국",side1:"반찬 1",side2:"반찬 2",side3:"반찬 3" };
