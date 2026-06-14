"use client";
import { useEffect, useState } from "react";

// この1行が重要です：キャッシュを使わず毎回データを読み込ませます
export const dynamic = "force-dynamic";

export default function RecipePage() {
  const [data, setData] = useState<any[]>([]);
  const [activeSheet, setActiveSheet] = useState("フレンチトースト");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      // データのキャッシュを防ぐためタイムスタンプを付与
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(activeSheet)}&t=${Date.now()}`;
      const response = await fetch(url);
      const text = await response.text();
      const json = JSON.parse(text.substring(47, text.length - 2));

      const rows = json.table.rows.map((row: any) => ({
        name: row.c[0]?.v || "名称未設定",
        detail: row.c[1]?.v || "詳細なし",
        image: row.c[2]?.v || null
      }));
      setData(rows);
    };
    fetchData();
  }, [activeSheet]);

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-orange-900">クーロンヌ レシピ</h1>
      
      <div className="flex gap-2 mb-6">
        {["フレンチトースト", "オニキノ"].map((name) => (
          <button key={name} onClick={() => { setActiveSheet(name); setSelectedProduct(null); }}
            className={`flex-1 py-3 rounded-xl font-bold ${activeSheet === name ? "bg-orange-600 text-white" : "bg-white text-orange-600 border border-orange-600"}`}>
            {name}
          </button>
        ))}
      </div>

      {!selectedProduct ? (
        <div className="space-y-4">
          {data.map((item, index) => (
            <button key={index} onClick={() => setSelectedProduct(item)}
              className="w-full bg-white p-4 rounded-xl shadow border border-orange-100 flex items-center justify-between">
              <span className="font-bold text-orange-900">{item.name}</span>
              {item.image && <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200">
          <button onClick={() => setSelectedProduct(null)} className="mb-4 text-orange-600 font-bold">← 一覧に戻る</button>
          <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
          {selectedProduct.image && <img src={selectedProduct.image} className="w-full rounded-xl mb-4" />}
          <div className="whitespace-pre-line text-gray-700">{selectedProduct.detail}</div>
        </div>
      )}
    </main>
  );
}