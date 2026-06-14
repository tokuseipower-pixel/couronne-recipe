"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [data, setData] = useState<any[]>([]);
  const [activeSheet, setActiveSheet] = useState("フレンチトースト"); // ここをシート名に合わせて変更
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // activeSheetの値を使って特定のシートを読み込む設定
        const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${activeSheet}`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));

        const rows = json.table.rows.map((row: any) => ({
          label: row.c[0]?.v || "",
          value: row.c[1]?.v || "",
          image: row.c[2]?.v || null
        }));
        setData(rows);
      } catch (e) { console.error("読み込みエラー", e); }
    };
    fetchData();
  }, [activeSheet]);

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-orange-900 border-b-2 border-orange-500 pb-2">クーロンヌ レシピ</h1>
      
      {/* 商品選択タブ */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["フレンチトースト", "オニキノ"].map((name) => (
          <button 
            key={name}
            onClick={() => setActiveSheet(name)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeSheet === name ? "bg-orange-500 text-white" : "bg-white text-orange-500 border border-orange-500"}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-4 font-bold text-orange-900 flex justify-between items-center"
            >
              {item.label}
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-orange-50 border-t border-orange-100">
                <p className="text-gray-800 whitespace-pre-line">{item.value}</p>
                {item.image && <img src={item.image} className="w-full mt-3 rounded-lg shadow-sm" />}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}