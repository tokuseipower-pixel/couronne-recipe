"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [lang, setLang] = useState("JP");

  useEffect(() => {
    const fetchData = async () => {
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      // シート名を正確に定義
      const sheetName = lang === "JP" ? "フレンチトースト" : "フレンチトーストID";
      
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheetName)}&t=${Date.now()}`;
      
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      
      // データがある場合のみセットする
      if (json.table && json.table.rows) {
        setItems([{
          name: json.table.rows[0]?.c[1]?.v || "Recipe",
          image: json.table.rows[0]?.c[2]?.v || null,
          details: json.table.rows.map((r: any) => ({
            label: r.c[0]?.v || "",
            value: r.c[1]?.v || "",
            image: (r.c[2]?.v && typeof r.c[2].v === 'string' && r.c[2].v.startsWith('http')) ? r.c[2].v : null
          }))
        }]);
      }
    };
    fetchData();
  }, [lang]); // langが変わるたびに再読み込みする

  // ... (以下、表示部分は以前のコードと同じです)
