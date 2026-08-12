"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ImagePlus, Search, X } from "lucide-react";

type ImageCandidate = { url:string; thumbnail:string; source:string; creator?:string; license?:string; licenseUrl?:string; attribution?:string; landingUrl?:string };

export default function ImageSearchModal({foodName,open,onClose,onSelect}:{foodName:string;open:boolean;onClose:()=>void;onSelect:(url:string,metadata:string)=>void}) {
  const [images,setImages]=useState<ImageCandidate[]>([]); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function search(){setLoading(true);setError("");try{const response=await fetch("/api/images/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({foodName})});const data=await response.json();if(!response.ok)throw new Error(data.error);setImages(data.images)}catch(caught){setError(caught instanceof Error?caught.message:"사진 검색에 실패했어요.")}finally{setLoading(false)}}
  useEffect(()=>{if(open&&foodName)void search()},[open,foodName]);
  async function upload(file?:File){if(!file)return;setLoading(true);const form=new FormData();form.append("file",file);const response=await fetch("/api/upload",{method:"POST",body:form});const data=await response.json();setLoading(false);if(response.ok)onSelect(data.url,JSON.stringify({source:"upload"}));else setError(data.error)}
  if(!open)return null;
  return <div className="modal-backdrop" onMouseDown={event=>event.target===event.currentTarget&&onClose()}><section className="modal" role="dialog" aria-modal="true" aria-label={`${foodName} 사진 선택`}><div className="modal-head"><div><p className="eyebrow">무료 사진 고르기</p><h3>{foodName}</h3></div><button onClick={onClose} aria-label="닫기"><X/></button></div><div className="modal-actions"><button className="secondary" onClick={search}><Search size={17}/> 다른 사진 검색</button><label className="secondary"><ImagePlus size={17}/> 직접 사진 업로드<input type="file" accept="image/*" hidden onChange={event=>upload(event.target.files?.[0])}/></label></div><p className="license-note">Openverse의 상업적 이용·수정 가능한 공개 라이선스 사진만 보여드려요.</p>{loading?<div className="loading">사용 가능한 무료 사진을 찾는 중...</div>:null}{error?<p className="error">{error}</p>:null}<div className="image-grid">{images.map((image,index)=><article className="image-option" key={image.url+index}><button onClick={()=>onSelect(image.url,JSON.stringify(image))}><img src={image.thumbnail} alt={`${foodName} 후보 ${index+1}`}/><span>이 사진 선택</span></button><div className="image-credit"><b>{image.license??"공개 라이선스"}</b><span>{image.creator??"작가 정보 없음"}</span>{image.landingUrl?<a href={image.landingUrl} target="_blank" rel="noreferrer">출처 <ExternalLink size={11}/></a>:null}</div></article>)}</div></section></div>
}
