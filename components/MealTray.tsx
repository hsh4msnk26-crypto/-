"use client";
import { forwardRef } from "react";
import type { MealItem,MealType } from "@/types/meal";
const slotClass:Record<MealType,string>={side1:"side side1",side2:"side side2",side3:"side side3",rice:"bowl rice",soup:"bowl soup"};
export const MealTray=forwardRef<HTMLDivElement,{date:string;title:string;meals:MealItem[];onPick?:(type:MealType)=>void}>(({date,title,meals,onPick},ref)=><div className="export-card" ref={ref}><header><span>{date.replaceAll("-",". ")}</span><h2>{title}</h2><small>오늘도 맛있게, 골고루!</small></header><div className="tray">{meals.map(meal=><button type="button" key={meal.type} className={slotClass[meal.type]} onClick={()=>onPick?.(meal.type)}>{meal.imageUrl?<img src={meal.imageUrl} alt={meal.name} crossOrigin="anonymous"/>:<span className="empty">사진을 선택해 주세요</span>}<strong>{meal.name||"메뉴 이름"}</strong></button>)}</div></div>);
MealTray.displayName="MealTray";
