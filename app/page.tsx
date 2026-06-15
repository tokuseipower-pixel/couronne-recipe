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
        
        const row = json.table.rows[0];
        if (row) {
          allItems.push({
            name: row.c[1]?.v || sheet,
            image: row.c[2]?.v || null,
            // ここで詳細部分を「ラベル：内容」という形で整理します
            details: json.table.rows.slice(1).map((r: any) => ({
              label: r.c[0]?.v || "",
              value: r.c[1]?.v || ""
            }))
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
        {selected.image && <img src={selected.image} className="w-full rounded-2xl mb-6 shadow-md" />}
        
        {/* ここで情報を「ラベル」と「内容」で区切って表示します */}
        <div className="space-y-4">
          {selected.details.map((d: any, i: number) => (
            <div key={i} className="border-b pb-2">
              <div className="text-xs font-bold text-orange-600 uppercase">{d.label}</div>
              <div className="text-gray-800 font-medium whitespace-pre-line">{d.value}</div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">クーロンヌ レシピ一覧</h1>
      <div className="grid gap-4">
        {items.map((item, i) => (
          <button key={i} onClick={() => setSelected(item)} className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4 w-full text-left">
            {item.image && <img src={item.image} className="w-20 h-20 object-cover rounded-lg" />}
            <span className="font-bold text-lg">{item.name}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
