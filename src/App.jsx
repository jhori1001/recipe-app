import { useState } from "react";

const seasons = {
  spring: [
    { name: "たけのこ", nutrition: "食物繊維・カリウム豊富", benefit: "腸活・むくみ解消" },
    { name: "アスパラガス", nutrition: "葉酸・ビタミンE豊富", benefit: "疲労回復・抗酸化" },
    { name: "春キャベツ", nutrition: "ビタミンC・K豊富", benefit: "免疫力アップ・骨強化" },
    { name: "新玉ねぎ", nutrition: "硫化アリル・ビタミンB1", benefit: "血液サラサラ・疲労回復" },
    { name: "菜の花", nutrition: "鉄分・葉酸・ビタミンC", benefit: "貧血予防・美肌効果" },
  ],
  summer: [
    { name: "トマト", nutrition: "リコピン・ビタミンC", benefit: "抗酸化・美肌" },
    { name: "きゅうり", nutrition: "カリウム・水分", benefit: "むくみ解消・熱中症予防" },
    { name: "ナス", nutrition: "ナスニン・カリウム", benefit: "抗酸化・血圧低下" },
    { name: "ピーマン", nutrition: "ビタミンC・P豊富", benefit: "免疫力アップ・毛細血管強化" },
    { name: "とうもろこし", nutrition: "食物繊維・ビタミンB群", benefit: "腸活・エネルギー補給" },
  ],
  autumn: [
    { name: "さつまいも", nutrition: "食物繊維・ビタミンC", benefit: "腸活・免疫力アップ" },
    { name: "きのこ", nutrition: "ビタミンD・食物繊維", benefit: "骨強化・免疫力アップ" },
    { name: "れんこん", nutrition: "ビタミンC・食物繊維", benefit: "免疫力アップ・腸活" },
    { name: "かぼちゃ", nutrition: "β-カロテン・ビタミンE", benefit: "抗酸化・免疫力アップ" },
    { name: "栗", nutrition: "ビタミンB1・C・食物繊維", benefit: "疲労回復・腸活" },
  ],
  winter: [
    { name: "白菜", nutrition: "ビタミンC・カリウム", benefit: "免疫力アップ・むくみ解消" },
    { name: "大根", nutrition: "消化酵素・ビタミンC", benefit: "消化促進・免疫力アップ" },
    { name: "ほうれん草", nutrition: "鉄分・葉酸・ビタミンK", benefit: "貧血予防・骨強化" },
    { name: "ブロッコリー", nutrition: "ビタミンC・スルフォラファン", benefit: "抗酸化・解毒作用" },
    { name: "ごぼう", nutrition: "食物繊維・イヌリン", benefit: "腸活・血糖値安定" },
  ],
};

const seasonRecipes = {
  たけのこ: [
    {
      name: "たけのこご飯",
      time: "40分", cal: 320,
      ingredients: [
        { name: "たけのこ（水煮）", amount: "150g", note: "薄切り" },
        { name: "米", amount: "2合", note: "洗って30分浸水" },
        { name: "醤油", amount: "大さじ2" },
        { name: "みりん", amount: "大さじ1" },
        { name: "だし", amount: "360ml" },
      ],
      steps: ["米をだしで炊く", "たけのこを薄切りにし醤油・みりんで下味", "炊き上がりに混ぜる"],
      storage: { method: "冷蔵", days: 2 },
    },
    {
      name: "たけのこの煮物",
      time: "25分", cal: 120,
      ingredients: [
        { name: "たけのこ（水煮）", amount: "200g", note: "乱切り" },
        { name: "醤油", amount: "大さじ2" },
        { name: "みりん", amount: "大さじ2" },
        { name: "砂糖", amount: "大さじ1" },
        { name: "だし", amount: "200ml" },
      ],
      steps: ["だし・調味料を煮立てる", "たけのこを乱切りにして加える", "中火で15分煮る"],
      storage: { method: "冷蔵", days: 3 },
    },
  ],
  アスパラガス: [
    {
      name: "アスパラのベーコン巻き",
      time: "15分", cal: 180,
      ingredients: [
        { name: "アスパラガス", amount: "6本", note: "根元を切る" },
        { name: "ベーコン", amount: "6枚" },
        { name: "塩こしょう", amount: "少々" },
        { name: "オリーブ油", amount: "小さじ1" },
      ],
      steps: ["アスパラにベーコンを巻く", "フライパンで転がしながら焼く（5分）", "塩こしょうで味付け"],
      storage: { method: "冷蔵", days: 2 },
    },
  ],
  春キャベツ: [
    {
      name: "春キャベツの塩昆布あえ",
      time: "10分", cal: 80,
      ingredients: [
        { name: "春キャベツ", amount: "200g", note: "手でちぎる" },
        { name: "塩昆布", amount: "10g" },
        { name: "ごま油", amount: "小さじ1" },
        { name: "白ごま", amount: "少々" },
      ],
      steps: ["キャベツを手でちぎり塩もみ（5分）", "水気を絞る", "塩昆布・ごま油で和える"],
      storage: { method: "冷蔵", days: 1 },
    },
  ],
};

const recipeDB = {
  diet: [
    {
      name: "蒸し鶏のサラダ", time: "20分", cal: 210,
      ingredients: [
        { name: "鶏むね肉", amount: "200g", note: "そぎ切り" },
        { name: "レタス", amount: "100g", note: "手でちぎる" },
        { name: "きゅうり", amount: "1本（100g）", note: "薄切り" },
        { name: "ポン酢", amount: "大さじ2" },
      ],
      steps: ["鶏むね肉をそぎ切りにして酒をふる", "電子レンジ600Wで3分加熱", "野菜と盛り付けてポン酢をかける"],
      storage: { method: "冷蔵", days: 2 },
      flavor: { light: "ポン酢でさっぱり", normal: "ごまダレ", rich: "濃厚マヨネーズ" },
    },
    {
      name: "もやしの野菜炒め", time: "10分", cal: 145,
      ingredients: [
        { name: "もやし", amount: "200g" },
        { name: "ピーマン", amount: "2個（80g）", note: "細切り" },
        { name: "豚薄切り肉", amount: "100g", note: "3cm幅に切る" },
        { name: "醤油", amount: "大さじ1" },
        { name: "みりん", amount: "大さじ1" },
      ],
      steps: ["フライパンを熱し豚肉を炒める（3分）", "ピーマン・もやしを加えて炒める（3分）", "醤油・みりんで味付け"],
      storage: { method: "冷蔵", days: 1 },
      flavor: { light: "塩こしょう", normal: "醤油・みりん", rich: "オイスターソース" },
    },
  ],
  nutrition: [
    {
      name: "彩り野菜の豚汁", time: "30分", cal: 280,
      ingredients: [
        { name: "大根", amount: "100g", note: "いちょう切り" },
        { name: "にんじん", amount: "50g", note: "いちょう切り" },
        { name: "豚バラ肉", amount: "100g", note: "3cm幅に切る" },
        { name: "豆腐", amount: "150g", note: "さいの目切り" },
        { name: "味噌", amount: "大さじ2" },
        { name: "だし", amount: "600ml" },
      ],
      steps: ["だしを煮立て豚肉・根菜を加える（10分）", "豆腐を加えて煮る（5分）", "火を止めて味噌を溶く"],
      storage: { method: "冷蔵", days: 3 },
      flavor: { light: "白味噌", normal: "合わせ味噌", rich: "赤味噌" },
    },
    {
      name: "鶏と根菜の煮物", time: "40分", cal: 320,
      ingredients: [
        { name: "鶏むね肉", amount: "200g", note: "ひと口大に切る" },
        { name: "れんこん", amount: "150g", note: "5mm厚さの半月切り" },
        { name: "にんじん", amount: "100g", note: "乱切り" },
        { name: "こんにゃく", amount: "100g", note: "手でちぎる" },
        { name: "醤油", amount: "大さじ3" },
        { name: "みりん", amount: "大さじ3" },
        { name: "砂糖", amount: "大さじ1" },
      ],
      steps: ["鶏肉・野菜を切る", "鍋に材料と調味料を入れ煮立てる", "落し蓋をして中火で20分煮る"],
      storage: { method: "冷蔵", days: 3 },
      flavor: { light: "薄口醤油", normal: "醤油・みりん", rich: "甘辛煮" },
    },
  ],
  budget: [
    {
      name: "もやしと卵の炒め物", time: "8分", cal: 195,
      ingredients: [
        { name: "もやし", amount: "200g" },
        { name: "卵", amount: "2個（100g）", note: "溶いておく" },
        { name: "ネギ", amount: "1/2本（50g）", note: "小口切り" },
        { name: "醤油", amount: "大さじ1" },
        { name: "ごま油", amount: "小さじ1" },
      ],
      steps: ["卵を溶きフライパンで炒めて取り出す", "もやし・ネギを炒める（3分）", "卵を戻して醤油・ごま油で味付け"],
      storage: { method: "当日中", days: 0 },
      flavor: { light: "塩・こしょう", normal: "醤油・ごま油", rich: "オイスターソース" },
    },
    {
      name: "豆腐の麻婆豆腐", time: "15分", cal: 240,
      ingredients: [
        { name: "豆腐", amount: "300g", note: "さいの目切り" },
        { name: "豚ひき肉", amount: "100g" },
        { name: "ネギ", amount: "1/2本（50g）", note: "みじん切り" },
        { name: "にんにく", amount: "1片（5g）", note: "みじん切り" },
        { name: "豆板醤", amount: "小さじ1" },
        { name: "醤油", amount: "大さじ1" },
        { name: "水溶き片栗粉", amount: "大さじ1" },
      ],
      steps: ["ひき肉・にんにく・豆板醤を炒める（3分）", "豆腐・水100mlを加えて煮る（5分）", "水溶き片栗粉でとろみをつける"],
      storage: { method: "冷蔵", days: 2 },
      flavor: { light: "塩麻婆", normal: "豆板醤少なめ", rich: "本格辛口" },
    },
  ],
  easy: [
    {
      name: "レンチン茶碗蒸し", time: "5分", cal: 120,
      ingredients: [
        { name: "卵", amount: "2個（100g）", note: "溶いておく" },
        { name: "だし", amount: "200ml" },
        { name: "醤油", amount: "小さじ1" },
        { name: "みつば", amount: "少々", note: "ざく切り" },
      ],
      steps: ["卵・だし・醤油を混ぜて濾す", "容器に入れてラップをふんわりかける", "600Wで2分、様子を見ながら加熱"],
      storage: { method: "冷蔵", days: 1 },
      flavor: { light: "薄味だし", normal: "標準", rich: "濃いめだし" },
    },
    {
      name: "豆腐チャンプルー", time: "12分", cal: 265,
      ingredients: [
        { name: "豆腐", amount: "300g", note: "水切りしてひと口大" },
        { name: "卵", amount: "2個（100g）", note: "溶いておく" },
        { name: "もやし", amount: "100g" },
        { name: "ハム", amount: "60g", note: "短冊切り" },
        { name: "醤油", amount: "大さじ1" },
        { name: "塩こしょう", amount: "少々" },
      ],
      steps: ["豆腐を水切りしてひと口大に切る", "フライパンで豆腐を焼き色つくまで炒める（4分）", "ハム・もやし・卵を加えて炒め調味"],
      storage: { method: "当日中", days: 0 },
      flavor: { light: "塩こしょう", normal: "醤油・塩", rich: "ソース・醤油" },
    },
  ],
};

export default function RecipeApp() {
  const [tab, setTab] = useState("home");
  const [goal, setGoal] = useState("nutrition");
  const [flavor, setFlavor] = useState("normal");
  const [plan, setPlan] = useState("daily");
  const [ingredientInput, setIngredientInput] = useState("");
  const [pantry, setPantry] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSeasonItem, setSelectedSeasonItem] = useState(null);
  const [calendar, setCalendar] = useState({});

  const currentSeason = "spring";
  const allRecipes = Object.values(recipeDB).flat();
  const filteredRecipes = pantry.length > 0
    ? allRecipes.filter(r => r.ingredients.some(ing => pantry.some(p => ing.name.includes(p))))
    : recipeDB[goal] || recipeDB.nutrition;

  const flavorLabel = { light: "薄め", normal: "普通", rich: "濃いめ" };
  const goalLabel = { diet: "ダイエット", nutrition: "栄養バランス", budget: "節約", easy: "簡単" };

  const addToPantry = () => {
    const items = ingredientInput.split(/[、,，\s]+/).filter(Boolean);
    setPantry(prev => [...new Set([...prev, ...items])]);
    setIngredientInput("");
  };

  const removeFromPantry = (item) => setPantry(prev => prev.filter(p => p !== item));

  const addToCalendar = (recipe) => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    setCalendar(prev => ({ ...prev, [dateStr]: [...(prev[dateStr] || []), recipe.name] }));
    setSelectedRecipe(null);
    alert(`「${recipe.name}」を今日の献立に追加しました！`);
  };

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif", background: "#faf8f3", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: #fff; border-radius: 16px; padding: 16px; margin: 12px 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin: 2px; }
        .btn { border: none; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn:active { transform: scale(0.97); }
        .seg-btn { flex: 1; padding: 8px 4px; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .recipe-card { background: #fff; border-radius: 16px; padding: 16px; margin: 0 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.15s; border: 2px solid transparent; }
        .recipe-card:active { transform: scale(0.98); }
        .tab-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-top: 1px solid #eee; display: flex; z-index: 100; }
        .tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 8px 0 12px; cursor: pointer; gap: 2px; font-size: 9px; font-weight: 600; color: #aaa; transition: color 0.15s; }
        .tab-item.active { color: #ff6b35; }
        input[type=text] { width: 100%; border: 2px solid #eee; border-radius: 12px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; background: #faf8f3; }
        input[type=text]:focus { border-color: #ff6b35; background: #fff; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
        .modal { background: #fff; border-radius: 24px 24px 0 0; padding: 24px 20px 40px; width: 100%; max-width: 430px; max-height: 85vh; overflow-y: auto; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .pantry-tag { display: inline-flex; align-items: center; gap: 4px; background: #fff3ef; color: #c0622b; border-radius: 20px; padding: 4px 10px; font-size: 12px; font-weight: 700; margin: 3px; cursor: pointer; }
        .step-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
        .step-num { background: #ff6b35; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)", padding: "20px 16px 16px", color: "#fff" }}>
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 2 }}>今日の献立を考える</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>レシピ提案アプリ</div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>春の旬食材あり</span>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>本日の特売情報</span>
        </div>
      </div>

      {tab === "home" && <HomeTab goal={goal} setGoal={setGoal} flavor={flavor} setFlavor={setFlavor} plan={plan} setPlan={setPlan} goalLabel={goalLabel} flavorLabel={flavorLabel} recipes={recipeDB[goal] || recipeDB.nutrition} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "ingredients" && <IngredientsTab ingredientInput={ingredientInput} setIngredientInput={setIngredientInput} pantry={pantry} addToPantry={addToPantry} removeFromPantry={removeFromPantry} filteredRecipes={filteredRecipes} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "pantry" && <PantryTab pantry={pantry} removeFromPantry={removeFromPantry} filteredRecipes={filteredRecipes} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "season" && <SeasonTab seasonItems={seasons[currentSeason]} selectedSeasonItem={selectedSeasonItem} setSelectedSeasonItem={setSelectedSeasonItem} seasonRecipes={seasonRecipes} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "calendar" && <CalendarTab calendar={calendar} />}

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedRecipe.name}</div>
              <button onClick={() => setSelectedRecipe(null)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="badge" style={{ background: "#fff3ef", color: "#ff6b35" }}>⏱ {selectedRecipe.time}</span>
              <span className="badge" style={{ background: "#f0f7ff", color: "#2196f3" }}>{selectedRecipe.cal}kcal</span>
              <span className="badge" style={{ background: "#f0fff4", color: "#4caf50" }}>{selectedRecipe.storage.method}{selectedRecipe.storage.days > 0 ? `・${selectedRecipe.storage.days}日` : ""}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>材料</div>
              {selectedRecipe.ingredients.map((ing, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                  <span>{ing.name}{ing.note ? <span style={{ color: "#aaa", fontSize: 11 }}>（{ing.note}）</span> : ""}</span>
                  <span style={{ fontWeight: 600, color: "#ff6b35" }}>{ing.amount}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>作り方</div>
              {selectedRecipe.steps.map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-num">{i + 1}</div>
                  <div style={{ color: "#333", lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>
            {selectedRecipe.flavor && (
              <div style={{ background: "#fff8f5", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 6 }}>味付けのポイント</div>
                <div style={{ fontSize: 14, color: "#333" }}>{selectedRecipe.flavor[flavor]}</div>
              </div>
            )}
            <button className="btn" onClick={() => addToCalendar(selectedRecipe)} style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 15, padding: "14px" }}>
              献立に追加する ✓
            </button>
          </div>
        </div>
      )}

      <div className="tab-bar">
        {[
          { id: "home", icon: "🏠", label: "ホーム" },
          { id: "ingredients", icon: "🛒", label: "食材入力" },
          { id: "pantry", icon: "📦", label: "パントリー" },
          { id: "season", icon: "🌱", label: "旬食材" },
          { id: "calendar", icon: "📅", label: "カレンダー" },
        ].map(t => (
          <div key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeTab({ goal, setGoal, flavor, setFlavor, plan, setPlan, goalLabel, flavorLabel, recipes, setSelectedRecipe }) {
  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>目的を選ぶ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(goalLabel).map(([k, v]) => (
            <button key={k} className="seg-btn" onClick={() => setGoal(k)} style={{ background: goal === k ? "#ff6b35" : "#f5f5f5", color: goal === k ? "#fff" : "#555", padding: "10px 8px" }}>
              {k === "diet" ? "🥗" : k === "nutrition" ? "💪" : k === "budget" ? "💰" : "⚡"} {v}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>味の濃さ</div>
        <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4 }}>
          {["light", "normal", "rich"].map(f => (
            <button key={f} className="seg-btn" onClick={() => setFlavor(f)} style={{ background: flavor === f ? "#fff" : "transparent", color: flavor === f ? "#ff6b35" : "#888", boxShadow: flavor === f ? "0 1px 6px rgba(0,0,0,0.1)" : "none" }}>
              {flavorLabel[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>提案スパン</div>
        <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4 }}>
          {[["daily", "1日3食"], ["weekly", "1週間"], ["monthly", "1ヶ月"]].map(([k, v]) => (
            <button key={k} className="seg-btn" onClick={() => setPlan(k)} style={{ background: plan === k ? "#fff" : "transparent", color: plan === k ? "#ff6b35" : "#888", boxShadow: plan === k ? "0 1px 6px rgba(0,0,0,0.1)" : "none", fontSize: 11 }}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "4px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 12 }}>おすすめレシピ</div>
        {recipes.map((r, i) => (
          <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <span style={{ fontSize: 12, color: "#ff6b35", fontWeight: 700 }}>{r.cal}kcal</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#888" }}>⏱ {r.time}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{r.storage.method}</span>
              {r.flavor && <span style={{ fontSize: 12, color: "#4caf50", fontWeight: 600 }}>{r.flavor[flavor]}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function IngredientsTab({ ingredientInput, setIngredientInput, pantry, addToPantry, removeFromPantry, filteredRecipes, setSelectedRecipe }) {
  return (
    <div style={{ padding: 16 }}>
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>今ある食材を入力</div>
        <input type="text" placeholder="例：鶏むね肉、卵、もやし..." value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addToPantry()} />
        <button className="btn" onClick={addToPantry} style={{ width: "100%", marginTop: 10, background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 14 }}>
          追加する（パントリーにも反映）
        </button>
      </div>
      {pantry.length > 0 && (
        <div className="card" style={{ margin: "0 0 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>登録済み食材（タップで削除）</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {pantry.map(item => <span key={item} className="pantry-tag" onClick={() => removeFromPantry(item)}>{item} ×</span>)}
          </div>
        </div>
      )}
      {pantry.length > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>この食材を使ったレシピ</div>
          {filteredRecipes.length > 0 ? filteredRecipes.map((r, i) => (
            <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {r.ingredients.map(ing => (
                  <span key={ing.name} className="tag" style={{ background: pantry.some(p => ing.name.includes(p)) ? "#fff3ef" : "#f5f5f5", color: pantry.some(p => ing.name.includes(p)) ? "#c0622b" : "#888" }}>{ing.name}</span>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>⏱ {r.time} · {r.cal}kcal · {r.storage.method}</div>
            </div>
          )) : (
            <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14 }}>該当するレシピが見つかりません</div>
          )}
        </>
      )}
    </div>
  );
}

function PantryTab({ pantry, removeFromPantry, filteredRecipes, setSelectedRecipe }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>今家にある食材</div>
      {pantry.length === 0 ? (
        <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14, padding: 24 }}>
          「食材入力」タブから食材を追加してください
        </div>
      ) : (
        <>
          <div className="card" style={{ margin: "0 0 16px" }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {pantry.map(item => <span key={item} className="pantry-tag" onClick={() => removeFromPantry(item)}>{item} ×</span>)}
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>この食材で作れる献立</div>
          {filteredRecipes.map((r, i) => (
            <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {r.ingredients.map(ing => (
                  <span key={ing.name} className="tag" style={{ background: pantry.some(p => ing.name.includes(p)) ? "#fff3ef" : "#f5f5f5", color: pantry.some(p => ing.name.includes(p)) ? "#c0622b" : "#888" }}>{ing.name}</span>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>⏱ {r.time} · {r.cal}kcal</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function SeasonTab({ seasonItems, selectedSeasonItem, setSelectedSeasonItem, seasonRecipes, setSelectedRecipe }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>今が旬の食材（春）— タップでレシピを見る</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {seasonItems.map((item, i) => (
          <div key={i} onClick={() => setSelectedSeasonItem(selectedSeasonItem?.name === item.name ? null : item)}
            style={{ background: selectedSeasonItem?.name === item.name ? "#fff3ef" : "#fff", border: selectedSeasonItem?.name === item.name ? "2px solid #ff6b35" : "2px solid transparent", borderRadius: 14, padding: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.15s" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 600, marginBottom: 2 }}>{item.nutrition}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{item.benefit}</div>
          </div>
        ))}
      </div>
      {selectedSeasonItem && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>「{selectedSeasonItem.name}」を使ったレシピ</div>
          {(seasonRecipes[selectedSeasonItem.name] || []).length > 0 ? (
            (seasonRecipes[selectedSeasonItem.name] || []).map((r, i) => (
              <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>⏱ {r.time} · {r.cal}kcal · {r.storage.method}</div>
              </div>
            ))
          ) : (
            <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14 }}>レシピを準備中です</div>
          )}
        </>
      )}
    </div>
  );
}

function CalendarTab({ calendar }) {
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 7 + i);
    return d;
  });
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>献立カレンダー（2週間）</div>
      {days.map((d, i) => {
        const dateStr = d.toISOString().split("T")[0];
        const meals = calendar[dateStr] || [];
        const isToday = dateStr === today.toISOString().split("T")[0];
        return (
          <div key={i} style={{ background: isToday ? "#fff8f5" : "#fff", border: isToday ? "2px solid #ff6b35" : "2px solid #f0f0f0", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? "#ff6b35" : "#333" }}>
                {isToday ? "今日 " : ""}{d.getMonth() + 1}/{d.getDate()}（{["日", "月", "火", "水", "木", "金", "土"][d.getDay()]}）
              </div>
              {meals.length === 0 && <span style={{ fontSize: 11, color: "#ccc" }}>未登録</span>}
            </div>
            {meals.map((m, j) => <div key={j} style={{ fontSize: 13, color: "#555", marginTop: 4 }}>🍽 {m}</div>)}
          </div>
        );
      })}
    </div>
  );
}
