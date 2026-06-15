"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [lang, setLang] = useState("JP");

  useEffect(() => {
    const fetchData = async () => {
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      // 日本語版は「フレンチトースト」、インドネシア語版は「フレンチトーストID」という名前か確認してください
      const sheetName = lang === "JP" ? "フレンチトースト" : "フレンチトーストID";
      
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheetName)}&t=${Date.now()}`;
      
      try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        
        if (json.table && json.table.rows) {
          setItems([{
            name: json.table.rows[0]?.c[1]?.v || "Recipe",
            details: json.table.rows.map((r: any) => ({
              label: r.c[0]?.v || "",
              value: r.c[1]?.v || "",
              // URL形式の文字列のみを画像として認識する
              image: (r.c[2]?.v && typeof r.c[2].v === 'string' && r.c[2].v.startsWith('http')) ? r.c[2].v : null
            }))
          }]);
        }
      } catch (e) {
        console.error("データ取得エラー:", e);
      }
    };
    fetchData();
  }, [lang]);

  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto bg-white min-h-screen text-black">
        <button onClick={() => setSelected(null)} className="mb-6 py-2 px-6 bg-orange-500 text-white rounded-full font-bold">← 一覧に戻る</button>
        <h2 className="text-3xl font-black mb-6">{selected.name}</h2>
        <div className="space-y-6 pb-20">
          {selected.details.map((d: any, i: number) => (
            <div key={i} className="border-b pb-4">
              {d.label && <div className="text-xs font-bold text-orange-600 mb-1">{d.label}</div>}
              {d.value && <div className="text-lg font-semibold whitespace-pre-line">{d.value}</div>}
              {d.image && <img src={d.image} className="w-full rounded-lg mt-4 shadow-md" alt="recipe" />}
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-black mb-6">クーロンヌのレシピ</h1>
      <div className="flex gap-2 mb-8">
        <button onClick={() => setLang("JP")} className={`py-2 px-6 rounded-full font-bold ${lang === "JP" ? "bg-orange-500 text-white" : "bg-white shadow"}`}>日本語</button>
        <button onClick={() => setLang("ID")} className={`py-2 px-6 rounded-full font-bold ${lang === "ID" ? "bg-orange-500 text-white" : "bg-white shadow"}`}>Indonesia</button>
      </div>
      {items.map((item, i) => (
        <button key={i} onClick={() => setSelected(item)} className="w-full bg-white p-4 rounded-2xl shadow flex gap-4 items-center">
          <span className="font-bold text-xl">{item.name}</span>
        </button>
      ))}
    </main>
  );
}
