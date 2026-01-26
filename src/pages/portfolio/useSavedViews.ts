import { useEffect, useState } from "react";

export type SavedView = { id: string; name: string; query: string; includeInactive?: boolean; cols?: Record<string,boolean> };
const KEY = "ecc.properties.savedViews";

export function useSavedViews(){
  const [views, setViews] = useState<SavedView[]>([]);
  useEffect(()=>{ try { setViews(JSON.parse(localStorage.getItem(KEY)||"[]")); } catch{} },[]);
  const save = (v: SavedView) => {
    const arr = [...views.filter(x=>x.id!==v.id), v];
    setViews(arr);
    localStorage.setItem(KEY, JSON.stringify(arr));
  };
  const remove = (id: string) => {
    const arr = views.filter(x=>x.id!==id);
    setViews(arr);
    localStorage.setItem(KEY, JSON.stringify(arr));
  };
  return { views, save, remove };
}