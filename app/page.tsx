"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [lang, setLang] = useState("JP");

  useEffect(() => {
    const fetchData = async () => {
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      const sheetName = lang === "JP" ? "フレンチトースト" : "フレンチトーストID";
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheetName)}&t=${Date.now()}`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      
      setItems([{
        name: json.table.rows[0]?.c[1]?.v || "Recipe",
        details: json.table.rows.map((r: any) => ({
          label: r.c[0]?.v || "",
          value: r.c[1]?.v || "",
          rawImage: r.c[2]?.v // 【テスト用】生のURLデータをそのまま保持
        }))
      }]);
    };
    fetchData();
  }, [lang]);

  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto bg-white min-h-screen text-black">
        <button onClick={() => setSelected(null)} className="mb-4 py-2 px-6 bg-orange-500 text-white rounded-full font-bold">← 一覧に戻る</button>
        {selected.details.map((d: any, i: number) => (
          <div key={i} className="border-b pb-4 mb-4">
            <div className="text-xs font-bold text-orange-600">{d.label}</div>
            <div className="text-lg font-semibold whitespace-pre-line">{d.value}</div>
            {/* テスト表示：もしURLがあれば文字として表示して確認する */}
            <div className="text-[10px] text-gray-400 break-all">URL確認: {d.rawImage || "なし"}</div>
            {d.rawImage && <img src={d.rawImage} className="w-full mt-2 rounded" alt="test" />}
          </div>
        ))}
      </main>
    );
  }

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-black mb-6">クーロンヌのレシピ</h1>
      <div className="flex gap-2 mb-8">
        <button onClick={() => setLang("JP")} className="py-2 px-6 bg-orange-500 text-white rounded-full font-bold">日本語</button>
        <button onClick={() => setLang("ID")} className="py-2 px-6 bg-orange-500 text-white rounded-full font-bold">Indonesia</button>
      </div>
      {items.map((item, i) => (
        <button key={i} onClick={() => setSelected(item)} className="w-full bg-white p-4 rounded-2xl shadow mb-4">
          <span className="font-bold text-xl">{item.name}</span>
        </button>
      ))}
    </main>
  );
}
