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
        
        // 1行目をタイトル・画像、2行目以降を詳細として取得
        const row = json.table.rows[0];
        if (row) {
          allItems.push({
            name: row.c[1]?.v || sheet,
            // C列（インデックス2）に画像URLがある想定です
            image: row.c[2]?.v || null, 
            detail: json.table.rows.slice(1).map((r: any) => `${r.c[0]?.v || ""}: ${r.c[1]?.v || ""}`).join("\n\n")
          });
        }
      }
      setItems(allItems);
    };
    fetchData();
  }, []);

  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto">
        <button onClick={() => setSelected(null)} className="mb-4 text-orange-600 font-bold">← 一覧に戻る</button>
        <h2 className="text-3xl font-black mb-4">{selected.name}</h2>
        
        {/* 画像URLのデバッグ用表示 */}
        {selected.image ? (
            <img src={selected.image} className="w-full rounded-2xl mb-6 shadow-lg" alt="レシピ画像" />
        ) : (
            <div className="bg-gray-200 p-4 rounded-2xl mb-6 text-center text-gray-500">画像が設定されていません (URLを確認してください)</div>
        )}
        
        <div className="bg-orange-50 p-6 rounded-2xl whitespace-pre-line leading-relaxed">{selected.detail}</div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">クーロンヌ レシピ一覧</h1>
      <div className="grid gap-4">
        {items.map((item, i) => (
          <button key={i} onClick={() => setSelected(item)} className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4 w-full">
            {item.image ? (
                <img src={item.image} className="w-20 h-20 object-cover rounded-lg" alt="サムネイル" />
            ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
            )}
            <span className="font-bold text-lg">{item.name}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
