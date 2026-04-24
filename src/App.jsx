import { useState, useMemo } from "react";

// 食材の表記ゆれ対応マップ
const ingredientAliases = {
  "にんじん": ["人参", "にんじん", "ニンジン"],
  "人参": ["人参", "にんじん", "ニンジン"],
  "たまねぎ": ["玉ねぎ", "たまねぎ", "タマネギ", "玉葱"],
  "玉ねぎ": ["玉ねぎ", "たまねぎ", "タマネギ", "玉葱"],
  "じゃがいも": ["じゃがいも", "ジャガイモ", "じゃが芋", "馬鈴薯"],
  "とりむね": ["鶏むね肉", "とりむね", "鶏胸肉", "チキン"],
  "鶏むね肉": ["鶏むね肉", "とりむね", "鶏胸肉", "チキン"],
  "豆腐": ["豆腐", "とうふ", "トウフ"],
  "もやし": ["もやし", "モヤシ"],
  "卵": ["卵", "たまご", "タマゴ", "玉子"],
  "たまご": ["卵", "たまご", "タマゴ", "玉子"],
  "キャベツ": ["キャベツ", "きゃべつ", "甘藍"],
  "大根": ["大根", "だいこん", "ダイコン"],
  "ほうれん草": ["ほうれん草", "ほうれんそう", "ホウレンソウ"],
  "豚肉": ["豚肉", "ぶたにく", "豚バラ肉", "豚薄切り肉", "豚ロース肉"],
  "牛肉": ["牛肉", "ぎゅうにく", "牛薄切り肉"],
};

function normalizeIngredient(input) {
  const lower = input.toLowerCase();
  for (const [canonical, aliases] of Object.entries(ingredientAliases)) {
    if (aliases.some(a => lower.includes(a.toLowerCase()) || a.toLowerCase().includes(lower))) {
      return canonical;
    }
  }
  return input;
}

function ingredientMatches(ingName, pantryNames) {
  return pantryNames.some(p => {
    const normP = normalizeIngredient(p);
    const normI = normalizeIngredient(ingName);
    const aliasesP = ingredientAliases[normP] || [p];
    const aliasesI = ingredientAliases[normI] || [ingName];
    return aliasesP.some(ap => aliasesI.some(ai =>
      ap.toLowerCase().includes(ai.toLowerCase()) || ai.toLowerCase().includes(ap.toLowerCase())
    ));
  });
}

const MEAL_TIMES = ["朝", "昼", "夜"];

const seasons = {
  spring: [
    { name: "たけのこ", nutrition: "食物繊維・カリウム豊富", benefit: "腸活・むくみ解消" },
    { name: "アスパラガス", nutrition: "葉酸・ビタミンE豊富", benefit: "疲労回復・抗酸化" },
    { name: "春キャベツ", nutrition: "ビタミンC・K豊富", benefit: "免疫力アップ・骨強化" },
    { name: "新玉ねぎ", nutrition: "硫化アリル・ビタミンB1", benefit: "血液サラサラ" },
    { name: "菜の花", nutrition: "鉄分・葉酸・ビタミンC", benefit: "貧血予防・美肌" },
  ],
};

const saleItems = [
  { name: "鶏むね肉", price: "68円/100g", discount: "30%OFF", category: "肉" },
  { name: "もやし", price: "19円", discount: "特売", category: "野菜" },
  { name: "豆腐", price: "58円", discount: "20%OFF", category: "大豆" },
  { name: "卵", price: "178円/10個", discount: "15%OFF", category: "卵" },
  { name: "キャベツ", price: "128円", discount: "旬", category: "野菜" },
];

const recipePhotos = {
  "肉じゃが": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop",
  "豚の生姜焼き": "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=200&fit=crop",
  "麻婆豆腐": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=200&fit=crop",
  "チャーハン": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=200&fit=crop",
  "ハンバーグ": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=200&fit=crop",
  "ポークソテー": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=200&fit=crop",
  "プリン": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=200&fit=crop",
  "フレンチトースト": "https://images.unsplash.com/photo-1484723091739-30990106e9a2?w=400&h=200&fit=crop",
  "彩り野菜の豚汁": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
  "鶏と根菜の煮物": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop",
  "餃子": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=200&fit=crop",
  "パスタ ナポリタン": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=200&fit=crop",
  "蒸し鶏のサラダ": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
  "もやしの野菜炒め": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop",
  "もやしと卵の炒め物": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=200&fit=crop",
  "豆腐チャンプルー": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop",
  "たけのこご飯": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=200&fit=crop",
  "鮭の塩焼き": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=200&fit=crop",
  "茶碗蒸し": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
  "だし巻き卵": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=200&fit=crop",
  "ひじきの煮物": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop",
  "筑前煮": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop",
  "クリームシチュー": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
  "中華スープ": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
  "親子丼": "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=200&fit=crop",
  "default": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=200&fit=crop",
};

function getPhoto(name) { return recipePhotos[name] || recipePhotos["default"]; }

function makeRecipe(name, time, cal, category, ingredients, steps, storage, condiment) {
  return { name, time, cal, category, ingredients, steps, storage, condiment };
}

const allRecipePool = [
  // 和食
  makeRecipe("肉じゃが","35分",340,"和食",[{name:"じゃがいも",amount:"3個（400g）",note:"乱切り"},{name:"牛薄切り肉",amount:"150g",note:"3cm幅"},{name:"玉ねぎ",amount:"1個（200g）",note:"くし切り"},{name:"にんじん",amount:"1本（150g）",note:"乱切り"},{name:"醤油",amount:"大さじ3"},{name:"みりん",amount:"大さじ3"},{name:"砂糖",amount:"大さじ2"},{name:"だし",amount:"300ml"}],["牛肉・野菜を切る","油で炒めてだし・調味料を加える","落し蓋をして中火で20分煮る"],{method:"冷蔵",days:3},{light:"醤油大さじ2・砂糖大さじ1",normal:"醤油大さじ3・砂糖大さじ2",rich:"醤油大さじ4・砂糖大さじ3"}),
  makeRecipe("豚の生姜焼き","15分",380,"和食",[{name:"豚薄切り肉",amount:"200g",note:"広げておく"},{name:"玉ねぎ",amount:"1/2個（100g）",note:"薄切り"},{name:"生姜",amount:"1片（10g）",note:"すりおろし"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"酒",amount:"大さじ1"}],["豚肉・玉ねぎをフライパンで炒める（5分）","生姜・調味料を加えて炒める（3分）","全体に絡まったら完成"],{method:"冷蔵",days:2},{light:"醤油大さじ1・みりん大さじ1",normal:"醤油大さじ2・みりん大さじ2",rich:"醤油大さじ3・みりん大さじ2"}),
  makeRecipe("彩り野菜の豚汁","30分",280,"和食",[{name:"大根",amount:"100g",note:"いちょう切り"},{name:"にんじん",amount:"50g",note:"いちょう切り"},{name:"豚バラ肉",amount:"100g",note:"3cm幅"},{name:"豆腐",amount:"150g",note:"さいの目切り"},{name:"味噌",amount:"大さじ2"},{name:"だし",amount:"600ml"}],["だしを煮立て豚肉・根菜を加える（10分）","豆腐を加えて煮る（5分）","火を止めて味噌を溶く"],{method:"冷蔵",days:3},{light:"味噌大さじ1.5（白味噌）",normal:"味噌大さじ2（合わせ）",rich:"味噌大さじ2.5（赤味噌）"}),
  makeRecipe("鶏と根菜の煮物","40分",320,"和食",[{name:"鶏むね肉",amount:"200g",note:"ひと口大"},{name:"れんこん",amount:"150g",note:"5mm厚さの半月切り"},{name:"にんじん",amount:"100g",note:"乱切り"},{name:"こんにゃく",amount:"100g",note:"手でちぎる"},{name:"醤油",amount:"大さじ3"},{name:"みりん",amount:"大さじ3"},{name:"砂糖",amount:"大さじ1"}],["鶏肉・野菜を切る","鍋に材料と調味料を入れ煮立てる","落し蓋をして中火で20分煮る"],{method:"冷蔵",days:3},{light:"醤油大さじ2・砂糖なし",normal:"醤油大さじ3・砂糖大さじ1",rich:"醤油大さじ4・砂糖大さじ2"}),
  makeRecipe("蒸し鶏のサラダ","20分",210,"和食",[{name:"鶏むね肉",amount:"200g",note:"そぎ切り"},{name:"レタス",amount:"100g",note:"手でちぎる"},{name:"きゅうり",amount:"1本（100g）",note:"薄切り"},{name:"ポン酢",amount:"大さじ2"}],["鶏むね肉をそぎ切りにして酒をふる","電子レンジ600Wで3分加熱","野菜と盛り付けてポン酢をかける"],{method:"冷蔵",days:2},{light:"ポン酢大さじ1",normal:"ポン酢大さじ2",rich:"ポン酢大さじ3＋ごま油"}),
  makeRecipe("だし巻き卵","10分",130,"和食",[{name:"卵",amount:"3個（150g）",note:"溶いておく"},{name:"だし",amount:"50ml"},{name:"醤油",amount:"小さじ1"},{name:"みりん",amount:"小さじ1"}],["卵・だし・調味料を混ぜる","卵焼き器に油をひき弱火で焼く","3〜4回に分けて巻きながら焼く"],{method:"冷蔵",days:2},{light:"塩少々のみ",normal:"醤油小さじ1・みりん小さじ1",rich:"醤油大さじ1・みりん大さじ1・砂糖少々"}),
  makeRecipe("鮭の塩焼き","15分",220,"和食",[{name:"鮭",amount:"2切れ（200g）"},{name:"塩",amount:"小さじ1/2"},{name:"レモン",amount:"1/4個"},{name:"大根おろし",amount:"適量"}],["鮭に塩をふって10分おく","グリルまたはフライパンで両面焼く（各5分）","大根おろし・レモンを添える"],{method:"冷蔵",days:2},{light:"塩少々",normal:"塩小さじ1/2",rich:"塩小さじ1"}),
  makeRecipe("茶碗蒸し","25分",120,"和食",[{name:"卵",amount:"3個（150g）",note:"溶いておく"},{name:"だし",amount:"450ml"},{name:"醤油",amount:"大さじ1"},{name:"みりん",amount:"大さじ1"},{name:"鶏むね肉",amount:"60g",note:"ひと口大"}],["卵・だし・調味料を混ぜて濾す","具材を器に入れて卵液を注ぐ","蒸し器で15分蒸す"],{method:"冷蔵",days:2},{light:"醤油小さじ1・みりん小さじ1",normal:"醤油大さじ1・みりん大さじ1",rich:"醤油大さじ1.5・みりん大さじ1.5"}),
  makeRecipe("ひじきの煮物","20分",95,"和食",[{name:"乾燥ひじき",amount:"20g",note:"水で戻す"},{name:"にんじん",amount:"50g",note:"細切り"},{name:"油揚げ",amount:"1枚",note:"細切り"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"砂糖",amount:"大さじ1"}],["ひじきを水で戻す（20分）","ごま油で炒めてにんじん・油揚げを加える","調味料を加えて煮る（10分）"],{method:"冷蔵",days:4},{light:"醤油大さじ1.5・砂糖なし",normal:"醤油大さじ2・砂糖大さじ1",rich:"醤油大さじ2.5・砂糖大さじ2"}),
  makeRecipe("筑前煮","45分",290,"和食",[{name:"鶏むね肉",amount:"200g",note:"ひと口大"},{name:"れんこん",amount:"100g",note:"乱切り"},{name:"にんじん",amount:"100g",note:"乱切り"},{name:"こんにゃく",amount:"100g",note:"手でちぎる"},{name:"しいたけ",amount:"4枚",note:"半分に切る"},{name:"醤油",amount:"大さじ3"},{name:"みりん",amount:"大さじ3"},{name:"砂糖",amount:"大さじ2"}],["鶏肉・野菜を切って油で炒める","だし300mlと調味料を加える","落し蓋して中火で25分煮る"],{method:"冷蔵",days:3},{light:"醤油大さじ2・砂糖大さじ1",normal:"醤油大さじ3・砂糖大さじ2",rich:"醤油大さじ4・砂糖大さじ3"}),
  // 中華
  makeRecipe("麻婆豆腐","15分",240,"中華",[{name:"豆腐",amount:"300g",note:"さいの目切り"},{name:"豚ひき肉",amount:"100g"},{name:"ネギ",amount:"1/2本（50g）",note:"みじん切り"},{name:"にんにく",amount:"1片（5g）",note:"みじん切り"},{name:"豆板醤",amount:"小さじ1"},{name:"醤油",amount:"大さじ1"},{name:"水溶き片栗粉",amount:"大さじ1"}],["ひき肉・にんにく・豆板醤を炒める（3分）","豆腐・水100mlを加えて煮る（5分）","水溶き片栗粉でとろみをつける"],{method:"冷蔵",days:2},{light:"豆板醤小さじ1/2",normal:"豆板醤小さじ1",rich:"豆板醤大さじ1"}),
  makeRecipe("チャーハン","10分",420,"中華",[{name:"ご飯",amount:"300g（2膳）"},{name:"卵",amount:"2個（100g）",note:"溶いておく"},{name:"ネギ",amount:"1/2本（50g）",note:"小口切り"},{name:"ハム",amount:"60g",note:"1cm角"},{name:"醤油",amount:"大さじ1.5"},{name:"ごま油",amount:"小さじ1"},{name:"塩こしょう",amount:"少々"}],["強火でご飯を炒める（3分）","溶き卵・ハムを加えて炒める（2分）","ネギ・醤油・ごま油で仕上げる"],{method:"当日中",days:0},{light:"醤油大さじ1・塩少々",normal:"醤油大さじ1.5・塩こしょう",rich:"醤油大さじ2・ごま油多め"}),
  makeRecipe("餃子","30分",310,"中華",[{name:"餃子の皮",amount:"30枚"},{name:"豚ひき肉",amount:"200g"},{name:"キャベツ",amount:"150g",note:"みじん切り・塩もみ"},{name:"ニラ",amount:"50g",note:"みじん切り"},{name:"にんにく",amount:"1片",note:"すりおろし"},{name:"醤油",amount:"大さじ1"},{name:"ごま油",amount:"大さじ1"}],["具材を全部混ぜる","皮で包む（30個）","フライパンで焼く（3分）→水を加えて蓋をして蒸らす（5分）"],{method:"冷蔵",days:2},{light:"醤油小さじ1・ごま油少々",normal:"醤油大さじ1・ごま油大さじ1",rich:"醤油大さじ1.5・ごま油多め・ラー油"}),
  makeRecipe("もやしの野菜炒め","10分",145,"中華",[{name:"もやし",amount:"200g"},{name:"ピーマン",amount:"2個（80g）",note:"細切り"},{name:"豚薄切り肉",amount:"100g",note:"3cm幅"},{name:"醤油",amount:"大さじ1"},{name:"みりん",amount:"大さじ1"}],["フライパンを熱し豚肉を炒める（3分）","ピーマン・もやしを加えて炒める（3分）","醤油・みりんで味付け"],{method:"冷蔵",days:1},{light:"塩こしょう",normal:"醤油大さじ1・みりん大さじ1",rich:"オイスターソース大さじ1.5"}),
  makeRecipe("もやしと卵の炒め物","8分",195,"中華",[{name:"もやし",amount:"200g"},{name:"卵",amount:"2個（100g）",note:"溶いておく"},{name:"ネギ",amount:"1/2本（50g）",note:"小口切り"},{name:"醤油",amount:"大さじ1"},{name:"ごま油",amount:"小さじ1"}],["卵を溶きフライパンで炒めて取り出す","もやし・ネギを炒める（3分）","卵を戻して醤油・ごま油で味付け"],{method:"当日中",days:0},{light:"塩・こしょう少々",normal:"醤油大さじ1・ごま油小さじ1",rich:"オイスターソース大さじ1"}),
  makeRecipe("豆腐チャンプルー","12分",265,"中華",[{name:"豆腐",amount:"300g",note:"水切りしてひと口大"},{name:"卵",amount:"2個（100g）",note:"溶いておく"},{name:"もやし",amount:"100g"},{name:"ハム",amount:"60g",note:"短冊切り"},{name:"醤油",amount:"大さじ1"},{name:"塩こしょう",amount:"少々"}],["豆腐を水切りしてひと口大に切る","フライパンで豆腐を焼き色つくまで炒める（4分）","ハム・もやし・卵を加えて炒め調味"],{method:"当日中",days:0},{light:"塩こしょう少々",normal:"醤油大さじ1・塩こしょう",rich:"醤油大さじ1.5・ごま油"}),
  makeRecipe("中華スープ","10分",85,"中華",[{name:"卵",amount:"1個（50g）",note:"溶いておく"},{name:"ネギ",amount:"少々",note:"小口切り"},{name:"鶏がらスープの素",amount:"小さじ2"},{name:"水",amount:"600ml"},{name:"ごま油",amount:"小さじ1"},{name:"塩こしょう",amount:"少々"}],["水を煮立てスープの素を溶く","溶き卵を回し入れる（箸でかき混ぜる）","ネギ・ごま油を加えて完成"],{method:"当日中",days:0},{light:"スープの素小さじ1",normal:"スープの素小さじ2",rich:"スープの素大さじ1"}),
  // 洋食
  makeRecipe("ハンバーグ","30分",450,"洋食",[{name:"合いびき肉",amount:"300g"},{name:"玉ねぎ",amount:"1/2個（100g）",note:"みじん切り・炒めて冷ます"},{name:"卵",amount:"1個（50g）"},{name:"パン粉",amount:"大さじ3"},{name:"牛乳",amount:"大さじ2"},{name:"塩こしょう",amount:"少々"}],["材料を全部混ぜてこねる","楕円形に成形して中央をくぼませる","フライパンで両面焼く（各5分）・蓋をして5分蒸らす"],{method:"冷蔵",days:2},{light:"塩少々・ケチャップ少々",normal:"塩こしょう・ケチャップ＋ウスター",rich:"塩こしょう多め・デミグラスソース"}),
  makeRecipe("ポークソテー","15分",360,"洋食",[{name:"豚ロース肉",amount:"200g（2枚）",note:"筋を切る"},{name:"塩こしょう",amount:"少々"},{name:"バター",amount:"10g"},{name:"醤油",amount:"大さじ1"},{name:"レモン汁",amount:"少々"}],["豚肉の筋を切り塩こしょうをふる","フライパンで両面焼く（各4分）","バター・醤油・レモン汁でソースを作る"],{method:"冷蔵",days:2},{light:"塩少々・バター少なめ",normal:"塩こしょう・バター10g",rich:"塩こしょう多め・バター多め"}),
  makeRecipe("パスタ ナポリタン","20分",480,"洋食",[{name:"スパゲッティ",amount:"160g（2人分）"},{name:"ウインナー",amount:"4本（80g）",note:"斜め切り"},{name:"玉ねぎ",amount:"1/2個（100g）",note:"薄切り"},{name:"ピーマン",amount:"2個（80g）",note:"細切り"},{name:"ケチャップ",amount:"大さじ4"},{name:"バター",amount:"10g"}],["パスタを茹でる（表示時間通り）","野菜・ウインナーをバターで炒める","パスタ・ケチャップを加えて炒める（3分）"],{method:"当日中",days:0},{light:"ケチャップ大さじ3",normal:"ケチャップ大さじ4",rich:"ケチャップ大さじ5＋ウスターソース"}),
  makeRecipe("クリームシチュー","35分",380,"洋食",[{name:"鶏むね肉",amount:"200g",note:"ひと口大"},{name:"じゃがいも",amount:"2個（280g）",note:"乱切り"},{name:"にんじん",amount:"1本（150g）",note:"乱切り"},{name:"玉ねぎ",amount:"1個（200g）",note:"くし切り"},{name:"牛乳",amount:"400ml"},{name:"シチューの素",amount:"4個"}],["鶏肉・野菜を炒める（5分）","水400mlを加えて野菜が柔らかくなるまで煮る（15分）","牛乳・シチューの素を加えて5分煮る"],{method:"冷蔵",days:3},{light:"牛乳多め・シチューの素少なめ",normal:"牛乳400ml・シチューの素4個",rich:"生クリーム追加"}),
  // デザート
  makeRecipe("プリン","40分",185,"デザート",[{name:"卵",amount:"3個（150g）"},{name:"牛乳",amount:"300ml"},{name:"砂糖",amount:"60g"},{name:"バニラエッセンス",amount:"少々"}],["砂糖30gをカラメルにして型に入れる","卵・牛乳・砂糖30gを混ぜて濾す","湯煎で160度・35分焼く"],{method:"冷蔵",days:2},{light:"砂糖40g",normal:"砂糖60g",rich:"砂糖80g"}),
  makeRecipe("フレンチトースト","15分",280,"デザート",[{name:"食パン",amount:"2枚"},{name:"卵",amount:"2個（100g）"},{name:"牛乳",amount:"100ml"},{name:"砂糖",amount:"大さじ2"},{name:"バター",amount:"10g"}],["卵・牛乳・砂糖を混ぜてパンを浸す（10分）","バターを熱したフライパンで両面焼く（各3分）","お好みでシロップをかける"],{method:"当日中",days:0},{light:"砂糖大さじ1",normal:"砂糖大さじ2",rich:"砂糖大さじ3＋シロップ"}),
];

// カテゴリ別に10種類ずつ用意
const recipesByCategory = {
  "すべて": allRecipePool,
  "和食": allRecipePool.filter(r => r.category === "和食"),
  "中華": allRecipePool.filter(r => r.category === "中華"),
  "洋食": allRecipePool.filter(r => r.category === "洋食"),
  "デザート": allRecipePool.filter(r => r.category === "デザート"),
};

// 目的フィルタ
const goalFilters = {
  diet: r => r.cal < 250,
  nutrition: r => true,
  budget: r => ["もやし","豆腐","卵","キャベツ"].some(cheap => r.ingredients.some(i => i.name.includes(cheap))),
  easy: r => parseInt(r.time) <= 15,
};

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function getRecipes(category, goal) {
  const pool = recipesByCategory[category] || allRecipePool;
  const filter = goalFilters[goal] || (() => true);
  const filtered = pool.filter(filter);
  const base = filtered.length >= 10 ? filtered : pool;
  return shuffle(base).slice(0, 10);
}

const seasonRecipes = {
  たけのこ: [makeRecipe("たけのこご飯","40分",320,"和食",[{name:"たけのこ（水煮）",amount:"150g",note:"薄切り"},{name:"米",amount:"2合",note:"洗って30分浸水"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ1"},{name:"だし",amount:"360ml"}],["米をだしで炊く","たけのこを薄切りにし醤油・みりんで下味","炊き上がりに混ぜる"],{method:"冷蔵",days:2},{light:"醤油大さじ1",normal:"醤油大さじ2",rich:"醤油大さじ3"}),makeRecipe("たけのこの煮物","25分",120,"和食",[{name:"たけのこ（水煮）",amount:"200g",note:"乱切り"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"砂糖",amount:"大さじ1"},{name:"だし",amount:"200ml"}],["だし・調味料を煮立てる","たけのこを乱切りにして加える","中火で15分煮る"],{method:"冷蔵",days:3},{light:"醤油大さじ1.5",normal:"醤油大さじ2",rich:"醤油大さじ3"}),makeRecipe("たけのこの土佐煮","30分",140,"和食",[{name:"たけのこ（水煮）",amount:"300g",note:"乱切り"},{name:"かつお節",amount:"10g"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"砂糖",amount:"大さじ1"}],["たけのこを乱切りにする","調味料で煮る（15分）","かつお節を加えて絡める"],{method:"冷蔵",days:3},{light:"醤油大さじ1.5・砂糖なし",normal:"醤油大さじ2・砂糖大さじ1",rich:"醤油大さじ2.5・砂糖大さじ2"}),makeRecipe("たけのこの天ぷら","20分",280,"和食",[{name:"たけのこ（水煮）",amount:"200g",note:"薄切り"},{name:"天ぷら粉",amount:"100g"},{name:"水",amount:"150ml"},{name:"揚げ油",amount:"適量"}],["たけのこを薄切りにする","天ぷら粉を水で溶く","170度の油で揚げる（2分）"],{method:"当日中",days:0},{light:"塩少々",normal:"天つゆ",rich:"天つゆ多め"}),makeRecipe("たけのこと豚肉の炒め煮","25分",290,"和食",[{name:"たけのこ（水煮）",amount:"150g",note:"薄切り"},{name:"豚薄切り肉",amount:"150g"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"砂糖",amount:"大さじ1"}],["豚肉を炒める（3分）","たけのこを加えて炒める（3分）","調味料を加えて煮絡める（5分）"],{method:"冷蔵",days:3},{light:"醤油大さじ1.5・砂糖なし",normal:"醤油大さじ2・砂糖大さじ1",rich:"醤油大さじ2.5・砂糖大さじ2"})],
  アスパラガス: [makeRecipe("アスパラのベーコン巻き","15分",180,"洋食",[{name:"アスパラガス",amount:"6本",note:"根元を切る"},{name:"ベーコン",amount:"6枚"},{name:"塩こしょう",amount:"少々"},{name:"オリーブ油",amount:"小さじ1"}],["アスパラにベーコンを巻く","フライパンで転がしながら焼く（5分）","塩こしょうで味付け"],{method:"冷蔵",days:2},{light:"塩少々",normal:"塩こしょう適量",rich:"塩こしょう多め＋醤油"}),makeRecipe("アスパラの天ぷら","15分",220,"和食",[{name:"アスパラガス",amount:"8本"},{name:"天ぷら粉",amount:"100g"},{name:"水",amount:"150ml"},{name:"揚げ油",amount:"適量"}],["アスパラを切る","天ぷら粉を水で溶く","170度の油で揚げる（2分）"],{method:"当日中",days:0},{light:"塩少々",normal:"天つゆ",rich:"天つゆ多め"}),makeRecipe("アスパラとエビの炒め","15分",195,"中華",[{name:"アスパラガス",amount:"8本",note:"斜め切り"},{name:"エビ",amount:"150g",note:"殻をむく"},{name:"にんにく",amount:"1片",note:"みじん切り"},{name:"塩こしょう",amount:"少々"},{name:"ごま油",amount:"大さじ1"}],["エビをごま油で炒める（2分）","アスパラ・にんにくを加えて炒める（3分）","塩こしょうで味付け"],{method:"冷蔵",days:2},{light:"塩少々",normal:"塩こしょう",rich:"オイスターソース追加"}),makeRecipe("アスパラのソテー","10分",120,"洋食",[{name:"アスパラガス",amount:"8本",note:"根元を切る"},{name:"バター",amount:"10g"},{name:"塩こしょう",amount:"少々"},{name:"レモン汁",amount:"少々"}],["アスパラを斜め切りにする","バターで炒める（4分）","塩こしょう・レモン汁で味付け"],{method:"当日中",days:0},{light:"塩少々・バター少なめ",normal:"塩こしょう・バター10g",rich:"塩こしょう多め・バター多め"}),makeRecipe("アスパラのグラタン","25分",310,"洋食",[{name:"アスパラガス",amount:"8本",note:"3cm幅に切る"},{name:"ベシャメルソース（市販）",amount:"1缶"},{name:"チーズ",amount:"50g"},{name:"塩こしょう",amount:"少々"}],["アスパラを茹でる（2分）","耐熱皿にアスパラを並べソースをかける","チーズをのせて230度で15分焼く"],{method:"当日中",days:0},{light:"チーズ少なめ",normal:"チーズ50g",rich:"チーズ多め＋生クリーム"})],
  春キャベツ: [makeRecipe("春キャベツの塩昆布あえ","10分",80,"和食",[{name:"春キャベツ",amount:"200g",note:"手でちぎる"},{name:"塩昆布",amount:"10g"},{name:"ごま油",amount:"小さじ1"},{name:"白ごま",amount:"少々"}],["キャベツを手でちぎり塩もみ（5分）","水気を絞る","塩昆布・ごま油で和える"],{method:"冷蔵",days:1},{light:"塩昆布5g",normal:"塩昆布10g",rich:"塩昆布15g"}),makeRecipe("春キャベツとベーコンの炒め","12分",190,"洋食",[{name:"春キャベツ",amount:"300g",note:"ざく切り"},{name:"ベーコン",amount:"80g",note:"1cm幅"},{name:"にんにく",amount:"1片",note:"みじん切り"},{name:"塩こしょう",amount:"少々"},{name:"オリーブ油",amount:"大さじ1"}],["ベーコン・にんにくをオリーブ油で炒める","キャベツを加えて炒める（5分）","塩こしょうで味付け"],{method:"当日中",days:0},{light:"塩少々",normal:"塩こしょう",rich:"塩こしょう多め＋醤油"}),makeRecipe("春キャベツのコールスロー","10分",95,"洋食",[{name:"春キャベツ",amount:"200g",note:"千切り"},{name:"にんじん",amount:"1/4本（40g）",note:"千切り"},{name:"マヨネーズ",amount:"大さじ3"},{name:"酢",amount:"大さじ1"},{name:"砂糖",amount:"小さじ1"},{name:"塩こしょう",amount:"少々"}],["キャベツ・にんじんを千切りにして塩もみ","水気を絞る","マヨネーズ・酢・砂糖で和える"],{method:"冷蔵",days:2},{light:"マヨネーズ大さじ2",normal:"マヨネーズ大さじ3",rich:"マヨネーズ大さじ4"}),makeRecipe("春キャベツのロール白菜","35分",280,"和食",[{name:"春キャベツ",amount:"6枚"},{name:"豚ひき肉",amount:"200g"},{name:"玉ねぎ",amount:"1/4個",note:"みじん切り"},{name:"だし",amount:"400ml"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"}],["キャベツをさっと茹でてひき肉で包む","だし・調味料で煮る（20分）","火が通ったら完成"],{method:"冷蔵",days:3},{light:"醤油大さじ1.5",normal:"醤油大さじ2",rich:"醤油大さじ2.5"}),makeRecipe("春キャベツの味噌汁","8分",55,"和食",[{name:"春キャベツ",amount:"100g",note:"ざく切り"},{name:"だし",amount:"400ml"},{name:"味噌",amount:"大さじ1.5"},{name:"ネギ",amount:"少々"}],["だしを煮立てキャベツを加える（3分）","火を止めて味噌を溶く","ネギを散らす"],{method:"当日中",days:0},{light:"味噌大さじ1",normal:"味噌大さじ1.5",rich:"味噌大さじ2"})],
  新玉ねぎ: [makeRecipe("新玉ねぎのマリネ","15分",95,"洋食",[{name:"新玉ねぎ",amount:"2個（300g）",note:"薄切り"},{name:"酢",amount:"大さじ3"},{name:"砂糖",amount:"大さじ1"},{name:"塩",amount:"小さじ1/2"}],["玉ねぎを薄切りにして水にさらす（5分）","水気を切る","調味料と和えて10分おく"],{method:"冷蔵",days:3},{light:"酢大さじ2・砂糖少なめ",normal:"酢大さじ3・砂糖大さじ1",rich:"酢大さじ3・砂糖大さじ2"}),makeRecipe("オニオングラタンスープ","30分",180,"洋食",[{name:"新玉ねぎ",amount:"2個（300g）",note:"薄切り"},{name:"コンソメ",amount:"2個"},{name:"バター",amount:"20g"},{name:"チーズ",amount:"40g"},{name:"バゲット",amount:"2切れ"}],["玉ねぎをバターで飴色になるまで炒める（15分）","水600mlとコンソメを加えて煮る","チーズ・バゲットをのせてトースターで焼く"],{method:"当日中",days:0},{light:"コンソメ1個",normal:"コンソメ2個",rich:"コンソメ3個"}),makeRecipe("新玉ねぎのかき揚げ","20分",240,"和食",[{name:"新玉ねぎ",amount:"2個（300g）",note:"薄切り"},{name:"天ぷら粉",amount:"100g"},{name:"水",amount:"150ml"},{name:"揚げ油",amount:"適量"}],["玉ねぎを薄切りにする","天ぷら粉を水で溶いて玉ねぎを混ぜる","170度の油でかき揚げにする（3分）"],{method:"当日中",days:0},{light:"塩少々",normal:"天つゆ",rich:"天つゆ多め"}),makeRecipe("新玉ねぎの丸ごとスープ","25分",120,"洋食",[{name:"新玉ねぎ",amount:"2個（300g）",note:"丸ごと"},{name:"コンソメ",amount:"2個"},{name:"水",amount:"600ml"},{name:"バター",amount:"10g"},{name:"塩こしょう",amount:"少々"}],["玉ねぎの上下を切り耐熱容器に入れる","コンソメ・水・バターを加える","600Wで15分加熱し塩こしょうで味付け"],{method:"当日中",days:0},{light:"コンソメ1個",normal:"コンソメ2個",rich:"コンソメ2個＋バター多め"}),makeRecipe("新玉ねぎの肉詰め","30分",320,"和食",[{name:"新玉ねぎ",amount:"2個（300g）",note:"中をくり抜く"},{name:"豚ひき肉",amount:"150g"},{name:"塩こしょう",amount:"少々"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"}],["玉ねぎをくり抜いてひき肉を詰める","フライパンで蓋をして蒸し焼き（15分）","醤油・みりんで味付け"],{method:"冷蔵",days:2},{light:"醤油大さじ1.5",normal:"醤油大さじ2",rich:"醤油大さじ2.5・砂糖追加"})],
  菜の花: [makeRecipe("菜の花のおひたし","10分",45,"和食",[{name:"菜の花",amount:"200g",note:"根元を切る"},{name:"醤油",amount:"大さじ1"},{name:"だし",amount:"大さじ2"},{name:"かつお節",amount:"少々"}],["菜の花をさっと茹でる（1分）","冷水にとり水気を絞る","だし醤油で和えてかつお節をかける"],{method:"冷蔵",days:2},{light:"醤油小さじ1",normal:"醤油大さじ1",rich:"醤油大さじ1.5"}),makeRecipe("菜の花のパスタ","20分",380,"洋食",[{name:"菜の花",amount:"150g",note:"3cm幅に切る"},{name:"スパゲッティ",amount:"160g"},{name:"にんにく",amount:"2片",note:"薄切り"},{name:"オリーブ油",amount:"大さじ3"},{name:"塩こしょう",amount:"少々"}],["パスタを茹でる","にんにくをオリーブ油で炒める","菜の花・パスタを加えて炒める"],{method:"当日中",days:0},{light:"塩少々",normal:"塩こしょう",rich:"塩こしょう多め＋チーズ"}),makeRecipe("菜の花の辛子あえ","8分",40,"和食",[{name:"菜の花",amount:"200g",note:"根元を切る"},{name:"醤油",amount:"大さじ1"},{name:"みりん",amount:"小さじ1"},{name:"和からし",amount:"小さじ1/2"}],["菜の花をさっと茹でる（1分）","冷水にとり水気を絞る","醤油・みりん・からしで和える"],{method:"冷蔵",days:2},{light:"からし少々",normal:"からし小さじ1/2",rich:"からし小さじ1"}),makeRecipe("菜の花の天ぷら","15分",210,"和食",[{name:"菜の花",amount:"200g"},{name:"天ぷら粉",amount:"100g"},{name:"水",amount:"150ml"},{name:"揚げ油",amount:"適量"}],["菜の花の根元を切る","天ぷら粉を水で溶く","170度の油で揚げる（2分）"],{method:"当日中",days:0},{light:"塩少々",normal:"天つゆ",rich:"天つゆ多め"}),makeRecipe("菜の花とツナのサラダ","8分",130,"和食",[{name:"菜の花",amount:"150g",note:"根元を切る"},{name:"ツナ缶",amount:"1缶（70g）"},{name:"マヨネーズ",amount:"大さじ2"},{name:"醤油",amount:"小さじ1"}],["菜の花をさっと茹でて冷ます","水気を絞ってツナと混ぜる","マヨネーズ・醤油で和える"],{method:"冷蔵",days:2},{light:"マヨネーズ大さじ1",normal:"マヨネーズ大さじ2",rich:"マヨネーズ大さじ3"})],
};

const saleRecipes = {
  鶏むね肉: [makeRecipe("鶏むね肉の照り焼き","20分",280,"和食",[{name:"鶏むね肉",amount:"200g",note:"そぎ切り"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"砂糖",amount:"大さじ1"}],["鶏むね肉をそぎ切りにする","フライパンで両面焼く（各3分）","調味料を加えて絡める"],{method:"冷蔵",days:2},{light:"醤油大さじ1",normal:"醤油大さじ2",rich:"醤油大さじ3"}),makeRecipe("鶏むね肉のから揚げ","25分",350,"和食",[{name:"鶏むね肉",amount:"300g",note:"ひと口大"},{name:"醤油",amount:"大さじ2"},{name:"生姜",amount:"1片",note:"すりおろし"},{name:"にんにく",amount:"1片",note:"すりおろし"},{name:"片栗粉",amount:"大さじ3"},{name:"揚げ油",amount:"適量"}],["鶏肉を調味料で15分漬ける","片栗粉をまぶす","170度の油で3〜4分揚げる"],{method:"冷蔵",days:2},{light:"醤油大さじ1.5",normal:"醤油大さじ2",rich:"醤油大さじ2.5"}),makeRecipe("蒸し鶏のサラダ","20分",210,"和食",[{name:"鶏むね肉",amount:"200g",note:"そぎ切り"},{name:"レタス",amount:"100g"},{name:"きゅうり",amount:"1本"},{name:"ポン酢",amount:"大さじ2"}],["鶏肉をそぎ切りにしてレンジ加熱（3分）","野菜と盛り付け","ポン酢をかける"],{method:"冷蔵",days:2},{light:"ポン酢大さじ1",normal:"ポン酢大さじ2",rich:"ポン酢大さじ3"}),makeRecipe("鶏むね肉の塩レモン炒め","15分",240,"洋食",[{name:"鶏むね肉",amount:"200g",note:"ひと口大"},{name:"レモン汁",amount:"大さじ1"},{name:"にんにく",amount:"1片"},{name:"塩こしょう",amount:"少々"},{name:"オリーブ油",amount:"大さじ1"}],["鶏肉を下味をつける","オリーブ油・にんにくで炒める（5分）","レモン汁・塩こしょうで仕上げ"],{method:"冷蔵",days:2},{light:"塩少々・レモン少々",normal:"塩こしょう・レモン大さじ1",rich:"塩多め・レモン大さじ2"}),makeRecipe("鶏むね肉のみそ焼き","20分",260,"和食",[{name:"鶏むね肉",amount:"200g",note:"そぎ切り"},{name:"味噌",amount:"大さじ2"},{name:"みりん",amount:"大さじ1"},{name:"砂糖",amount:"小さじ1"},{name:"生姜",amount:"少々"}],["調味料を混ぜて鶏肉を30分漬ける","フライパンで両面焼く（各4分）","焦げないよう弱火で焼く"],{method:"冷蔵",days:3},{light:"味噌大さじ1",normal:"味噌大さじ2",rich:"味噌大さじ3"})],
  もやし: [makeRecipe("もやしのナムル","8分",90,"中華",[{name:"もやし",amount:"200g"},{name:"ごま油",amount:"大さじ1"},{name:"塩",amount:"小さじ1/2"},{name:"白ごま",amount:"少々"}],["もやしをさっと茹でる（1分）","水気を切る","ごま油・塩・ごまで和える"],{method:"冷蔵",days:2},{light:"塩少々・ごま油小さじ1",normal:"塩小さじ1/2・ごま油大さじ1",rich:"塩多め・ごま油大さじ1.5"}),makeRecipe("もやしの味噌汁","8分",50,"和食",[{name:"もやし",amount:"100g"},{name:"だし",amount:"400ml"},{name:"味噌",amount:"大さじ1.5"},{name:"ネギ",amount:"少々"}],["だしを煮立ててもやしを加える（2分）","火を止めて味噌を溶く","ネギを散らす"],{method:"当日中",days:0},{light:"味噌大さじ1",normal:"味噌大さじ1.5",rich:"味噌大さじ2"}),makeRecipe("もやしと卵の炒め物","8分",195,"中華",[{name:"もやし",amount:"200g"},{name:"卵",amount:"2個"},{name:"ネギ",amount:"少々"},{name:"醤油",amount:"大さじ1"},{name:"ごま油",amount:"小さじ1"}],["卵を炒めて取り出す","もやし・ネギを炒める","卵を戻して調味料で味付け"],{method:"当日中",days:0},{light:"塩少々",normal:"醤油大さじ1",rich:"醤油大さじ1.5"}),makeRecipe("もやしの野菜炒め","10分",145,"中華",[{name:"もやし",amount:"200g"},{name:"ピーマン",amount:"2個"},{name:"豚薄切り肉",amount:"100g"},{name:"醤油",amount:"大さじ1"},{name:"みりん",amount:"大さじ1"}],["豚肉を炒める（3分）","野菜を加えて炒める（3分）","調味料で味付け"],{method:"冷蔵",days:1},{light:"塩こしょう",normal:"醤油大さじ1",rich:"オイスターソース大さじ1.5"}),makeRecipe("もやしのラーメン","15分",420,"中華",[{name:"中華麺",amount:"2玉"},{name:"もやし",amount:"150g"},{name:"豚バラ肉",amount:"100g"},{name:"鶏がらスープの素",amount:"大さじ2"},{name:"醤油",amount:"大さじ2"},{name:"ごま油",amount:"小さじ1"}],["スープを作る（鶏がら・醤油・ごま油）","麺を茹でる","豚肉・もやしをのせる"],{method:"当日中",days:0},{light:"スープ薄め",normal:"スープ標準",rich:"スープ濃いめ"})],
  豆腐: [makeRecipe("冷奴","3分",80,"和食",[{name:"豆腐",amount:"150g"},{name:"醤油",amount:"小さじ1"},{name:"ネギ",amount:"少々"},{name:"かつお節",amount:"少々"}],["豆腐を器に盛る","ネギ・かつお節をのせる","醤油をかける"],{method:"当日中",days:0},{light:"醤油少々",normal:"醤油適量",rich:"醤油多め＋ごま油"}),makeRecipe("麻婆豆腐","15分",240,"中華",[{name:"豆腐",amount:"300g"},{name:"豚ひき肉",amount:"100g"},{name:"豆板醤",amount:"小さじ1"},{name:"醤油",amount:"大さじ1"},{name:"水溶き片栗粉",amount:"大さじ1"}],["ひき肉・豆板醤を炒める","豆腐・水を加えて煮る","片栗粉でとろみをつける"],{method:"冷蔵",days:2},{light:"豆板醤小さじ1/2",normal:"豆板醤小さじ1",rich:"豆板醤大さじ1"}),makeRecipe("豆腐チャンプルー","12分",265,"中華",[{name:"豆腐",amount:"300g"},{name:"卵",amount:"2個"},{name:"もやし",amount:"100g"},{name:"ハム",amount:"60g"},{name:"醤油",amount:"大さじ1"}],["豆腐を炒める（4分）","ハム・もやし・卵を加える","醤油で味付け"],{method:"当日中",days:0},{light:"塩こしょう",normal:"醤油大さじ1",rich:"醤油大さじ1.5・ごま油"}),makeRecipe("豆腐の味噌汁","8分",60,"和食",[{name:"豆腐",amount:"150g"},{name:"だし",amount:"400ml"},{name:"味噌",amount:"大さじ1.5"},{name:"ネギ",amount:"少々"},{name:"わかめ",amount:"少々"}],["だしを煮立てて豆腐を加える","わかめを加えて火を止める","味噌を溶いてネギを散らす"],{method:"当日中",days:0},{light:"味噌大さじ1",normal:"味噌大さじ1.5",rich:"味噌大さじ2"}),makeRecipe("揚げ出し豆腐","20分",220,"和食",[{name:"豆腐",amount:"300g",note:"水切り"},{name:"片栗粉",amount:"大さじ3"},{name:"だし",amount:"200ml"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"}],["豆腐を水切りして片栗粉をまぶす","170度の油で揚げる（3分）","だし・醤油・みりんのつゆをかける"],{method:"当日中",days:0},{light:"つゆ薄め",normal:"つゆ標準",rich:"つゆ濃いめ"})],
  卵: [makeRecipe("だし巻き卵","10分",130,"和食",[{name:"卵",amount:"3個"},{name:"だし",amount:"50ml"},{name:"醤油",amount:"小さじ1"},{name:"みりん",amount:"小さじ1"}],["卵・だし・調味料を混ぜる","卵焼き器で焼く","3〜4回に分けて巻く"],{method:"冷蔵",days:2},{light:"塩少々のみ",normal:"醤油小さじ1・みりん小さじ1",rich:"醤油大さじ1・みりん大さじ1"}),makeRecipe("親子丼","20分",480,"和食",[{name:"鶏むね肉",amount:"150g"},{name:"卵",amount:"3個"},{name:"玉ねぎ",amount:"1/2個"},{name:"だし",amount:"150ml"},{name:"醤油",amount:"大さじ2"},{name:"みりん",amount:"大さじ2"},{name:"ご飯",amount:"2膳"}],["玉ねぎ・鶏肉をだし・調味料で煮る","溶き卵を流し入れて半熟にする","ご飯にのせる"],{method:"当日中",days:0},{light:"醤油大さじ1.5",normal:"醤油大さじ2",rich:"醤油大さじ2.5"}),makeRecipe("目玉焼き","5分",90,"洋食",[{name:"卵",amount:"2個"},{name:"バター",amount:"5g"},{name:"塩こしょう",amount:"少々"}],["バターをフライパンで溶かす","卵を割り入れる","蓋をして2〜3分焼く"],{method:"当日中",days:0},{light:"塩少々",normal:"塩こしょう",rich:"塩こしょう多め＋醤油"}),makeRecipe("茶碗蒸し","25分",120,"和食",[{name:"卵",amount:"3個"},{name:"だし",amount:"450ml"},{name:"醤油",amount:"大さじ1"},{name:"みりん",amount:"大さじ1"},{name:"鶏むね肉",amount:"60g"}],["卵液を作って濾す","具材を入れて卵液を注ぐ","蒸し器で15分蒸す"],{method:"冷蔵",days:2},{light:"醤油小さじ1",normal:"醤油大さじ1",rich:"醤油大さじ1.5"}),makeRecipe("スクランブルエッグ","5分",160,"洋食",[{name:"卵",amount:"3個"},{name:"バター",amount:"10g"},{name:"牛乳",amount:"大さじ2"},{name:"塩こしょう",amount:"少々"}],["卵・牛乳・塩こしょうを混ぜる","バターを溶かしたフライパンで炒める","ふんわりしたら完成"],{method:"当日中",days:0},{light:"塩少々",normal:"塩こしょう",rich:"塩こしょう多め"})],
  キャベツ: [makeRecipe("キャベツの味噌汁","8分",55,"和食",[{name:"キャベツ",amount:"100g"},{name:"だし",amount:"400ml"},{name:"味噌",amount:"大さじ1.5"},{name:"ネギ",amount:"少々"}],["だしを煮立ててキャベツを加える","味噌を溶く","ネギを散らす"],{method:"当日中",days:0},{light:"味噌大さじ1",normal:"味噌大さじ1.5",rich:"味噌大さじ2"}),makeRecipe("ロールキャベツ","40分",320,"洋食",[{name:"キャベツ",amount:"6枚"},{name:"合いびき肉",amount:"200g"},{name:"玉ねぎ",amount:"1/4個",note:"みじん切り"},{name:"コンソメ",amount:"2個"},{name:"塩こしょう",amount:"少々"}],["キャベツを茹でる","ひき肉・玉ねぎを混ぜて包む","コンソメスープで30分煮る"],{method:"冷蔵",days:3},{light:"コンソメ1個",normal:"コンソメ2個",rich:"コンソメ3個"}),makeRecipe("春キャベツのコールスロー","10分",95,"洋食",[{name:"キャベツ",amount:"200g",note:"千切り"},{name:"にんじん",amount:"40g",note:"千切り"},{name:"マヨネーズ",amount:"大さじ3"},{name:"酢",amount:"大さじ1"}],["野菜を千切りにして塩もみ","水気を絞る","マヨネーズ・酢で和える"],{method:"冷蔵",days:2},{light:"マヨネーズ大さじ2",normal:"マヨネーズ大さじ3",rich:"マヨネーズ大さじ4"}),makeRecipe("餃子","30分",310,"中華",[{name:"餃子の皮",amount:"30枚"},{name:"豚ひき肉",amount:"200g"},{name:"キャベツ",amount:"150g"},{name:"ニラ",amount:"50g"},{name:"醤油",amount:"大さじ1"}],["具材を混ぜる","皮で包む","フライパンで焼く"],{method:"冷蔵",days:2},{light:"醤油少々",normal:"醤油大さじ1",rich:"醤油大さじ1.5・ごま油"}),makeRecipe("キャベツとベーコンの炒め","12分",190,"洋食",[{name:"キャベツ",amount:"300g"},{name:"ベーコン",amount:"80g"},{name:"にんにく",amount:"1片"},{name:"塩こしょう",amount:"少々"},{name:"オリーブ油",amount:"大さじ1"}],["ベーコン・にんにくを炒める","キャベツを加えて炒める（5分）","塩こしょうで味付け"],{method:"当日中",days:0},{light:"塩少々",normal:"塩こしょう",rich:"塩こしょう多め＋醤油"})],
};

export default function RecipeApp() {
  const [tab, setTab] = useState("home");
  const [goal, setGoal] = useState("nutrition");
  const [flavor, setFlavor] = useState("normal");
  const [cuisine, setCuisine] = useState("すべて");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [pantry, setPantry] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSeasonItem, setSelectedSeasonItem] = useState(null);
  const [selectedSaleItem, setSelectedSaleItem] = useState(null);
  const [calendar, setCalendar] = useState({});
  const [displayedRecipes, setDisplayedRecipes] = useState(() => getRecipes("すべて", "nutrition"));
  const [addingToCalendar, setAddingToCalendar] = useState(false);
  const [calendarSelection, setCalendarSelection] = useState({ mealTime: "夜", date: new Date().toISOString().split("T")[0] });
  const [calendarRecipeDetail, setCalendarRecipeDetail] = useState(null);
  const [servings, setServings] = useState(2);
  const [shoppingList, setShoppingList] = useState([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const currentSeason = "spring";
  const flavorLabel = { light: "薄め", normal: "普通", rich: "濃いめ" };

  // スーパーの売り場順カテゴリ
  const supermarketOrder = ["野菜・果物", "肉・魚", "豆腐・卵・乳製品", "乾物・缶詰", "調味料", "その他"];
  const ingredientCategory = (name) => {
    if (["キャベツ","にんじん","玉ねぎ","じゃがいも","大根","レタス","きゅうり","ピーマン","ネギ","ニラ","アスパラ","もやし","ほうれん草","たけのこ","菜の花","れんこん","こんにゃく","しいたけ","牛乳","レモン","生姜","にんにく","春キャベツ","新玉ねぎ"].some(v => name.includes(v))) return "野菜・果物";
    if (["鶏","豚","牛","ひき肉","ベーコン","ハム","ウインナー","エビ","鮭","魚"].some(v => name.includes(v))) return "肉・魚";
    if (["豆腐","卵","牛乳","チーズ","バター","油揚げ"].some(v => name.includes(v))) return "豆腐・卵・乳製品";
    if (["ひじき","ツナ","かつお節","だし","パン粉","天ぷら粉","片栗粉","小麦粉","餃子の皮","スパゲッティ","中華麺","食パン","バゲット","米","ご飯"].some(v => name.includes(v))) return "乾物・缶詰";
    if (["醤油","みりん","砂糖","塩","味噌","酒","ごま油","オリーブ油","ケチャップ","マヨネーズ","コンソメ","鶏がらスープ","豆板醤","シチュー","バニラ","酢","水溶き"].some(v => name.includes(v))) return "調味料";
    return "その他";
  };

  const generateShoppingList = (recipe) => {
    const pantryNames = pantry.map(p => p.name);
    const needed = recipe.ingredients.filter(ing => !ingredientMatches(ing.name, pantryNames));
    const items = needed.map(ing => ({ ...ing, category: ingredientCategory(ing.name), checked: false, fromRecipe: recipe.name }));
    setShoppingList(prev => {
      const existing = prev.map(p => p.name);
      const newItems = items.filter(i => !existing.includes(i.name));
      return [...prev, ...newItems];
    });
    setShowShoppingList(true);
    setSelectedRecipe(null);
  };

  const addAllergy = () => {
    if (!allergyInput.trim()) return;
    setAllergies(prev => [...new Set([...prev, allergyInput.trim()])]);
    setAllergyInput("");
  };

  const removeAllergy = (a) => setAllergies(prev => prev.filter(x => x !== a));

  // アレルギーフィルタ適用
  const filterByAllergy = (recipes) => {
    if (allergies.length === 0) return recipes;
    return recipes.filter(r => !r.ingredients.some(ing => allergies.some(a => ing.name.includes(a))));
  };

  const pantryNames = pantry.map(p => p.name);

  const filteredByPantry = useMemo(() => {
    if (pantry.length === 0) return [];
    // パントリー内食材だけで作れるレシピを優先（調味料除く主要食材）
    const condiments = ["醤油", "みりん", "砂糖", "塩", "味噌", "酒", "だし", "ごま油", "オリーブ油", "バター", "片栗粉", "天ぷら粉", "水", "小麦粉", "塩こしょう", "揚げ油", "コンソメ", "鶏がらスープの素"];
    const scored = allRecipePool.map(r => {
      const mainIngredients = r.ingredients.filter(i => !condiments.some(c => i.name.includes(c)));
      const matched = mainIngredients.filter(i => ingredientMatches(i.name, pantryNames));
      const score = mainIngredients.length > 0 ? matched.length / mainIngredients.length : 0;
      return { ...r, score, matched: matched.length, total: mainIngredients.length };
    });
    return scored.filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  }, [pantry]);

  const addToPantry = () => {
    if (!ingredientInput.trim()) return;
    const newItem = { name: ingredientInput.trim(), amount: ingredientAmount.trim() };
    setPantry(prev => prev.find(p => p.name === newItem.name) ? prev : [...prev, newItem]);
    setIngredientInput("");
    setIngredientAmount("");
  };

  const removeFromPantry = (name) => setPantry(prev => prev.filter(p => p.name !== name));

  const refreshRecipes = () => setDisplayedRecipes(filterByAllergy(getRecipes(cuisine, goal)));

  const handleGoalChange = (g) => {
    setGoal(g);
    setDisplayedRecipes(filterByAllergy(getRecipes(cuisine, g)));
  };

  const handleCuisineChange = (c) => {
    setCuisine(c);
    setDisplayedRecipes(filterByAllergy(getRecipes(c, goal)));
  };

  const handleAddToCalendar = () => setAddingToCalendar(true);

  const confirmAddToCalendar = () => {
    const key = `${calendarSelection.date}_${calendarSelection.mealTime}`;
    setCalendar(prev => ({ ...prev, [key]: selectedRecipe }));
    setAddingToCalendar(false);
    setSelectedRecipe(null);
    alert(`「${selectedRecipe.name}」を${calendarSelection.date} ${calendarSelection.mealTime}に追加しました！`);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayMeals = MEAL_TIMES.map(mt => ({ mt, recipe: calendar[`${today}_${mt}`] })).filter(x => x.recipe);

  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  function scaleAmount(amount, base, target) {
    if (!amount) return amount;
    const ratio = target / base;
    return amount.replace(/[\d.]+/g, n => {
      const scaled = parseFloat(n) * ratio;
      return Number.isInteger(scaled) ? scaled : scaled.toFixed(1).replace(/\.0$/, "");
    });
  }

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif", background: "#faf8f3", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: #fff; border-radius: 16px; padding: 16px; margin: 12px 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .btn { border: none; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn:active { transform: scale(0.97); }
        .seg-btn { flex: 1; padding: 8px 4px; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .recipe-card { background: #fff; border-radius: 16px; margin: 0 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.15s; border: 2px solid transparent; overflow: hidden; }
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
        .meal-slot { border-radius: 8px; padding: 6px 10px; font-size: 12px; margin-top: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)", padding: "20px 16px 16px", color: "#fff" }}>
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 2 }}>今日の献立を考える</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>レシピ提案アプリ</div>
      </div>

      {/* Tabs */}
      {tab === "home" && <HomeTab todayMeals={todayMeals} recipes={displayedRecipes} setSelectedRecipe={r => { setSelectedRecipe(r); setServings(2); }} refreshRecipes={refreshRecipes} shoppingList={shoppingList} setTab={setTab} calendar={calendar} setCalendar={setCalendar} pantry={pantry} allRecipePool={allRecipePool} filterByAllergy={filterByAllergy} />}
      {tab === "ingredients" && <IngredientsTab goal={goal} setGoal={handleGoalChange} flavor={flavor} setFlavor={setFlavor} cuisine={cuisine} setCuisine={handleCuisineChange} flavorLabel={flavorLabel} ingredientInput={ingredientInput} setIngredientInput={setIngredientInput} ingredientAmount={ingredientAmount} setIngredientAmount={setIngredientAmount} pantry={pantry} addToPantry={addToPantry} removeFromPantry={removeFromPantry} filteredRecipes={filterByAllergy(filteredByPantry.length > 0 ? filteredByPantry : displayedRecipes)} setSelectedRecipe={r => { setSelectedRecipe(r); setServings(2); }} pantryNames={pantryNames} hasPantry={filteredByPantry.length > 0} allergies={allergies} setShowAllergyModal={setShowAllergyModal} />}
      {tab === "pantry" && <PantryTab pantry={pantry} removeFromPantry={removeFromPantry} filteredRecipes={filterByAllergy(filteredByPantry)} setSelectedRecipe={r => { setSelectedRecipe(r); setServings(2); }} pantryNames={pantryNames} />}
      {tab === "season" && <SeasonTab seasonItems={seasons[currentSeason]} saleItems={saleItems} selectedSeasonItem={selectedSeasonItem} setSelectedSeasonItem={setSelectedSeasonItem} selectedSaleItem={selectedSaleItem} setSelectedSaleItem={setSelectedSaleItem} seasonRecipes={seasonRecipes} saleRecipes={saleRecipes} setSelectedRecipe={r => { setSelectedRecipe(r); setServings(2); }} />}
      {tab === "calendar" && <CalendarTab calendar={calendar} next14Days={next14Days} setCalendarRecipeDetail={setCalendarRecipeDetail} />}
      {tab === "shopping" && <ShoppingListTab shoppingList={shoppingList} setShoppingList={setShoppingList} supermarketOrder={supermarketOrder} />}

      {/* Recipe Modal */}
      {selectedRecipe && !addingToCalendar && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img src={getPhoto(selectedRecipe.name)} alt={selectedRecipe.name} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 16, marginBottom: 16 }} onError={e => { e.target.src = recipePhotos.default; }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedRecipe.name}</div>
              <button onClick={() => setSelectedRecipe(null)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span className="badge" style={{ background: "#fff3ef", color: "#ff6b35" }}>⏱ {selectedRecipe.time}</span>
              <span className="badge" style={{ background: "#f0f7ff", color: "#2196f3" }}>{selectedRecipe.cal}kcal</span>
              <span className="badge" style={{ background: "#f0fff4", color: "#4caf50" }}>{selectedRecipe.storage.method}{selectedRecipe.storage.days > 0 ? `・${selectedRecipe.storage.days}日` : ""}</span>
            </div>
            {/* 人数変更 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, background: "#faf8f3", borderRadius: 12, padding: "8px 12px" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#666" }}>人数</span>
              <button onClick={() => setServings(s => Math.max(1, s - 1))} style={{ background: "#eee", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>-</button>
              <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{servings}</span>
              <button onClick={() => setServings(s => s + 1)} style={{ background: "#eee", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
              <span style={{ fontSize: 13, color: "#888" }}>人分</span>
            </div>
            <div style={{ background: "#fff8f5", borderRadius: 12, padding: 10, marginBottom: 12, fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: "#ff6b35" }}>調味料の目安（{flavorLabel[flavor]}）：</span>{selectedRecipe.condiment[flavor]}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>材料（{servings}人分）</div>
              {selectedRecipe.ingredients.map((ing, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                  <span>{ing.name}{ing.note ? <span style={{ color: "#aaa", fontSize: 11 }}>（{ing.note}）</span> : ""}</span>
                  <span style={{ fontWeight: 600, color: "#ff6b35" }}>{scaleAmount(ing.amount, 2, servings)}</span>
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
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={handleAddToCalendar} style={{ flex: 1, background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 14, padding: "14px" }}>
                献立に追加 ✓
              </button>
              <button className="btn" onClick={() => generateShoppingList(selectedRecipe)} style={{ flex: 1, background: "#fff3ef", color: "#ff6b35", fontSize: 14, padding: "14px", border: "2px solid #ff6b35" }}>
                🛍 買い物リスト
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar selection modal */}
      {selectedRecipe && addingToCalendar && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>いつの献立に追加しますか？</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>食事</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {MEAL_TIMES.map(mt => (
                <button key={mt} className="seg-btn" onClick={() => setCalendarSelection(s => ({ ...s, mealTime: mt }))}
                  style={{ background: calendarSelection.mealTime === mt ? "#ff6b35" : "#f5f5f5", color: calendarSelection.mealTime === mt ? "#fff" : "#555", padding: "10px 0" }}>
                  {mt}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>日付</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {next14Days.map(d => {
                const date = new Date(d + "T00:00:00");
                const label = `${date.getMonth() + 1}/${date.getDate()}`;
                return (
                  <button key={d} onClick={() => setCalendarSelection(s => ({ ...s, date: d }))}
                    style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: calendarSelection.date === d ? "#ff6b35" : "#f5f5f5", color: calendarSelection.date === d ? "#fff" : "#555", fontSize: 12, fontWeight: 700 }}>
                    {label}
                  </button>
                );
              })}
            </div>
            <button className="btn" onClick={confirmAddToCalendar} style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 15, padding: "14px", marginBottom: 10 }}>追加する</button>
            <button className="btn" onClick={() => setAddingToCalendar(false)} style={{ width: "100%", background: "#f5f5f5", color: "#555", fontSize: 14, padding: "12px" }}>戻る</button>
          </div>
        </div>
      )}

      {/* Calendar recipe detail modal */}
      {calendarRecipeDetail && (
        <div className="modal-overlay" onClick={() => setCalendarRecipeDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img src={getPhoto(calendarRecipeDetail.name)} alt={calendarRecipeDetail.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 16, marginBottom: 16 }} onError={e => { e.target.src = recipePhotos.default; }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{calendarRecipeDetail.name}</div>
              <button onClick={() => setCalendarRecipeDetail(null)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span className="badge" style={{ background: "#fff3ef", color: "#ff6b35" }}>⏱ {calendarRecipeDetail.time}</span>
              <span className="badge" style={{ background: "#f0f7ff", color: "#2196f3" }}>{calendarRecipeDetail.cal}kcal</span>
            </div>
            <div style={{ marginBottom: 12 }}>
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
          { id: "ingredients", icon: "🔍", label: "食材入力" },
          { id: "pantry", icon: "📦", label: "パントリー" },
          { id: "season", icon: "🌱", label: "旬・特売" },
          { id: "shopping", icon: "🛍", label: `買い物${shoppingList.length > 0 ? `(${shoppingList.length})` : ""}` },
        ].map(t => (
          <div key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </div>

      {/* Allergy modal */}
      {showAllergyModal && (
        <div className="modal-overlay" onClick={() => setShowAllergyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>アレルギー・苦手食材の設定</div>
              <button onClick={() => setShowAllergyModal(false)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>設定した食材を含むレシピは提案されなくなります</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input type="text" placeholder="例：小麦、ピーマン、えび..." value={allergyInput} onChange={e => setAllergyInput(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addAllergy()} />
              <button className="btn" onClick={addAllergy} style={{ background: "#ff6b35", color: "#fff", padding: "10px 16px" }}>追加</button>
            </div>
            {/* よく使うアレルギー */}
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>よく使う設定</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["小麦","卵","乳製品","えび","かに","そば","落花生","豚肉","鶏肉","ピーマン"].map(a => (
                <button key={a} onClick={() => { if (!allergies.includes(a)) setAllergies(prev => [...prev, a]); }}
                  style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: allergies.includes(a) ? "#ff6b35" : "#f5f5f5", color: allergies.includes(a) ? "#fff" : "#555", fontSize: 12, fontWeight: 700 }}>
                  {allergies.includes(a) ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
            {allergies.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>設定中</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {allergies.map(a => (
                    <span key={a} onClick={() => removeAllergy(a)} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fff0f0", color: "#e53935", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {a} ×
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeTab({ todayMeals, recipes, setSelectedRecipe, refreshRecipes, shoppingList, setTab, calendar, setCalendar, pantry, allRecipePool, filterByAllergy }) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
  const mealColors = { 朝: "#fff8e1", 昼: "#e8f5e9", 夜: "#e3f2fd" };
  const mealTextColors = { 朝: "#f57c00", 昼: "#388e3c", 夜: "#1976d2" };
  const mealIcons = { 朝: "🌅", 昼: "☀️", 夜: "🌙" };

  // 1ヶ月カレンダー
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  // 献立生成モーダル
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planServings, setPlanServings] = useState(2);
  const [planStartDate, setPlanStartDate] = useState(todayStr);
  const [planDays, setPlanDays] = useState(7);
  const [planMeals, setPlanMeals] = useState(["昼", "夜"]);
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePlanMeal = (mt) => setPlanMeals(prev => prev.includes(mt) ? prev.filter(x => x !== mt) : [...prev, mt]);

  const generateWeekPlan = () => {
    setIsGenerating(true);
    const pool = filterByAllergy(allRecipePool);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    let idx = 0;
    const newCal = { ...calendar };
    for (let d = 0; d < planDays; d++) {
      const date = new Date(planStartDate + "T00:00:00");
      date.setDate(date.getDate() + d);
      const dateStr = date.toISOString().split("T")[0];
      for (const mt of planMeals) {
        const key = `${dateStr}_${mt}`;
        if (!newCal[key]) {
          newCal[key] = shuffled[idx % shuffled.length];
          idx++;
        }
      }
    }
    setCalendar(newCal);
    setIsGenerating(false);
    setShowPlanModal(false);
    alert(`${planDays}日分の献立を生成しました！`);
  };

  const next14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <>
      {/* 日付ヘッダー */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#333" }}>
          {today.getMonth() + 1}月{today.getDate()}日（{weekDays[today.getDay()]}）
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{calYear}年</div>
      </div>

      {/* 本日の献立 */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>🍽 今日の献立</div>
          <button onClick={() => setShowPlanModal(true)} style={{ background: "#ff6b35", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            1週間分を生成
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {["朝", "昼", "夜"].map(mt => {
            const recipe = calendar[`${todayStr}_${mt}`];
            return (
              <div key={mt} style={{ background: mealColors[mt], borderRadius: 12, padding: "10px 8px", textAlign: "center", minHeight: 80 }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{mealIcons[mt]}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: mealTextColors[mt], marginBottom: 4 }}>{mt}ごはん</div>
                {recipe ? (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#333", lineHeight: 1.3 }}>{recipe.name}</div>
                ) : (
                  <div style={{ fontSize: 10, color: "#bbb" }}>未登録</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 買い物リストショートカット */}
      {shoppingList.length > 0 && (
        <div onClick={() => setTab("shopping")} style={{ margin: "0 16px", background: "#fff3ef", borderRadius: 14, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", border: "2px solid #ff6b35" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ff6b35" }}>🛍 買い物リスト</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{shoppingList.filter(i => !i.checked).length}品目 未購入</div>
          </div>
          <span style={{ fontSize: 20, color: "#ff6b35" }}>→</span>
        </div>
      )}

      {/* 1ヶ月カレンダー */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#888" }}>‹</button>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{calYear}年{calMonth + 1}月</div>
          <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#888" }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
          {["日","月","火","水","木","金","土"].map((d, i) => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: i === 0 ? "#e53935" : i === 6 ? "#1976d2" : "#888", padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {calCells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === todayStr;
            const hasMeal = ["朝","昼","夜"].some(mt => calendar[`${dateStr}_${mt}`]);
            const dow = (firstDay + day - 1) % 7;
            return (
              <div key={i} style={{ textAlign: "center", padding: "6px 2px", borderRadius: 8, background: isToday ? "#ff6b35" : "transparent", position: "relative" }}>
                <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : dow === 0 ? "#e53935" : dow === 6 ? "#1976d2" : "#333" }}>{day}</div>
                {hasMeal && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isToday ? "#fff" : "#ff6b35", margin: "2px auto 0" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 今後の献立（3日分） */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 10 }}>今後の献立</div>
        {next14.slice(0, 5).map(d => {
          const date = new Date(d + "T00:00:00");
          const meals = ["朝","昼","夜"].map(mt => ({ mt, recipe: calendar[`${d}_${mt}`] })).filter(x => x.recipe);
          if (meals.length === 0) return null;
          return (
            <div key={d} style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", marginBottom: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 6 }}>{date.getMonth() + 1}/{date.getDate()}（{weekDays[date.getDay()]}）</div>
              {meals.map(({ mt, recipe }) => (
                <div key={mt} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: mealTextColors[mt], minWidth: 16 }}>{mt}</span>
                  <span style={{ fontSize: 13, color: "#333" }}>{recipe.name}</span>
                  <span style={{ fontSize: 11, color: "#aaa", marginLeft: "auto" }}>{recipe.cal}kcal</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 献立生成モーダル */}
      {showPlanModal && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>献立を自動生成</div>
              <button onClick={() => setShowPlanModal(false)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>何人前？</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button onClick={() => setPlanServings(s => Math.max(1, s - 1))} style={{ background: "#eee", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>-</button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: "center" }}>{planServings}</span>
              <button onClick={() => setPlanServings(s => s + 1)} style={{ background: "#eee", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>+</button>
              <span style={{ fontSize: 13, color: "#888" }}>人前</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>開始日</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() + i);
                const ds = d.toISOString().split("T")[0];
                const label = i === 0 ? "今日" : `${d.getMonth()+1}/${d.getDate()}`;
                return (
                  <button key={ds} onClick={() => setPlanStartDate(ds)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: planStartDate === ds ? "#ff6b35" : "#f5f5f5", color: planStartDate === ds ? "#fff" : "#555", fontSize: 12, fontWeight: 700 }}>{label}</button>
                );
              })}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>日数</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[3, 5, 7, 14].map(n => (
                <button key={n} onClick={() => setPlanDays(n)} style={{ flex: 1, padding: "8px 0", borderRadius: 12, border: "none", cursor: "pointer", background: planDays === n ? "#ff6b35" : "#f5f5f5", color: planDays === n ? "#fff" : "#555", fontSize: 13, fontWeight: 700 }}>{n}日</button>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>食事</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["朝", "昼", "夜"].map(mt => (
                <button key={mt} onClick={() => togglePlanMeal(mt)} style={{ flex: 1, padding: "8px 0", borderRadius: 12, border: "none", cursor: "pointer", background: planMeals.includes(mt) ? "#ff6b35" : "#f5f5f5", color: planMeals.includes(mt) ? "#fff" : "#555", fontSize: 14, fontWeight: 700 }}>{mt}</button>
              ))}
            </div>
            <button className="btn" onClick={generateWeekPlan} disabled={planMeals.length === 0} style={{ width: "100%", background: planMeals.length === 0 ? "#ccc" : "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 15, padding: "14px" }}>
              {isGenerating ? "生成中..." : `${planDays}日分の献立を生成する`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function IngredientsTab({ goal, setGoal, flavor, setFlavor, cuisine, setCuisine, flavorLabel, ingredientInput, setIngredientInput, ingredientAmount, setIngredientAmount, pantry, addToPantry, removeFromPantry, filteredRecipes, setSelectedRecipe, pantryNames, hasPantry, allergies, setShowAllergyModal }) {
  const goalLabel = { diet: "ダイエット", nutrition: "栄養バランス", budget: "節約", easy: "簡単" };
  return (
    <div style={{ padding: 16 }}>
      {/* アレルギー設定ボタン */}
      <button onClick={() => setShowAllergyModal(true)} style={{ width: "100%", marginBottom: 12, background: allergies.length > 0 ? "#fff0f0" : "#f5f5f5", border: allergies.length > 0 ? "2px solid #e53935" : "2px solid transparent", borderRadius: 14, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: allergies.length > 0 ? "#e53935" : "#555" }}>
            アレルギー・苦手食材設定
          </span>
        </div>
        <span style={{ fontSize: 12, color: allergies.length > 0 ? "#e53935" : "#aaa" }}>
          {allergies.length > 0 ? `${allergies.join("・")} を除外中` : "未設定"}
        </span>
      </button>
      {/* 目的 */}
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>目的を選ぶ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(goalLabel).map(([k, v]) => (
            <button key={k} className="seg-btn" onClick={() => setGoal(k)} style={{ background: goal === k ? "#ff6b35" : "#f5f5f5", color: goal === k ? "#fff" : "#555", padding: "10px 8px" }}>
              {k === "diet" ? "🥗" : k === "nutrition" ? "💪" : k === "budget" ? "💰" : "⚡"} {v}
            </button>
          ))}
        </div>
      </div>
      {/* 味の濃さ */}
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}>味の濃さ</div>
        <div style={{ display: "flex", gap: 6, background: "#f5f5f5", borderRadius: 12, padding: 4 }}>
          {["light", "normal", "rich"].map(f => (
            <button key={f} className="seg-btn" onClick={() => setFlavor(f)} style={{ background: flavor === f ? "#fff" : "transparent", color: flavor === f ? "#ff6b35" : "#888", boxShadow: flavor === f ? "0 1px 6px rgba(0,0,0,0.1)" : "none" }}>
              {flavorLabel[f]}
            </button>
          ))}
        </div>
      </div>
      {/* ジャンル */}
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>ジャンル</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["すべて", "和食", "中華", "洋食", "デザート"].map(c => (
            <button key={c} onClick={() => setCuisine(c)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: cuisine === c ? "#ff6b35" : "#f5f5f5", color: cuisine === c ? "#fff" : "#555", fontSize: 12, fontWeight: 700 }}>{c}</button>
          ))}
        </div>
      </div>
      {/* 食材入力 */}
      <div className="card" style={{ margin: "0 0 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>食材を入力</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input type="text" placeholder="食材名" value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} style={{ flex: 2, minWidth: 0 }} onKeyDown={e => e.key === "Enter" && addToPantry()} />
          <input type="text" placeholder="量" value={ingredientAmount} onChange={e => setIngredientAmount(e.target.value)} style={{ flex: 1, minWidth: 0 }} onKeyDown={e => e.key === "Enter" && addToPantry()} />
        </div>
        <button className="btn" onClick={addToPantry} style={{ width: "100%", background: "linear-gradient(135deg, #ff6b35, #f7931e)", color: "#fff", fontSize: 14 }}>追加する</button>
      </div>
      {pantry.length > 0 && (
        <div className="card" style={{ margin: "0 0 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 8 }}>登録済み食材（タップで削除）</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {pantry.map(item => <span key={item.name} className="pantry-tag" onClick={() => removeFromPantry(item.name)}>{item.name}{item.amount ? `・${item.amount}` : ""} ×</span>)}
          </div>
        </div>
      )}
      <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>
        {hasPantry ? "この食材を使ったレシピ（マッチ度順）" : "おすすめレシピ"}
      </div>
      {filteredRecipes.map((r, i) => (
        <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
          <img src={getPhoto(r.name)} alt={r.name} style={{ width: "100%", height: 100, objectFit: "cover" }} onError={e => { e.target.src = recipePhotos.default; }} />
          <div style={{ padding: "10px 14px 12px" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
            {hasPantry && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                {r.ingredients.slice(0, 5).map(ing => (
                  <span key={ing.name} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: ingredientMatches(ing.name, pantryNames) ? "#fff3ef" : "#f5f5f5", color: ingredientMatches(ing.name, pantryNames) ? "#c0622b" : "#aaa" }}>{ing.name}</span>
                ))}
              </div>
            )}
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>⏱ {r.time} · {r.cal}kcal</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PantryTab({ pantry, removeFromPantry, filteredRecipes, setSelectedRecipe, pantryNames }) {
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
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>パントリーの食材で作れる献立</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>（調味料は除いてマッチ度順に表示）</div>
          {filteredRecipes.length > 0 ? filteredRecipes.map((r, i) => (
            <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
              <img src={getPhoto(r.name)} alt={r.name} style={{ width: "100%", height: 100, objectFit: "cover" }} onError={e => { e.target.src = recipePhotos.default; }} />
              <div style={{ padding: "10px 14px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                  <span style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700 }}>{r.matched}/{r.total}食材</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {r.ingredients.slice(0, 5).map(ing => (
                    <span key={ing.name} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: ingredientMatches(ing.name, pantryNames) ? "#fff3ef" : "#f5f5f5", color: ingredientMatches(ing.name, pantryNames) ? "#c0622b" : "#aaa" }}>{ing.name}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>⏱ {r.time} · {r.cal}kcal</div>
              </div>
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
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>「{selectedSeasonItem.name}」のレシピ（5種類）</div>
              {(seasonRecipes[selectedSeasonItem.name] || []).map((r, i) => (
                <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>⏱ {r.time} · {r.cal}kcal · {r.storage.method}</div>
                  </div>
                </div>
              ))}
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
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>「{selectedSaleItem.name}」のレシピ（5種類）</div>
              {(saleRecipes[selectedSaleItem.name] || []).map((r, i) => (
                <div key={i} className="recipe-card" onClick={() => setSelectedRecipe(r)}>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>⏱ {r.time} · {r.cal}kcal · {r.storage.method}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

function ShoppingListTab({ shoppingList, setShoppingList, supermarketOrder }) {
  const toggleCheck = (name) => {
    setShoppingList(prev => prev.map(i => i.name === name ? { ...i, checked: !i.checked } : i));
  };
  const removeItem = (name) => setShoppingList(prev => prev.filter(i => i.name !== name));
  const clearChecked = () => setShoppingList(prev => prev.filter(i => !i.checked));

  const grouped = supermarketOrder.reduce((acc, cat) => {
    const items = shoppingList.filter(i => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const uncheckedCount = shoppingList.filter(i => !i.checked).length;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>買い物リスト</div>
        </div>
        {shoppingList.some(i => i.checked) && (
          <button onClick={clearChecked} style={{ background: "#f5f5f5", border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#888", cursor: "pointer" }}>
            購入済みを削除
          </button>
        )}
      </div>

      {shoppingList.length === 0 ? (
        <div className="card" style={{ margin: 0, textAlign: "center", color: "#888", fontSize: 14, padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🛍</div>
          レシピの詳細画面から<br />「買い物リスト」ボタンで追加できます
        </div>
      ) : (
        <>
          <div style={{ background: "#fff3ef", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ff6b35" }}>残り {uncheckedCount}品目</span>
            <span style={{ fontSize: 13, color: "#888" }}>計 {shoppingList.length}品目</span>
          </div>

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 8, paddingLeft: 4 }}>
                {cat === "野菜・果物" ? "🥦" : cat === "肉・魚" ? "🥩" : cat === "豆腐・卵・乳製品" ? "🥚" : cat === "乾物・缶詰" ? "🫙" : cat === "調味料" ? "🧂" : "📦"} {cat}
              </div>
              {items.map(item => (
                <div key={item.name} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", opacity: item.checked ? 0.5 : 1 }}>
                  <div onClick={() => toggleCheck(item.name)} style={{ width: 24, height: 24, borderRadius: "50%", border: item.checked ? "none" : "2px solid #ddd", background: item.checked ? "#ff6b35" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    {item.checked && <span style={{ color: "#fff", fontSize: 14 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, textDecoration: item.checked ? "line-through" : "none", color: item.checked ? "#aaa" : "#333" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{item.amount}{item.fromRecipe ? ` · ${item.fromRecipe}` : ""}</div>
                  </div>
                  <button onClick={() => removeItem(item.name)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18, padding: "0 4px" }}>×</button>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function CalendarTab({ calendar, next14Days, setCalendarRecipeDetail }) {
  const mealColors = { 朝: "#fff8e1", 昼: "#e8f5e9", 夜: "#e3f2fd" };
  const mealTextColors = { 朝: "#f57c00", 昼: "#388e3c", 夜: "#1976d2" };
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>献立カレンダー</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>メニュー名をタップするとレシピが見られます</div>
      {next14Days.map((d, i) => {
        const date = new Date(d + "T00:00:00");
        const isToday = i === 0;
        const dayMeals = MEAL_TIMES.map(mt => ({ mt, recipe: calendar[`${d}_${mt}`] })).filter(x => x.recipe);
        return (
          <div key={d} style={{ background: isToday ? "#fff8f5" : "#fff", border: isToday ? "2px solid #ff6b35" : "2px solid #f0f0f0", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? "#ff6b35" : "#333", marginBottom: dayMeals.length > 0 ? 6 : 0 }}>
              {isToday ? "今日 " : ""}{date.getMonth() + 1}/{date.getDate()}（{["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}）
              {dayMeals.length === 0 && <span style={{ fontSize: 11, color: "#ccc", fontWeight: 400, marginLeft: 8 }}>未登録</span>}
            </div>
            {dayMeals.map(({ mt, recipe }) => (
              <div key={mt} className="meal-slot" onClick={() => setCalendarRecipeDetail(recipe)} style={{ background: mealColors[mt] }}>
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
