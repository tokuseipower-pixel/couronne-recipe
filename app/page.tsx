"use client";
import { useEffect, useState } from "react";

export default function RecipePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // スプレッドシートを読み込む関数
    const fetchData = async () => {
      try {
        // 尚登さんのスプレッドシートIDをここに指定
        const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
        // 公開されたCSV形式で取得（シート名はURLのgidで指定可能ですが、まずはデフォルトで）
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
        
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        
        // シートのデータを読み込んで整形
        const rows = json.table.rows.map((row: any) => ({
          recipeName: row.c[1]?.v || "名称未設定",
          targetBread: row.c[2]?.v || "-",
          imageUrl: row.c[3]?.v || null, // C列(3番目)を画像URLとして使用
          details: `材料: ${row.c[4]?.v || ""}\n\n工程: ${row.c[5]?.v || ""}\n\n鉄則: ${row.c[7]?.v || ""}`
        }));
        
        setData(rows);
        setLoading(false);
      } catch (error) {
        console.error("データの読み込みに失敗しました", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <main className="p-4 text-center">読み込み中...</main>;

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">クーロンヌ レシピ一覧</h1>
      
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-xl font-bold mb-2">{item.recipeName}</h2>
            
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2 font-semibold">パン: {item.targetBread}</p>
                <div className="text-sm whitespace-pre-line text-gray-800">{item.details}</div>
              </div>
              
              {/* C列の画像URLがある場合のみ表示 */}
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.recipeName} 
                  className="w-24 h-24 object-cover rounded-md shadow-sm"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}