import { useState } from "react";

const seasons = {
  spring: [
    { name: "たけのこ", nutrition: "食物繊維・カリウム豊富", benefit: "腸活・むくみ解消" },
    { name: "アスパラガス", nutrition: "葉酸・ビタミンE豊富", benefit: "疲労回復・抗酸化" },
    { name: "春キャベツ", nutrition: "ビタミンC・K豊富", benefit: "免疫力アップ・骨強化" },
    { name: "新玉ねぎ", nutrition: "硫化アリル・ビタミンB1", benefit: "血液サラサラ・疲労回復" },
    { name: "菜の花", nutrition: "鉄分・葉酸・ビタミンC", benefit: "貧血予防・美肌効果" },
  ],
};

const saleItems = [
  { name: "鶏むね肉", price: "68円/100g", discount: "30%OFF", category: "肉" },
  { name: "もやし", price: "19円", discount: "特売", category: "野菜" },
  { name: "豆腐", price: "58円", discount: "20%OFF", category: "大豆" },
  { name: "卵", price: "178円/10個", discount: "15%OFF", category: "卵" },
  { name: "キャベツ", price: "128円", discount: "旬", category: "野菜" },
];

const seasonRecipes = {
  たけのこ: [
    { name: "たけのこご飯", time: "40分", cal: 320, ingredients: [{ name: "たけのこ（水煮）", amount: "150g", note: "薄切り" }, { name: "米", amount: "2合", note: "洗って30分浸水" }, { name: "醤油", amount: "大さじ2" }, { name: "みりん", amount: "大さじ1" }, { name: "だし", amount: "360ml" }], steps: ["米をだしで炊く", "たけのこを薄切りにし醤油・みりんで下味", "炊き上がりに混ぜる"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "醤油大さじ1", normal: "醤油大さじ2", rich: "醤油大さじ3" } },
  ],
  アスパラガス: [
    { name: "アスパラのベーコン巻き", time: "15分", cal: 180, ingredients: [{ name: "アスパラガス", amount: "6本", note: "根元を切る" }, { name: "ベーコン", amount: "6枚" }, { name: "塩こしょう", amount: "少々" }, { name: "オリーブ油", amount: "小さじ1" }], steps: ["アスパラにベーコンを巻く", "フライパンで転がしながら焼く（5分）", "塩こしょうで味付け"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "塩少々", normal: "塩こしょう適量", rich: "塩こしょう多め＋醤油" } },
  ],
  春キャベツ: [
    { name: "春キャベツの塩昆布あえ", time: "10分", cal: 80, ingredients: [{ name: "春キャベツ", amount: "200g", note: "手でちぎる" }, { name: "塩昆布", amount: "10g" }, { name: "ごま油", amount: "小さじ1" }, { name: "白ごま", amount: "少々" }], steps: ["キャベツを手でちぎり塩もみ（5分）", "水気を絞る", "塩昆布・ごま油で和える"], storage: { method: "冷蔵", days: 1 }, condiment: { light: "塩昆布5g", normal: "塩昆布10g", rich: "塩昆布15g" } },
  ],
  新玉ねぎ: [
    { name: "新玉ねぎのマリネ", time: "15分", cal: 95, ingredients: [{ name: "新玉ねぎ", amount: "2個（300g）", note: "薄切り" }, { name: "酢", amount: "大さじ3" }, { name: "砂糖", amount: "大さじ1" }, { name: "塩", amount: "小さじ1/2" }], steps: ["玉ねぎを薄切りにして水にさらす（5分）", "水気を切る", "調味料と和えて10分おく"], storage: { method: "冷蔵", days: 3 }, condiment: { light: "酢大さじ2・砂糖少なめ", normal: "酢大さじ3・砂糖大さじ1", rich: "酢大さじ3・砂糖大さじ2" } },
  ],
  菜の花: [
    { name: "菜の花のおひたし", time: "10分", cal: 45, ingredients: [{ name: "菜の花", amount: "200g", note: "根元を切る" }, { name: "醤油", amount: "大さじ1" }, { name: "だし", amount: "大さじ2" }, { name: "かつお節", amount: "少々" }], steps: ["菜の花をさっと茹でる（1分）", "冷水にとり水気を絞る", "だし醤油で和えてかつお節をかける"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "醤油小さじ1", normal: "醤油大さじ1", rich: "醤油大さじ1.5" } },
  ],
};

const saleRecipes = {
  鶏むね肉: [
    { name: "鶏むね肉の照り焼き", time: "20分", cal: 280, ingredients: [{ name: "鶏むね肉", amount: "200g", note: "そぎ切り" }, { name: "醤油", amount: "大さじ2" }, { name: "みりん", amount: "大さじ2" }, { name: "砂糖", amount: "大さじ1" }], steps: ["鶏むね肉をそぎ切りにする", "フライパンで両面焼く（各3分）", "調味料を加えて絡める"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "醤油大さじ1・みりん大さじ1", normal: "醤油大さじ2・みりん大さじ2", rich: "醤油大さじ3・みりん大さじ2・砂糖多め" } },
  ],
  もやし: [
    { name: "もやしのナムル", time: "8分", cal: 90, ingredients: [{ name: "もやし", amount: "200g" }, { name: "ごま油", amount: "大さじ1" }, { name: "塩", amount: "小さじ1/2" }, { name: "白ごま", amount: "少々" }], steps: ["もやしをさっと茹でる（1分）", "水気を切る", "ごま油・塩・ごまで和える"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "塩少々・ごま油小さじ1", normal: "塩小さじ1/2・ごま油大さじ1", rich: "塩多め・ごま油大さじ1.5・にんにく少々" } },
  ],
  豆腐: [
    { name: "冷奴", time: "3分", cal: 80, ingredients: [{ name: "豆腐", amount: "150g", note: "そのまま" }, { name: "醤油", amount: "小さじ1" }, { name: "ネギ", amount: "少々", note: "小口切り" }, { name: "かつお節", amount: "少々" }], steps: ["豆腐を器に盛る", "ネギ・かつお節をのせる", "醤油をかける"], storage: { method: "当日中", days: 0 }, condiment: { light: "醤油少々", normal: "醤油適量", rich: "醤油多め＋ごま油" } },
  ],
  卵: [
    { name: "だし巻き卵", time: "10分", cal: 130, ingredients: [{ name: "卵", amount: "3個（150g）", note: "溶いておく" }, { name: "だし", amount: "50ml" }, { name: "醤油", amount: "小さじ1" }, { name: "みりん", amount: "小さじ1" }], steps: ["卵・だし・調味料を混ぜる", "卵焼き器に油をひき弱火で焼く", "3〜4回に分けて巻きながら焼く"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "塩少々のみ", normal: "醤油小さじ1・みりん小さじ1", rich: "醤油大さじ1・みりん大さじ1・砂糖少々" } },
  ],
  キャベツ: [
    { name: "キャベツの味噌汁", time: "10分", cal: 65, ingredients: [{ name: "キャベツ", amount: "100g", note: "ざく切り" }, { name: "だし", amount: "400ml" }, { name: "味噌", amount: "大さじ1.5" }, { name: "ネギ", amount: "少々" }], steps: ["だしを煮立てキャベツを加える（3分）", "火を止めて味噌を溶く", "ネギを散らす"], storage: { method: "当日中", days: 0 }, condiment: { light: "味噌大さじ1", normal: "味噌大さじ1.5", rich: "味噌大さじ2" } },
  ],
};

const allRecipePool = [
  { name: "肉じゃが", time: "35分", cal: 340, category: "和食", ingredients: [{ name: "じゃがいも", amount: "3個（400g）", note: "乱切り" }, { name: "牛薄切り肉", amount: "150g", note: "3cm幅" }, { name: "玉ねぎ", amount: "1個（200g）", note: "くし切り" }, { name: "にんじん", amount: "1本（150g）", note: "乱切り" }, { name: "醤油", amount: "大さじ3" }, { name: "みりん", amount: "大さじ3" }, { name: "砂糖", amount: "大さじ2" }, { name: "だし", amount: "300ml" }], steps: ["牛肉・野菜を切る", "油で炒めてだし・調味料を加える", "落し蓋をして中火で20分煮る"], storage: { method: "冷蔵", days: 3 }, condiment: { light: "醤油大さじ2・砂糖大さじ1", normal: "醤油大さじ3・砂糖大さじ2", rich: "醤油大さじ4・砂糖大さじ3" } },
  { name: "豚の生姜焼き", time: "15分", cal: 380, category: "和食", ingredients: [{ name: "豚薄切り肉", amount: "200g", note: "広げておく" }, { name: "玉ねぎ", amount: "1/2個（100g）", note: "薄切り" }, { name: "生姜", amount: "1片（10g）", note: "すりおろし" }, { name: "醤油", amount: "大さじ2" }, { name: "みりん", amount: "大さじ2" }, { name: "酒", amount: "大さじ1" }], steps: ["豚肉・玉ねぎをフライパンで炒める（5分）", "生姜・調味料を加えて炒める（3分）", "全体に絡まったら完成"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "醤油大さじ1・みりん大さじ1", normal: "醤油大さじ2・みりん大さじ2", rich: "醤油大さじ3・みりん大さじ2" } },
  { name: "麻婆豆腐", time: "15分", cal: 240, category: "中華", ingredients: [{ name: "豆腐", amount: "300g", note: "さいの目切り" }, { name: "豚ひき肉", amount: "100g" }, { name: "ネギ", amount: "1/2本（50g）", note: "みじん切り" }, { name: "にんにく", amount: "1片（5g）", note: "みじん切り" }, { name: "豆板醤", amount: "小さじ1" }, { name: "醤油", amount: "大さじ1" }, { name: "水溶き片栗粉", amount: "大さじ1" }], steps: ["ひき肉・にんにく・豆板醤を炒める（3分）", "豆腐・水100mlを加えて煮る（5分）", "水溶き片栗粉でとろみをつける"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "豆板醤小さじ1/2", normal: "豆板醤小さじ1", rich: "豆板醤大さじ1" } },
  { name: "チャーハン", time: "10分", cal: 420, category: "中華", ingredients: [{ name: "ご飯", amount: "300g（2膳）" }, { name: "卵", amount: "2個（100g）", note: "溶いておく" }, { name: "ネギ", amount: "1/2本（50g）", note: "小口切り" }, { name: "ハム", amount: "60g", note: "1cm角" }, { name: "醤油", amount: "大さじ1.5" }, { name: "ごま油", amount: "小さじ1" }, { name: "塩こしょう", amount: "少々" }], steps: ["強火でご飯を炒める（3分）", "溶き卵・ハムを加えて炒める（2分）", "ネギ・醤油・ごま油で仕上げる"], storage: { method: "当日中", days: 0 }, condiment: { light: "醤油大さじ1・塩少々", normal: "醤油大さじ1.5・塩こしょう", rich: "醤油大さじ2・ごま油多め" } },
  { name: "ハンバーグ", time: "30分", cal: 450, category: "洋食", ingredients: [{ name: "合いびき肉", amount: "300g" }, { name: "玉ねぎ", amount: "1/2個（100g）", note: "みじん切り・炒めて冷ます" }, { name: "卵", amount: "1個（50g）" }, { name: "パン粉", amount: "大さじ3" }, { name: "牛乳", amount: "大さじ2" }, { name: "塩こしょう", amount: "少々" }], steps: ["材料を全部混ぜてこねる", "楕円形に成形して中央をくぼませる", "フライパンで両面焼く（各5分）・蓋をして5分蒸らす"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "塩少々・ケチャップ少々", normal: "塩こしょう・ケチャップ＋ウスター", rich: "塩こしょう多め・デミグラスソース" } },
  { name: "ポークソテー", time: "15分", cal: 360, category: "洋食", ingredients: [{ name: "豚ロース肉", amount: "200g（2枚）", note: "筋を切る" }, { name: "塩こしょう", amount: "少々" }, { name: "バター", amount: "10g" }, { name: "醤油", amount: "大さじ1" }, { name: "レモン汁", amount: "少々" }], steps: ["豚肉の筋を切り塩こしょうをふる", "フライパンで両面焼く（各4分）", "バター・醤油・レモン汁でソースを作る"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "塩少々・バター少なめ", normal: "塩こしょう・バター10g", rich: "塩こしょう多め・バター多め・醤油多め" } },
  { name: "プリン", time: "40分", cal: 185, category: "デザート", ingredients: [{ name: "卵", amount: "3個（150g）" }, { name: "牛乳", amount: "300ml" }, { name: "砂糖", amount: "60g" }, { name: "バニラエッセンス", amount: "少々" }], steps: ["砂糖30gをカラメルにして型に入れる", "卵・牛乳・砂糖30gを混ぜて濾す", "湯煎で160度・35分焼く"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "砂糖40g", normal: "砂糖60g", rich: "砂糖80g" } },
  { name: "フレンチトースト", time: "15分", cal: 280, category: "デザート", ingredients: [{ name: "食パン", amount: "2枚" }, { name: "卵", amount: "2個（100g）" }, { name: "牛乳", amount: "100ml" }, { name: "砂糖", amount: "大さじ2" }, { name: "バター", amount: "10g" }], steps: ["卵・牛乳・砂糖を混ぜてパンを浸す（10分）", "バターを熱したフライパンで両面焼く（各3分）", "お好みでシロップをかける"], storage: { method: "当日中", days: 0 }, condiment: { light: "砂糖大さじ1", normal: "砂糖大さじ2", rich: "砂糖大さじ3＋シロップ" } },
  { name: "彩り野菜の豚汁", time: "30分", cal: 280, category: "和食", ingredients: [{ name: "大根", amount: "100g", note: "いちょう切り" }, { name: "にんじん", amount: "50g", note: "いちょう切り" }, { name: "豚バラ肉", amount: "100g", note: "3cm幅" }, { name: "豆腐", amount: "150g", note: "さいの目切り" }, { name: "味噌", amount: "大さじ2" }, { name: "だし", amount: "600ml" }], steps: ["だしを煮立て豚肉・根菜を加える（10分）", "豆腐を加えて煮る（5分）", "火を止めて味噌を溶く"], storage: { method: "冷蔵", days: 3 }, condiment: { light: "味噌大さじ1.5（白味噌）", normal: "味噌大さじ2（合わせ）", rich: "味噌大さじ2.5（赤味噌）" } },
  { name: "鶏と根菜の煮物", time: "40分", cal: 320, category: "和食", ingredients: [{ name: "鶏むね肉", amount: "200g", note: "ひと口大" }, { name: "れんこん", amount: "150g", note: "5mm厚さの半月切り" }, { name: "にんじん", amount: "100g", note: "乱切り" }, { name: "こんにゃく", amount: "100g", note: "手でちぎる" }, { name: "醤油", amount: "大さじ3" }, { name: "みりん", amount: "大さじ3" }, { name: "砂糖", amount: "大さじ1" }], steps: ["鶏肉・野菜を切る", "鍋に材料と調味料を入れ煮立てる", "落し蓋をして中火で20分煮る"], storage: { method: "冷蔵", days: 3 }, condiment: { light: "醤油大さじ2・砂糖なし", normal: "醤油大さじ3・砂糖大さじ1", rich: "醤油大さじ4・砂糖大さじ2" } },
  { name: "餃子", time: "30分", cal: 310, category: "中華", ingredients: [{ name: "餃子の皮", amount: "30枚" }, { name: "豚ひき肉", amount: "200g" }, { name: "キャベツ", amount: "150g", note: "みじん切り・塩もみ" }, { name: "ニラ", amount: "50g", note: "みじん切り" }, { name: "にんにく", amount: "1片", note: "すりおろし" }, { name: "醤油", amount: "大さじ1" }, { name: "ごま油", amount: "大さじ1" }], steps: ["具材を全部混ぜる", "皮で包む（30個）", "フライパンで焼く（3分）→水を加えて蓋をして蒸らす（5分）"], storage: { method: "冷蔵", days: 2 }, condiment: { light: "醤油小さじ1・ごま油少々", normal: "醤油大さじ1・ごま油大さじ1", rich: "醤油大さじ1.5・ごま油多め・ラー油" } },
  { name: "パスタ ナポリタン", time: "20分", cal: 480, category: "洋食", ingredients: [{ name: "スパゲッティ", amount: "160g（2人分）" }, { name: "ウインナー", amount: "4本（80g）", note: "斜め切り" }, { name: "玉ねぎ", amount: "1/2個（100g）", note: "薄切り" }, { name: "ピーマン", amount: "2個（80g）", note: "細切り" }, { name: "ケチャップ", amount: "大さじ4" }, { name: "バター", amount: "10g" }], steps: ["パスタを茹でる（表示時間通り）", "野菜・ウインナーをバターで炒める", "パスタ・ケチャップを加えて炒める（3分）"], storage: { method: "当日中", days: 0 }, condiment: { light: "ケチャップ大さじ3", normal: "ケチャップ大さじ4", rich: "ケチャップ大さじ5＋ウスターソース" } },
];

const MEAL_TIMES = ["朝", "昼", "夜"];
const CUISINE_TYPES = ["すべて", "和食", "中華", "洋食", "デザート"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RecipeApp() {
  const [tab, setTab] = useState("home");
  const [goal, setGoal] = useState("nutrition");
  const [flavor, setFlavor] = useState("normal");
  const [plan, setPlan] = useState("1食");
  const [cuisine, setCuisine] = useState("すべて");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [pantry, setPantry] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSeasonItem, setSelectedSeasonItem] = useState(null);
  const [selectedSaleItem, setSelectedSaleItem] = useState(null);
  const [calendar, setCalendar] = useState({});
  const [displayedRecipes, setDisplayedRecipes] = useState(() => shuffle(allRecipePool).slice(0, 10));
  const [addingToCalendar, setAddingToCalendar] = useState(false);
  const [calendarSelection, setCalendarSelection] = useState({ mealTime: "夜", date: new Date().toISOString().split("T")[0] });
  const [calendarRecipeDetail, setCalendarRecipeDetail] = useState(null);

  const currentSeason = "spring";

  const filteredByGoal = cuisine === "すべて" ? displayedRecipes : displayedRecipes.filter(r => r.category === cuisine);

  const filteredByPantry = pantry.length > 0
    ? allRecipePool.filter(r => r.ingredients.some(ing => pantry.some(p => ing.name.includes(p.name))))
    : [];

  const flavorLabel = { light: "薄め", normal: "普通", rich: "濃いめ" };

  const addToPantry = () => {
    if (!ingredientInput.trim()) return;
    const newItem = { name: ingredientInput.trim(), amount: ingredientAmount.trim() };
    setPantry(prev => {
      if (prev.find(p => p.name === newItem.name)) return prev;
      return [...prev, newItem];
    });
    setIngredientInput("");
    setIngredientAmount("");
  };

  const removeFromPantry = (name) => setPantry(prev => prev.filter(p => p.name !== name));

  const refreshRecipes = () => {
    setDisplayedRecipes(shuffle(allRecipePool).slice(0, 10));
  };

  const handleAddToCalendar = (recipe) => {
    setAddingToCalendar(true);
    setCalendarSelection({ mealTime: "夜", date: new Date().toISOString().split("T")[0] });
  };

  const confirmAddToCalendar = () => {
    const key = `${calendarSelection.date}_${calendarSelection.mealTime}`;
    setCalendar(prev => ({ ...prev, [key]: selectedRecipe }));
    setAddingToCalendar(false);
    setSelectedRecipe(null);
    alert(`「${selectedRecipe.name}」を${calendarSelection.date} ${calendarSelection.mealTime}に追加しました！`);
  };

  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif", background: "#faf8f3", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: #fff; border-radius: 16px; padding: 16px; margin: 12px 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .btn { border: none; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn:active { transform: scale(0.97); }
        .seg-btn { flex: 1; padding: 8px 4px; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .recipe-card { background: #fff; border-radius: 16px; padding: 16px; margin: 0 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.15s; border: 2px solid transparent; }
        .recipe-card:active { transform: scale(0.98); }
        .tab-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-top: 1px solid #eee; display: flex; z-index: 100; }
        .tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 8px 0 12px; cursor: pointer; gap: 2px; font-size: 9px; font-weight: 600; color: #aaa; transition: color 0.15s; }
        .tab-item.active { color: #ff6b35; }
        input[type=text] { border: 2px solid #eee; border-radius: 12px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; background: #faf8f3; }
        input[type=text]:focus { border-color: #ff6b35; background: #fff; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
        .modal { background: #fff; border-radius: 24px 24px 0 0; padding: 24px 20px 40px; width: 100%; max-width: 430px; max-height: 88vh; overflow-y: auto; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .pantry-tag { display: inline-flex; align-items: center; gap: 4px; background: #fff3ef; color: #c0622b; border-radius: 20px; padding: 4px 10px; font-size: 12px; font-weight: 700; margin: 3px; cursor: pointer; }
        .step-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
        .step-num { background: #ff6b35; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .meal-slot { border-radius: 8px; padding: 4px 8px; font-size: 12px; margin-top: 4px; cursor: pointer; }
        .meal-slot:hover { opacity: 0.8; }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)", padding: "20px 16px 16px", color: "#fff" }}>
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 2 }}>今日の献立を考える</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>レシピ提案アプリ</div>
      </div>

      {tab === "home" && <HomeTab goal={goal} setGoal={setGoal} flavor={flavor} setFlavor={setFlavor} plan={plan} setPlan={setPlan} cuisine={cuisine} setCuisine={setCuisine} flavorLabel={flavorLabel} recipes={filteredByGoal} setSelectedRecipe={setSelectedRecipe} refreshRecipes={refreshRecipes} />}
      {tab === "ingredients" && <IngredientsTab ingredientInput={ingredientInput} setIngredientInput={setIngredientInput} ingredientAmount={ingredientAmount} setIngredientAmount={setIngredientAmount} pantry={pantry} addToPantry={addToPantry} removeFromPantry={removeFromPantry} filteredRecipes={filteredByPantry} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "pantry" && <PantryTab pantry={pantry} removeFromPantry={removeFromPantry} filteredRecipes={filteredByPantry} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "season" && <SeasonTab seasonItems={seasons[currentSeason]} saleItems={saleItems} selectedSeasonItem={selectedSeasonItem} setSelectedSeasonItem={setSelectedSeasonItem} selectedSaleItem={selectedSaleItem} setSelectedSaleItem={setSelectedSaleItem} seasonRecipes={seasonRecipes} saleRecipes={saleRecipes} setSelectedRecipe={setSelectedRecipe} />}
      {tab === "calendar" && <CalendarTab calendar={calendar} next14Days={next14Days} calendarRecipeDetail={calendarRecipeDetail} setCalendarRecipeDetail={setCalendarRecipeDetail} flavor={flavor} flavorLabel={flavorLabel} />}

      {selectedRecipe && !addingToCalendar && (
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
            <div style={{ background: "#fff8f5", borderRadius: 12, padding: 10, marginBottom: 16, fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: "#ff6b35" }}>調味料の目安（{flavorLabel[flavor]}）：</span>{selectedRecipe.condiment[flavor]}
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
            <button className="btn" onClick={() => handleAddToCalendar(selectedRecipe)} style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 15, padding: "14px" }}>
              献立に追加する ✓
            </button>
          </div>
        </div>
      )}

      {selectedRecipe && addingToCalendar && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>いつの献立に追加しますか？</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>食事</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {MEAL_TIMES.map(mt => (
                <button key={mt} className="seg-btn" onClick={() => setCalendarSelection(s => ({ ...s, mealTime: mt }))}
                  style={{ background: calendarSelection.mealTime === mt ? "#ff6b35" : "#f5f5f5", color: calendarSelection.mealTime === mt ? "#fff" : "#555", padding: "10px 0", flex: 1 }}>
                  {mt}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>日付</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {next14Days.map(d => {
                const date = new Date(d);
                const label = `${date.getMonth() + 1}/${date.getDate()}`;
                return (
                  <button key={d} onClick={() => setCalendarSelection(s => ({ ...s, date: d }))}
                    style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: calendarSelection.date === d ? "#ff6b35" : "#f5f5f5", color: calendarSelection.date === d ? "#fff" : "#555", fontSize: 12, fontWeight: 700 }}>
                    {label}
                  </button>
                );
              })}
            </div>
            <button className="btn" onClick={confirmAddToCalendar} style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 15, padding: "14px", marginBottom: 10 }}>
              追加する
            </button>
            <button className="btn" onClick={() => setAddingToCalendar(false)} style={{ width: "100%", background: "#f5f5f5", color: "#555", fontSize: 14, padding: "12px" }}>
              戻る
            </button>
          </div>
        </div>
      )}

      {calendarRecipeDetail && (
        <div className="modal-overlay" onClick={() => setCalendarRecipeDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{calendarRecipeDetail.name}</div>
              <button onClick={() => setCalendarRecipeDetail(null)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="badge" style={{ background: "#fff3ef", color: "#ff6b35" }}>⏱ {calendarRecipeDetail.time}</span>
              <span className="badge" style={{ background: "#f0f7ff", color: "#2196f3" }}>{calendarRecipeDetail.cal}kcal</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>材料</div>
              {calendarRecipeDetail.ingredients.map((ing, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                  <span>{ing.name}</span>
                  <span style={{ fontWeight: 600, color: "#ff6b35" }}>{ing.amount}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>作り方</div>
              {calendarRecipeDetail.steps.map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-num">{i + 1}</div>
                  <div style={{ color: "#333", lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="tab-bar">
        {[
          { id: "home", icon: "🏠", label: "ホーム" },
          { id: "ingredients", icon: "🛒", label: "食材入力" },
          { id: "pantry", icon: "📦", label: "パントリー" },
          { id: "season", icon: "🌱", label: "旬・特売" },
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

function HomeTab({ goal, setGoal, flavor, setFlavor, plan, setPlan, cuisine, setCuisine, flavorLabel, recipes, setSelectedRecipe, refreshRecipes }) {
  const goalLabel = { diet: "ダイエット", nutrition: "栄養バランス", budget: "節約", easy: "簡単" };
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
        <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4, marginBottom: 12 }}>
          {["1食", "1日3食", "1週間", "1ヶ月"].map(p => (
            <button key={p} className="seg-btn" onClick={() => setPlan(p)} style={{ background: plan === p ? "#fff" : "transparent", color: plan === p ? "#ff6b35" : "#888", boxShadow: plan === p ? "0 1px 6px rgba(0,0,0,0.1)" : "none", fontSize: 10 }}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>ジャンル</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["すべて", "和食", "中華", "洋食", "デザート"].map(c => (
            <button key={c} onClick={() => setCuisine(c)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: cuisine === c ? "#ff6b35" : "#f5f5f5", color: cuisine === c ? "#fff" : "#555", fontSize: 12, fontWeight: 700 }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "4px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>おすすめレシピ（10種類）</div>
          <button onClick={refreshRecipes} style={{ background: "#fff3ef", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#ff6b35", cursor: "pointer" }}>
            更新 ↺
          </button>
        </div>
        {recipes.length === 0 ? (
          <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14 }}>このジャンルのレシピがありません</div>
        ) : recipes.map((r, i) => (
          <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <span style={{ fontSize: 11, background: "#f0f0f0", borderRadius: 8, padding: "2px 6px", color: "#666" }}>{r.category}</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#888" }}>⏱ {r.time}</span>
              <span style={{ fontSize: 12, color: "#ff6b35", fontWeight: 700 }}>{r.cal}kcal</span>
              <span style={{ fontSize: 12, color: "#888" }}>{r.storage.method}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function IngredientsTab({ ingredientInput, setIngredientInput, ingredientAmount, setIngredientAmount, pantry, addToPantry, removeFromPantry, filteredRecipes, setSelectedRecipe }) {
  return (
    <div style={{ padding: 16 }}>
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>今ある食材を入力</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input type="text" placeholder="食材名（例：鶏むね肉）" value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} style={{ flex: 2 }} onKeyDown={e => e.key === "Enter" && addToPantry()} />
          <input type="text" placeholder="量（例：200g）" value={ingredientAmount} onChange={e => setIngredientAmount(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addToPantry()} />
        </div>
        <button className="btn" onClick={addToPantry} style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 14 }}>
          追加する（パントリーにも反映）
        </button>
      </div>
      {pantry.length > 0 && (
        <div className="card" style={{ margin: "0 0 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>登録済み食材（タップで削除）</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {pantry.map(item => (
              <span key={item.name} className="pantry-tag" onClick={() => removeFromPantry(item.name)}>
                {item.name}{item.amount ? `・${item.amount}` : ""} ×
              </span>
            ))}
          </div>
        </div>
      )}
      {filteredRecipes.length > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>この食材を使ったレシピ</div>
          {filteredRecipes.map((r, i) => (
            <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {r.ingredients.map(ing => (
                  <span key={ing.name} style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: pantry.some(p => ing.name.includes(p.name)) ? "#fff3ef" : "#f5f5f5", color: pantry.some(p => ing.name.includes(p.name)) ? "#c0622b" : "#888" }}>{ing.name}</span>
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

function PantryTab({ pantry, removeFromPantry, filteredRecipes, setSelectedRecipe }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>今家にある食材</div>
      {pantry.length === 0 ? (
        <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14, padding: 24 }}>「食材入力」タブから食材を追加してください</div>
      ) : (
        <>
          <div className="card" style={{ margin: "0 0 16px" }}>
            {pantry.map(item => (
              <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.amount && <span style={{ fontSize: 12, color: "#888" }}>{item.amount}</span>}
                  <button onClick={() => removeFromPantry(item.name)} style={{ background: "#f5f5f5", border: "none", borderRadius: 20, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: "#888" }}>削除</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>この食材で作れる献立</div>
          {filteredRecipes.length > 0 ? filteredRecipes.map((r, i) => (
            <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {r.ingredients.map(ing => (
                  <span key={ing.name} style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: pantry.some(p => ing.name.includes(p.name)) ? "#fff3ef" : "#f5f5f5", color: pantry.some(p => ing.name.includes(p.name)) ? "#c0622b" : "#888" }}>{ing.name}</span>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>⏱ {r.time} · {r.cal}kcal</div>
            </div>
          )) : <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14 }}>該当するレシピが見つかりません</div>}
        </>
      )}
    </div>
  );
}

function SeasonTab({ seasonItems, saleItems, selectedSeasonItem, setSelectedSeasonItem, selectedSaleItem, setSelectedSaleItem, seasonRecipes, saleRecipes, setSelectedRecipe }) {
  const [subTab, setSubTab] = useState("season");
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        {[["season", "🌱 旬食材"], ["sale", "🏷️ 特売"]].map(([k, v]) => (
          <button key={k} className="seg-btn" onClick={() => { setSubTab(k); setSelectedSeasonItem(null); setSelectedSaleItem(null); }}
            style={{ background: subTab === k ? "#fff" : "transparent", color: subTab === k ? "#ff6b35" : "#888", boxShadow: subTab === k ? "0 1px 6px rgba(0,0,0,0.1)" : "none", padding: "10px 0" }}>
            {v}
          </button>
        ))}
      </div>

      {subTab === "season" && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>今が旬の食材（春）— タップでレシピを見る</div>
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
              ) : <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14 }}>レシピを準備中です</div>}
            </>
          )}
        </>
      )}

      {subTab === "sale" && (
        <>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>今日の特売 — タップでレシピを見る</div>
          {saleItems.map((item, i) => (
            <div key={i} onClick={() => setSelectedSaleItem(selectedSaleItem?.name === item.name ? null : item)}
              style={{ background: selectedSaleItem?.name === item.name ? "#fff3ef" : "#fff", border: selectedSaleItem?.name === item.name ? "2px solid #ff6b35" : "2px solid transparent", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.15s" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.category}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.price}</div>
                <span style={{ background: "#fff0f0", color: "#e53935", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{item.discount}</span>
              </div>
            </div>
          ))}
          {selectedSaleItem && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>「{selectedSaleItem.name}」を使ったレシピ</div>
              {(saleRecipes[selectedSaleItem.name] || []).map((r, i) => (
                <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>⏱ {r.time} · {r.cal}kcal · {r.storage.method}</div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

function CalendarTab({ calendar, next14Days, calendarRecipeDetail, setCalendarRecipeDetail, flavor, flavorLabel }) {
  const mealColors = { 朝: "#fff8e1", 昼: "#e8f5e9", 夜: "#e3f2fd" };
  const mealTextColors = { 朝: "#f57c00", 昼: "#388e3c", 夜: "#1976d2" };
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>献立カレンダー</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>メニュー名をタップするとレシピが見られます</div>
      {next14Days.map((d, i) => {
        const date = new Date(d);
        const isToday = i === 0;
        const dayMeals = MEAL_TIMES.map(mt => ({ mt, recipe: calendar[`${d}_${mt}`] })).filter(x => x.recipe);
        return (
          <div key={d} style={{ background: isToday ? "#fff8f5" : "#fff", border: isToday ? "2px solid #ff6b35" : "2px solid #f0f0f0", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? "#ff6b35" : "#333", marginBottom: dayMeals.length > 0 ? 8 : 0 }}>
              {isToday ? "今日 " : ""}{date.getMonth() + 1}/{date.getDate()}（{["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}）
              {dayMeals.length === 0 && <span style={{ fontSize: 11, color: "#ccc", fontWeight: 400, marginLeft: 8 }}>未登録</span>}
            </div>
            {dayMeals.map(({ mt, recipe }) => (
              <div key={mt} className="meal-slot" onClick={() => setCalendarRecipeDetail(recipe)}
                style={{ background: mealColors[mt], display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: mealTextColors[mt], minWidth: 20 }}>{mt}</span>
                <span style={{ fontSize: 13, color: "#333", fontWeight: 600, textDecoration: "underline" }}>{recipe.name}</span>
                <span style={{ fontSize: 11, color: "#888", marginLeft: "auto" }}>{recipe.cal}kcal</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
