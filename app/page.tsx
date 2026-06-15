"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function RecipePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 読み込むシート名を指定
      const sheets = ["フレンチトースト", "オニキノ"];
      // 尚登さんのスプレッドシートID
      const sheetId = "1U5eHVz4763rZozqdEnymUSV9yZE3f4u3xjYht0kffVo";
      
      let allItems: any[] = [];
      for (const sheet of sheets) {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURI(sheet)}&t=${Date.now()}`;
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        
        // 1行目（インデックス0）をタイトルの行とする
        const firstRow = json.table.rows[0];
        if (firstRow) {
          allItems.push({
            name: firstRow.c[1]?.v || sheet,
            // C列(インデックス2)をメイン画像とする
            image: firstRow.c[2]?.v || null, 
            // 2行目以降を詳細データとして取得
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

  // --- 詳細画面 ---
  if (selected) {
    return (
      <main className="p-4 max-w-lg mx-auto bg-white min-h-screen text-black shadow-inner">
        {/* 戻るボタン */}
        <button 
          onClick={() => setSelected(null)} 
          className="mb-4 py-2 px-4 bg-orange-100 text-orange-700 rounded-full font-bold text-sm shadow-sm active:bg-orange-200 transition-all"
        >
          ← 一覧に戻る
        </button>

        {/* レシピ名 */}
        <h2 className="text-3xl font-black mb-6 border-l-8 border-orange-500 pl-4 leading-tight">
          {selected.name}
        </h2>
        
        {/* メイン画像（C列のURL） */}
        {selected.image && (
          <div className="mb-8">
            <img 
              src={selected.image} 
              className="w-full rounded-3xl shadow-xl object-cover max-h-80" 
              alt="メイン画像" 
            />
          </div>
        )}
        
        {/* 詳細データ（材料・工程など） */}
        <div className="space-y-8 pb-20">
          {selected.details.map((d: any, i: number) => (
            <div key={i} className="group">
              {/* 項目名（材料、工程など） */}
              <div className="text-xs font-bold text-orange-600 tracking-widest mb-2 px-1">
                {d.label}
              </div>
              
              {/* 値がURL（画像リンク）なら画像を表示、そうでなければテキストを表示 */}
              {d.value && typeof d.value === 'string' && (d.value.startsWith('http')) ? (
                <div className="mt-2">
                  <img 
                    src={d.value} 
                    className="w-full rounded-2xl shadow-md border border-gray-100" 
                    alt="工程画像" 
                    onError={(e) => {
                      // 画像として読み込めなかった場合はテキストとして表示する
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-2xl text-gray-800 font-medium text-lg whitespace-pre-line leading-relaxed shadow-sm border border-gray-100">
                  {d.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    );
  }

  // --- スタート画面（一覧） ---
  return (
    <main className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen text-black font-sans">
      <header className="py-8 px-2">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          クーロンヌ<br />
          <span className="text-orange-500 text-2xl">レシピマスター</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2 font-medium italic">COURONNE RECIPE APP</p>
      </header>

      <div className="grid gap-6">
        {items.map((item, i) => (
          <button 
            key={i} 
            onClick={() => setSelected(item)} 
            className="bg-white p-4 rounded-3xl shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-5 w-full text-left transition-all border border-gray-100"
          >
            {item.image ? (
              <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-inner">
                <img src={item.image} className="w-full h-full object-cover" alt="サムネイル" />
              </div>
            ) : (
              <div className="w-24 h-24 shrink-0 bg-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400">
                No Photo
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-tighter">Recipe</span>
              <span className="font-black text-xl text-gray-800 leading-tight">{item.name}</span>
            </div>
          </button>
        ))}
      </div>
      
      <footer className="mt-20 text-center text-gray-300 text-xs font-bold tracking-widest pb-10">
        &copy; 2026 COURONNE RECIPE SYSTEM
      </footer>
    </main>
  );
}
