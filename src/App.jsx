import { useState } from "react";

const seasons = {
  spring: ["たけのこ", "アスパラガス", "春キャベツ", "新玉ねぎ", "菜の花"],
  summer: ["トマト", "きゅうり", "ナス", "ピーマン", "とうもろこし"],
  autumn: ["さつまいも", "きのこ", "れんこん", "かぼちゃ", "栗"],
  winter: ["白菜", "大根", "ほうれん草", "ブロッコリー", "ごぼう"],
};

const saleItems = [
  { name: "鶏むね肉", price: "68円/100g", discount: "30%OFF", category: "肉" },
  { name: "もやし", price: "19円", discount: "特売", category: "野菜" },
  { name: "豆腐", price: "58円", discount: "20%OFF", category: "大豆" },
  { name: "卵", price: "178円/10個", discount: "15%OFF", category: "卵" },
  { name: "キャベツ", price: "128円", discount: "旬", category: "野菜" },
];

const recipeDB = {
  diet: [
    {
      name: "蒸し鶏のサラダ",
      time: "20分",
      cal: 210,
      ingredients: ["鶏むね肉", "レタス", "きゅうり"],
      storage: { method: "冷蔵", days: 2 },
      flavor: { light: "ポン酢でさっぱり", normal: "ごまダレ", rich: "濃厚マヨネーズ" },
    },
    {
      name: "もやしの野菜炒め",
      time: "10分",
      cal: 145,
      ingredients: ["もやし", "ピーマン", "豚薄切り肉"],
      storage: { method: "冷蔵", days: 1 },
      flavor: { light: "塩こしょう", normal: "醤油・みりん", rich: "オイスターソース" },
    },
  ],
  nutrition: [
    {
      name: "彩り野菜の豚汁",
      time: "30分",
      cal: 280,
      ingredients: ["大根", "にんじん", "豚肉", "豆腐"],
      storage: { method: "冷蔵", days: 3 },
      flavor: { light: "白味噌", normal: "合わせ味噌", rich: "赤味噌" },
    },
    {
      name: "鶏と根菜の煮物",
      time: "40分",
      cal: 320,
      ingredients: ["鶏むね肉", "れんこん", "にんじん", "こんにゃく"],
      storage: { method: "冷蔵", days: 3 },
      flavor: { light: "薄口醤油", normal: "醤油・みりん", rich: "甘辛煮" },
    },
  ],
  budget: [
    {
      name: "もやしと卵の炒め物",
      time: "8分",
      cal: 195,
      ingredients: ["もやし", "卵", "ネギ"],
      storage: { method: "当日中", days: 0 },
      flavor: { light: "塩・こしょう", normal: "醤油・ごま油", rich: "オイスターソース" },
    },
    {
      name: "豆腐の麻婆豆腐",
      time: "15分",
      cal: 240,
      ingredients: ["豆腐", "ひき肉", "ネギ", "にんにく"],
      storage: { method: "冷蔵", days: 2 },
      flavor: { light: "塩麻婆", normal: "豆板醤少なめ", rich: "本格辛口" },
    },
  ],
  easy: [
    {
      name: "レンチン茶碗蒸し",
      time: "5分",
      cal: 120,
      ingredients: ["卵", "だし", "みつば"],
      storage: { method: "冷蔵", days: 1 },
      flavor: { light: "薄味だし", normal: "標準", rich: "濃いめだし" },
    },
    {
      name: "豆腐チャンプルー",
      time: "12分",
      cal: 265,
      ingredients: ["豆腐", "卵", "もやし", "ハム"],
      storage: { method: "当日中", days: 0 },
      flavor: { light: "塩こしょう", normal: "醤油・塩", rich: "ソース・醤油" },
    },
  ],
};

const substitutes = {
  みりん: "砂糖＋醤油少々",
  酒: "水＋少量の酢",
  オイスターソース: "醤油＋砂糖＋少量の鶏がらスープ",
  豆板醤: "一味唐辛子＋味噌",
  ごま油: "サラダ油＋少量のすりごま",
};

export default function RecipeApp() {
  const [tab, setTab] = useState("home");
  const [goal, setGoal] = useState("nutrition");
  const [flavor, setFlavor] = useState("normal");
  const [plan, setPlan] = useState("daily");
  const [ingredients, setIngredients] = useState("");
  const [showRecipes, setShowRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const currentSeason = "spring";
  const recipes = recipeDB[goal] || recipeDB.nutrition;

  const flavorLabel = { light: "薄め", normal: "普通", rich: "濃いめ" };
  const goalLabel = { diet: "ダイエット", nutrition: "栄養バランス", budget: "節約", easy: "簡単" };

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
      background: "#faf8f3",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      paddingBottom: 80,
    }}>
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
        .recipe-card.selected { border-color: #ff6b35; }
        .tab-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-top: 1px solid #eee; display: flex; z-index: 100; }
        .tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 0 14px; cursor: pointer; gap: 3px; font-size: 10px; font-weight: 600; color: #aaa; transition: color 0.15s; }
        .tab-item.active { color: #ff6b35; }
        input[type=text] { width: 100%; border: 2px solid #eee; border-radius: 12px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; background: #faf8f3; }
        input[type=text]:focus { border-color: #ff6b35; background: #fff; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
        .modal { background: #fff; border-radius: 24px 24px 0 0; padding: 24px 20px 40px; width: 100%; max-width: 430px; max-height: 80vh; overflow-y: auto; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)", padding: "20px 16px 16px", color: "#fff" }}>
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 2 }}>🍳 今日の献立を考える</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>レシピ提案アプリ</div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>🌸 春の旬食材あり</span>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>🏷️ 本日の特売情報</span>
        </div>
      </div>

      {tab === "home" && (
        <HomeTab goal={goal} setGoal={setGoal} flavor={flavor} setFlavor={setFlavor}
          plan={plan} setPlan={setPlan} goalLabel={goalLabel} flavorLabel={flavorLabel}
          recipes={recipes} setSelectedRecipe={setSelectedRecipe} />
      )}
      {tab === "ingredients" && (
        <IngredientsTab ingredients={ingredients} setIngredients={setIngredients}
          showRecipes={showRecipes} setShowRecipes={setShowRecipes}
          recipes={recipes} flavor={flavor} setSelectedRecipe={setSelectedRecipe} />
      )}
      {tab === "sale" && <SaleTab saleItems={saleItems} />}
      {tab === "season" && <SeasonTab seasonItems={seasons[currentSeason]} />}

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedRecipe.name}</div>
              <button onClick={() => setSelectedRecipe(null)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="badge" style={{ background: "#fff3ef", color: "#ff6b35" }}>⏱ {selectedRecipe.time}</span>
              <span className="badge" style={{ background: "#f0f7ff", color: "#2196f3" }}>🔥 {selectedRecipe.cal}kcal</span>
              <span className="badge" style={{ background: "#f0fff4", color: "#4caf50" }}>📦 {selectedRecipe.storage.method}{selectedRecipe.storage.days > 0 ? `・${selectedRecipe.storage.days}日` : ""}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>使う食材</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedRecipe.ingredients.map(i => (
                  <span key={i} className="tag" style={{ background: "#faf0e6", color: "#c0622b" }}>🥦 {i}</span>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff8f5", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 6 }}>味付けのポイント</div>
              <div style={{ fontSize: 14, color: "#333" }}>💡 {selectedRecipe.flavor[flavor]}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>調味料の代用品</div>
              {Object.entries(substitutes).slice(0, 3).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                  <span style={{ color: "#666" }}>{k}</span>
                  <span style={{ color: "#333", fontWeight: 500 }}>→ {v}</span>
                </div>
              ))}
            </div>
            <button className="btn" style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 15, padding: "14px" }}>
              このレシピで作る ✓
            </button>
          </div>
        </div>
      )}

      <div className="tab-bar">
        {[
          { id: "home", icon: "🏠", label: "ホーム" },
          { id: "ingredients", icon: "🛒", label: "食材入力" },
          { id: "sale", icon: "🏷️", label: "特売" },
          { id: "season", icon: "🌱", label: "旬食材" },
        ].map(t => (
          <div key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
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
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>🎯 目的を選ぶ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(goalLabel).map(([k, v]) => (
            <button key={k} className="seg-btn" onClick={() => setGoal(k)}
              style={{ background: goal === k ? "#ff6b35" : "#f5f5f5", color: goal === k ? "#fff" : "#555", padding: "10px 8px" }}>
              {k === "diet" ? "🥗" : k === "nutrition" ? "💪" : k === "budget" ? "💰" : "⚡"} {v}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>🧂 味の濃さ</div>
        <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4 }}>
          {["light", "normal", "rich"].map(f => (
            <button key={f} className="seg-btn" onClick={() => setFlavor(f)}
              style={{ background: flavor === f ? "#fff" : "transparent", color: flavor === f ? "#ff6b35" : "#888", boxShadow: flavor === f ? "0 1px 6px rgba(0,0,0,0.1)" : "none" }}>
              {flavorLabel[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>📅 提案スパン</div>
        <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4 }}>
          {[["daily", "1日3食"], ["weekly", "1週間"], ["monthly", "1ヶ月"]].map(([k, v]) => (
            <button key={k} className="seg-btn" onClick={() => setPlan(k)}
              style={{ background: plan === k ? "#fff" : "transparent", color: plan === k ? "#ff6b35" : "#888", boxShadow: plan === k ? "0 1px 6px rgba(0,0,0,0.1)" : "none", fontSize: 11 }}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "4px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 12 }}>📋 おすすめレシピ</div>
        {recipes.map((r, i) => (
          <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <span style={{ fontSize: 12, color: "#ff6b35", fontWeight: 700 }}>{r.cal}kcal</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#888" }}>⏱ {r.time}</span>
              <span style={{ fontSize: 12, color: "#888" }}>📦 {r.storage.method}</span>
              <span style={{ fontSize: 12, color: "#4caf50", fontWeight: 600 }}>👉 {r.flavor[flavor]}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function IngredientsTab({ ingredients, setIngredients, showRecipes, setShowRecipes, recipes, flavor, setSelectedRecipe }) {
  return (
    <div style={{ padding: 16 }}>
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🛒 今ある食材を入力</div>
        <input type="text" placeholder="例：鶏むね肉、卵、もやし..."
          value={ingredients} onChange={e => setIngredients(e.target.value)} />
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn" style={{ flex: 1, background: "#f5f5f5", color: "#555" }}>📷 カメラで撮る</button>
          <button className="btn" style={{ flex: 1, background: "#f5f5f5", color: "#555" }}>🧾 レシートを撮る</button>
        </div>
        <button className="btn" onClick={() => setShowRecipes(true)}
          style={{ width: "100%", marginTop: 10, background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 14 }}>
          レシピを提案する →
        </button>
      </div>
      {showRecipes && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>
            🍳 「{ingredients || "手持ち食材"}」を使ったレシピ
          </div>
          {recipes.map((r, i) => (
            <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {r.ingredients.map(ing => (
                  <span key={ing} className="tag" style={{ background: "#fff3ef", color: "#c0622b" }}>{ing}</span>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>⏱ {r.time} · 🔥 {r.cal}kcal · 📦 {r.storage.method}</div>
            </div>
          ))}
        </>
      )}
      <div className="card" style={{ margin: "12px 0 0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🍳 調理器具がない場合の代替</div>
        {[["フライパン", "鍋で代用可能"], ["オーブン", "フライパン＋蓋で代用"], ["電子レンジ", "蒸し器で代用"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
            <span style={{ color: "#666" }}>{k}なし</span>
            <span style={{ color: "#333", fontWeight: 500 }}>→ {v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SaleTab({ saleItems }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🏷️ 今日・今週の特売情報</div>
      {saleItems.map((item, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{item.category}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>{item.price}</div>
            <span className="tag" style={{ background: "#fff0f0", color: "#e53935" }}>{item.discount}</span>
          </div>
        </div>
      ))}
      <div className="card" style={{ margin: "4px 0 0", background: "#fff8f0" }}>
        <div style={{ fontSize: 13, color: "#c0622b" }}>💡 特売食材を使ったレシピは「食材入力」タブから検索できます</div>
      </div>
    </div>
  );
}

function SeasonTab({ seasonItems }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🌸 今が旬の食材（春）</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {seasonItems.map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 16, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🥦</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{item}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>旬・美味しい</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ margin: "12px 0 0", background: "#f0fff4" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#388e3c", marginBottom: 6 }}>🌱 旬食材を使うメリット</div>
        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>旬の食材は栄養価が高く、価格も安定しています。季節に合った料理で体のバランスを整えましょう。</div>
      </div>
    </div>
  );
}
