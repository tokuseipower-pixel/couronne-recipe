"use client";

import { useState, useEffect } from "react";

// スプレッドシートの公開URL
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQA3tul-PXLKjH3w0gyreesT2pP6G79CF9W94iwXiOz72ph_gHgU-oDgDgm-WtesE26CpWyhhXHUWv7/pub?gid=1632662789&single=true&output=csv";

// CSVを正確に読み解くツール
const parseCSV = (csv: string) => {
  const rows = [];
  let row = [];
  let currentString = "";
  let inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { currentString += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      row.push(currentString);
      currentString = "";
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      if (char === '\r') i++;
      row.push(currentString);
      rows.push(row);
      row = [];
      currentString = "";
    } else {
      currentString += char;
    }
  }
  if (currentString || row.length > 0) { row.push(currentString); rows.push(row); }
  return rows;
};

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        
        // G列(index 6)を画像、H列(index 7)を鉄則として読み込む
        const loadedRecipes = rows.slice(1).filter(r => r[0]).map(r => ({
          id: r[0],
          title: r[1],
          bread: r[2],
          imageMain: r[3],
          ingredients: r[4].split('\n'),
          steps: r[5].split('\n'),
          stepImages: r[6] ? r[6].split('\n') : [],
          rule: r[7]
        }));
        setRecipes(loadedRecipes);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="text-center mt-20 p-5 text-amber-600 font-bold">基準書を読み込み中...</div>;

  if (selectedId === null) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 font-sans shadow-lg">
        <div className="bg-amber-500 p-4 sticky top-0 z-10 shadow-md">
          <h1 className="text-white text-lg font-bold text-center">クーロンヌ レシピ基準書</h1>
          <input type="text" placeholder="🔍 検索..." className="w-full p-2 mt-2 rounded-lg text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {recipes.filter(r => r.title.includes(searchQuery)).map(r => (
            <div key={r.id} onClick={() => setSelectedId(r.id)} className="bg-white rounded-xl shadow-sm cursor-pointer overflow-hidden border border-gray-100">
              <div className="h-32 bg-gray-200"><img src={r.imageMain} className="w-full h-full object-cover" /></div>
              <p className="p-2 text-xs font-bold leading-tight">{r.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentRecipe = recipes.find(r => r.id === selectedId);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10 font-sans shadow-lg">
      <div className="bg-amber-500 p-3 sticky top-0 z-10 flex items-center">
        <button onClick={() => setSelectedId(null)} className="text-white font-bold text-sm">← 戻る</button>
        <p className="text-white text-sm font-bold ml-4 truncate">{currentRecipe.title}</p>
      </div>

      <img src={currentRecipe.imageMain} className="w-full h-64 object-cover" />

      <div className="p-5">
        <h2 className="text-md font-bold border-l-4 border-amber-500 pl-2 mb-3">ルセット（材料）</h2>
        <ul className="text-sm mb-6 text-gray-700">{currentRecipe.ingredients.map((ing, i) => <li key={i} className="py-1 border-b">{ing}</li>)}</ul>

        <h2 className="text-md font-bold border-l-4 border-amber-500 pl-2 mb-3">製造工程</h2>
        <div className="space-y-4">
          {currentRecipe.steps.map((step, i) => (
            <div key={i} className="border p-3 rounded-lg flex items-center gap-3">
              {currentRecipe.stepImages[i] ? (
                <img src={currentRecipe.stepImages[i]} className="w-16 h-16 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400">No Image</div>
              )}
              <p className="text-xs text-gray-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-900 text-white rounded-lg text-sm leading-relaxed">{currentRecipe.rule}</div>
      </div>
    </div>
  );
}