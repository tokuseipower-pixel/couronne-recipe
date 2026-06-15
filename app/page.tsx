"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [lang, setLang] = useState("JP");

  useEffect(() => {
    const fetchData = async () => {
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      // シート名リスト
      const sheetName = lang === "JP" ? "フレンチトースト" : "フレンチトーストID";
      
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheetName)}&t=${Date.now()}`;
      
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      
      // 1行目をタイトル、以降を詳細として読み込む
      setItems([{
        name: json.table.rows[0]?.c[1]?.v || "Recipe",
        image: json.table.rows[0]?.c[2]?.v || null, // 1行目のC列はトップ画像
        details: json.table.rows.map((r: any) => ({
          label: r.c[0]?.v || "",
          value: r.c[1]?.v || "",
          image: r.c[2]?.v || null // 【ここ重要】全ての行のC列を個別に読み込む
        }))
      }]);
    };
    fetchData();
  }, [lang]);

  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto bg-white min-h-screen text-black">
        <button onClick={() => setSelected(null)} className="mb-6 py-2 px-6 bg-orange-500 text-white rounded-full font-bold">← 一覧に戻る</button>
        <h2 className="text-3xl font-black mb-6">{selected.name}</h2>
        {/* 全詳細を表示 */}
        <div className="space-y-6 pb-20">
          {selected.details.map((d: any, i: number) => (
            <div key={i} className="border-b pb-4">
              <div className="text-xs font-bold text-orange-600 mb-1">{d.label}</div>
              <div className="text-lg font-semibold whitespace-pre-line">{d.value}</div>
              {/* 各行の画像が表示されます */}
              {d.image && <img src={d.image} className="w-full rounded-lg mt-2" alt="detail" />}
            </div>
          ))}
        </div>
      </main>
    );
  }

  // ... (以下、一覧画面の構成はそのまま)
  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-black mb-6">クーロンヌのレシピ</h1>
      <div className="flex gap-2 mb-8">
        <button onClick={() => setLang("JP")} className={`py-2 px-6 rounded-full font-bold ${lang === "JP" ? "bg-orange-500 text-white" : "bg-white shadow"}`}>日本語</button>
        <button onClick={() => setLang("ID")} className={`py-2 px-6 rounded-full font-bold ${lang === "ID" ? "bg-orange-500 text-white" : "bg-white shadow"}`}>Indonesia</button>
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
