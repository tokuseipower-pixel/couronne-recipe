"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const sheets = ["フレンチトースト", "オニキノ"];
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      
      let allItems: any[] = [];
      for (const sheet of sheets) {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheet)}&t=${Date.now()}`;
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        
        // シート全体からデータを読み込む
        allItems.push({
          name: json.table.rows[0]?.c[1]?.v || sheet,
          image: json.table.rows[0]?.c[2]?.v || null, // 1行目のC列をメイン画像
          details: json.table.rows.map((r: any) => ({
            label: r.c[0]?.v || "",
            value: r.c[1]?.v || "",
            image: r.c[2]?.v || null // 各行のC列に画像があれば詳細画像として使う
          }))
        });
      }
      setItems(allItems);
    };
    fetchData();
  }, []);

  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto bg-white min-h-screen text-black">
        <button onClick={() => setSelected(null)} className="mb-6 py-2 px-6 bg-orange-500 text-white rounded-full font-bold">← 一覧に戻る</button>
        <h2 className="text-3xl font-black mb-6">{selected.name}</h2>
        {selected.image && <img src={selected.image} className="w-full rounded-2xl mb-8" alt="main" />}
        <div className="space-y-6">
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
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6">クーロンヌ レシピ一覧</h1>
      {items.map((item, i) => (
        <button key={i} onClick={() => setSelected(item)} className="w-full bg-white p-4 rounded-2xl shadow mb-4 flex gap-4 items-center">
          {item.image && <img src={item.image} className="w-20 h-20 rounded-lg object-cover" alt="thumb" />}
          <span className="font-bold text-xl">{item.name}</span>
        </button>
      ))}
    </main>
  );
}
