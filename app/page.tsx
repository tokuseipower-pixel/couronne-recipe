"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [lang, setLang] = useState("JP"); // デフォルトは日本語

  // 言語ごとに読み込むシート名を設定
  const sheetMap: any = {
    "JP": "フレンチトースト",
    "ID": "フレンチトーストID"
  };

  useEffect(() => {
    const fetchData = async () => {
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheetMap[lang])}&t=${Date.now()}`;
      
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      
      setItems([{
        name: json.table.rows[0]?.c[1]?.v || "Recipe",
        image: json.table.rows[0]?.c[2]?.v || null,
        details: json.table.rows.map((r: any) => ({
          label: r.c[0]?.v || "",
          value: r.c[1]?.v || "",
          image: r.c[2]?.v || null
        }))
      }]);
    };
    fetchData();
  }, [lang]);

  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto bg-white min-h-screen text-black">
        <button onClick={() => setSelected(null)} className="mb-4 py-2 px-4 bg-gray-200 rounded-full font-bold">← 一覧に戻る</button>
        <h2 className="text-3xl font-black mb-6">{selected.name}</h2>
        {selected.image && <img src={selected.image} className="w-full rounded-2xl mb-6" alt="main" />}
        <div className="space-y-6 pb-10">
          {selected.details.map((d: any, i: number) => (
            <div key={i} className="border-b pb-4">
              <div className="text-xs font-bold text-orange-600 mb-1">{d.label}</div>
              <div className="text-lg font-semibold whitespace-pre-line">{d.value}</div>
              {d.image && <img src={d.image} className="w-full rounded-lg mt-2" alt="detail" />}
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-black mb-6">Couronne Recipe</h1>
      
      {/* 言語切り替えボタン */}
      <div className="flex gap-2 mb-8">
        {["JP", "ID"].map((l) => (
          <button key={l} onClick={() => setLang(l)} className={`py-2 px-6 rounded-full font-bold ${lang === l ? "bg-orange-500 text-white" : "bg-white shadow"}`}>
            {l === "JP" ? "日本語" : "Indonesia"}
          </button>
        ))}
      </div>

      {items.map((item, i) => (
        <button key={i} onClick={() => setSelected(item)} className="w-full bg-white p-4 rounded-2xl shadow flex gap-4 items-center">
          {item.image && <img src={item.image} className="w-20 h-20 rounded-lg object-cover" alt="thumb" />}
          <span className="font-bold text-xl">{item.name}</span>
        </button>
      ))}
    </main>
  );
}
