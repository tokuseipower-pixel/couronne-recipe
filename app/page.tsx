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

        // A列(項目)とB列(中身)をペアにするロジック
        const rows = json.table.rows.map((row: any) => ({
          title: row.c[1]?.v || "名称未設定",
          // ここでA列とB列の対応を詳細に作ります
          sections: [
            { label: "対象パン", value: row.c[2]?.v },
            { label: "材料", value: row.c[4]?.v },
            { label: "工程", value: row.c[5]?.v },
            { label: "鉄則", value: row.c[7]?.v },
          ],
          imageUrl: row.c[3]?.v || row.c[6]?.v // 商品画像または工程画像
        }));
        setData(rows);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-orange-900 border-b-2 border-orange-500 pb-2">クーロンヌ レシピ</h1>
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-400">
            <h2 className="text-2xl font-black text-orange-950 mb-4">{item.title}</h2>
            {item.imageUrl && <img src={item.imageUrl} className="w-full h-48 object-cover rounded-xl mb-4" />}
            
            <div className="space-y-4">
              {item.sections.map((sec: any, i: number) => (
                <div key={i} className="border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{sec.label}</span>
                  <p className="text-gray-800 whitespace-pre-line mt-1">{sec.value || "未入力"}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}