"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));

        // A列(項目)が0番目、B列(内容)が1番目、C列(画像)が2番目
        const rows = json.table.rows.map((row: any) => ({
          label: row.c[0]?.v || "",
          value: row.c[1]?.v || "",
          image: row.c[2]?.v || null
        }));
        setData(rows);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-orange-900 border-b-2 border-orange-500 pb-2">クーロンヌ レシピ</h1>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-400">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">{item.label}</p>
                <p className="text-gray-800 whitespace-pre-line mt-1">{item.value}</p>
              </div>
              {item.image && (
                <img src={item.image} className="w-20 h-20 object-cover rounded-lg ml-3" />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}