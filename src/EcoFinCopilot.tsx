import React, { useState, useMemo } from "react";
import { Droplets, Zap, Wallet, Send, Home, School, Store, Plus, Trash2, Loader2, Sprout, Globe, Coins } from "lucide-react";

// ---- Very rough KZ reference values (placeholders for MVP demo) ----
const TARIFF = { elec: 25, water: 150 }; // KZT per kWh / m3, approximate

const BENCHMARKS = {
  home: { elecPerUnit: 120, waterPerUnit: 3.5 },
  school: { elecPerUnit: 6, waterPerUnit: 0.4 },
  business: { elecPerUnit: 18, waterPerUnit: 0.6 },
};

const LANGUAGES = [
  { code: "ru", label: "Рус" },
  { code: "kz", label: "Қаз" },
  { code: "en", label: "Eng" },
  { code: "tr", label: "Tür" },
  { code: "zh", label: "中文" },
  { code: "uz", label: "O'z" },
];

const CURRENCIES = [
  { code: "KZT", symbol: "₸", kztPerUnit: 1, locale: "ru-RU" },
  { code: "USD", symbol: "$", kztPerUnit: 480, locale: "en-US" },
  { code: "EUR", symbol: "€", kztPerUnit: 520, locale: "de-DE" },
  { code: "RUB", symbol: "₽", kztPerUnit: 5.3, locale: "ru-RU" },
  { code: "GBP", symbol: "£", kztPerUnit: 610, locale: "en-GB" },
  { code: "CNY", symbol: "¥", kztPerUnit: 66, locale: "zh-CN" },
  { code: "TRY", symbol: "₺", kztPerUnit: 14, locale: "tr-TR" },
];

const STRINGS = {
  ru: {
    appName: "EcoFin Copilot",
    changeProfile: "Сменить профиль",
    whoAreYou: "Кто вы?",
    weakMvp: "Небольшой MVP — выберите профиль, чтобы увидеть демо-анализ.",
    profiles: {
      home: { title: "Дом", blurb: "Счётчики воды и света для семьи" },
      school: { title: "Школа", blurb: "Мониторинг ресурсов здания" },
      business: { title: "Бизнес", blurb: "Аудит расходов малого предприятия" },
    },
    units: { home: "человек в доме", school: "м² площади", business: "м² площади" },
    monthPrefix: "М",
    consumptionData: "Данные потребления",
    addMonth: "Добавить месяц",
    kwh: "кВт·ч",
    m3: "м³",
    elecVsNorm: "Электричество vs норма",
    waterVsNorm: "Вода vs норма",
    savingLabel: "потенциальная экономия / мес (ориентировочно)",
    elecChartTitle: "ЭЛЕКТРИЧЕСТВО, кВт·ч",
    waterChartTitle: "ВОДА, м³",
    aiRecs: "AI-рекомендации",
    askAi: "Спросить AI-помощника",
    collapse: "свернуть",
    open: "открыть",
    chatExample: "Например: «Как сократить расход воды на кухне?»",
    chatPlaceholder: "Задайте вопрос про экономию ресурсов...",
    thinking: "думает...",
    chatError: "Ошибка запроса к AI. Попробуйте ещё раз.",
    aiSystemHint: "Ты — ассистент EcoFin по ресурсосбережению в Казахстане. Отвечай кратко, дружелюбно, на русском, с конкретными практичными советами.",
    recs: {
      elec_over: [
        "Замените лампы накаливания на LED — экономия до 80% на освещении.",
        "Проверьте старую технику: холодильники и кондиционеры старше 10 лет часто съедают на 30% больше энергии.",
        "Настройте автоматическое отключение освещения в пустых помещениях.",
      ],
      water_over: [
        "Установите аэраторы на краны — снижают расход воды на 20-30% без потери напора.",
        "Проверьте сантехнику на утечки: капающий кран теряет до 3 м³ в месяц.",
        "Соберите дождевую воду для полива вместо использования водопровода.",
      ],
      ok: [
        "Ваше потребление в пределах нормы — держите текущие привычки.",
        "Попробуйте вести журнал пиковых часов, чтобы найти ещё 5-10% экономии.",
      ],
    },
  },
  kz: {
    appName: "EcoFin Copilot",
    changeProfile: "Профильді ауыстыру",
    whoAreYou: "Сіз кімсіз?",
    weakMvp: "Шағын MVP — демо-талдауды көру үшін профильді таңдаңыз.",
    profiles: {
      home: { title: "Үй", blurb: "Отбасыға арналған су және жарық есептегіштері" },
      school: { title: "Мектеп", blurb: "Ғимарат ресурстарын бақылау" },
      business: { title: "Бизнес", blurb: "Шағын кәсіпорын шығындарын аудиттеу" },
    },
    units: { home: "үйдегі адам саны", school: "м² алаң", business: "м² алаң" },
    monthPrefix: "Ай",
    consumptionData: "Тұтыну деректері",
    addMonth: "Ай қосу",
    kwh: "кВт·сағ",
    m3: "м³",
    elecVsNorm: "Электр энергиясы vs норма",
    waterVsNorm: "Су vs норма",
savingLabel: "болжамды үнемдеу / айына (шамамен)",
    elecChartTitle: "ЭЛЕКТР ЭНЕРГИЯСЫ, кВт·сағ",
    waterChartTitle: "СУ, м³",
    aiRecs: "AI-ұсыныстар",
    askAi: "AI-көмекшіден сұрау",
    collapse: "жию",
    open: "ашу",
    chatExample: "Мысалы: «Ас үйде су шығынын қалай азайтуға болады?»",
    chatPlaceholder: "Ресурстарды үнемдеу туралы сұрақ қойыңыз...",
    thinking: "ойлануда...",
    chatError: "AI сұранысында қате. Қайта көріңіз.",
    aiSystemHint: "Сен — Қазақстандағы ресурстарды үнемдеу бойынша EcoFin көмекшісісің. Қысқа, достық үнмен, қазақ тілінде, нақты пайдалы кеңестермен жауап бер.",
    recs: {
      elec_over: [
        "Қызу шамдарды LED-ке ауыстырыңыз — жарықтандыруда 80%-ға дейін үнемдеу.",
        "Ескі техниканы тексеріңіз: 10 жылдан асқан тоңазытқыштар мен кондиционерлер 30%-ға көп энергия жұмсайды.",
        "Бос бөлмелерде жарықты автоматты өшіруді баптаңыз.",
      ],
      water_over: [
        "Крандарға аэраторлар орнатыңыз — қысымды жоғалтпай су шығынын 20-30%-ға азайтады.",
        "Сантехниканы ағуға тексеріңіз: тамшылап аққан кран айына 3 м³-ге дейін жоғалтады.",
        "Суару үшін су құбыры орнына жаңбыр суын жинаңыз.",
      ],
      ok: [
        "Тұтынуыңыз норма шегінде — қазіргі әдеттерді сақтаңыз.",
        "Тағы 5-10% үнемдеу табу үшін шыңдалу сағаттарының журналын жүргізіп көріңіз.",
      ],
    },
  },
  en: {
    appName: "EcoFin Copilot",
    changeProfile: "Change profile",
    whoAreYou: "Who are you?",
    weakMvp: "A small MVP — pick a profile to see the demo analysis.",
    profiles: {
      home: { title: "Home", blurb: "Water and power meters for a family" },
      school: { title: "School", blurb: "Monitoring a building's resources" },
      business: { title: "Business", blurb: "Expense audit for a small business" },
    },
    units: { home: "people at home", school: "m² of floor area", business: "m² of floor area" },
    monthPrefix: "M",
    consumptionData: "Consumption data",
    addMonth: "Add month",
    kwh: "kWh",
    m3: "m³",
    elecVsNorm: "Electricity vs norm",
    waterVsNorm: "Water vs norm",
    savingLabel: "potential saving / month (estimate)",
    elecChartTitle: "ELECTRICITY, kWh",
    waterChartTitle: "WATER, m³",
    aiRecs: "AI recommendations",
    askAi: "Ask the AI assistant",
    collapse: "collapse",
    open: "open",
    chatExample: "For example: \u201cHow can I cut water use in the kitchen?\u201d",
    chatPlaceholder: "Ask a question about saving resources...",
    thinking: "thinking...",
    chatError: "AI request failed. Please try again.",
    aiSystemHint: "You are the EcoFin resource-saving assistant for Kazakhstan. Reply briefly and warmly, in English, with specific practical advice.",
    recs: {
      elec_over: [
        "Swap incandescent bulbs for LEDs — up to 80% savings on lighting.",
        "Check older appliances: fridges and AC units over 10 years old often use 30% more energy.",
        "Set up automatic light shut-off for empty rooms.",
      ],
      water_over: [
        "Fit tap aerators — they cut water use by 20-30% without losing pressure.",
        "Check plumbing for leaks: a dripping tap can waste up to 3 m³ a month.",
        "Collect rainwater for watering instead of using the mains.",
      ],
      ok: [
        "Your consumption is within the norm — keep up the current habits.",
        "Try logging peak hours to find another 5-10% in savings.",
      ],
    },
  },
tr: {
    appName: "EcoFin Copilot",
    changeProfile: "Profili değiştir",
    whoAreYou: "Siz kimsiniz?",
    weakMvp: "Küçük bir MVP — demo analizini görmek için bir profil seçin.",
    profiles: {
      home: { title: "Ev", blurb: "Aile için su ve elektrik sayaçları" },
      school: { title: "Okul", blurb: "Bina kaynaklarının izlenmesi" },
      business: { title: "İşletme", blurb: "Küçük işletme gider denetimi" },
    },
    units: { home: "evdeki kişi sayısı", school: "m² alan", business: "m² alan" },
    monthPrefix: "A",
    consumptionData: "Tüketim verileri",
    addMonth: "Ay ekle",
    kwh: "kWh",
    m3: "m³",
    elecVsNorm: "Elektrik vs norm",
    waterVsNorm: "Su vs norm",
    savingLabel: "aylık potansiyel tasarruf (tahmini)",
    elecChartTitle: "ELEKTRİK, kWh",
    waterChartTitle: "SU, m³",
    aiRecs: "AI önerileri",
    askAi: "AI asistanına sor",
    collapse: "daralt",
    open: "aç",
    chatExample: "Örnek: «Mutfakta su tüketimini nasıl azaltabilirim?»",
    chatPlaceholder: "Kaynak tasarrufu hakkında soru sorun...",
    thinking: "düşünüyor...",
    chatError: "AI isteğinde hata. Tekrar deneyin.",
    aiSystemHint: "Sen Kazakistan'da kaynak tasarrufu konusunda EcoFin asistanısın. Kısa, samimi ve Türkçe, somut pratik tavsiyelerle yanıt ver.",
    recs: {
      elec_over: [
        "Akkor lambaları LED ile değiştirin — aydınlatmada %80'e varan tasarruf.",
        "Eski cihazları kontrol edin: 10 yaşından büyük buzdolapları ve klimalar %30 daha fazla enerji harcayabilir.",
        "Boş odalarda otomatik ışık kapatma ayarlayın.",
      ],
      water_over: [
        "Musluklara hava karıştırıcı takın — basınç kaybı olmadan su tüketimini %20-30 azaltır.",
        "Tesisatı sızıntılara karşı kontrol edin: damlayan bir musluk ayda 3 m³'e kadar israf edebilir.",
        "Sulama için şebeke suyu yerine yağmur suyu toplayın.",
      ],
      ok: [
        "Tüketiminiz norm dahilinde — mevcut alışkanlıklarınızı sürdürün.",
        "Ek %5-10 tasarruf için yoğun saatleri kaydetmeyi deneyin.",
      ],
    },
  },
  zh: {
    appName: "EcoFin Copilot",
    changeProfile: "更换角色",
    whoAreYou: "您是谁？",
    weakMvp: "一个小型 MVP —— 选择一个角色以查看演示分析。",
    profiles: {
      home: { title: "家庭", blurb: "家庭用水电表" },
      school: { title: "学校", blurb: "建筑资源监控" },
      business: { title: "企业", blurb: "小型企业费用审计" },
    },
    units: { home: "家庭人数", school: "平方米面积", business: "平方米面积" },
    monthPrefix: "月",
    consumptionData: "消耗数据",
    addMonth: "添加月份",
    kwh: "千瓦时",
    m3: "立方米",
    elecVsNorm: "用电量 vs 标准",
    waterVsNorm: "用水量 vs 标准",
    savingLabel: "每月潜在节省（估算）",
    elecChartTitle: "用电量，千瓦时",
    waterChartTitle: "用水量，立方米",
    aiRecs: "AI 建议",
    askAi: "咨询 AI 助手",
    collapse: "收起",
    open: "展开",
    chatExample: "例如：「如何减少厨房用水？」",
    chatPlaceholder: "询问关于节约资源的问题...",
    thinking: "思考中...",
    chatError: "AI 请求出错，请重试。",
    aiSystemHint: "你是哈萨克斯坦的 EcoFin 节约资源助手。请用中文简洁友好地回答，并给出具体实用的建议。",
    recs: {
      elec_over: [
        "将白炽灯换成 LED 灯 —— 照明可节省高达 80%。",
        "检查老旧电器：超过 10 年的冰箱和空调通常多耗能 30%。",
        "为空房间设置自动关灯。",
      ],
      water_over: [
        "在水龙头上安装起泡器 —— 在不降低水压的情况下减少 20-30% 的用水量。",
        "检查管道是否漏水：滴水的水龙头每月可能浪费多达 3 立方米的水。",
        "收集雨水用于浇灌，而不是使用自来水。",
      ],
      ok: [
        "您的消耗量在标准范围内 —— 请保持当前习惯。",
        "尝试记录用电高峰时段，以再节省 5-10%。",
      ],
    },
  },
  uz: {
    appName: "EcoFin Copilot",
    changeProfile: "Profilni almashtirish",
    whoAreYou: "Siz kimsiz?",
    weakMvp: "Kichik MVP — demo tahlilni ko'rish uchun profil tanlang.",
    profiles: {
      home: { title: "Uy", blurb: "Oila uchun suv va elektr hisoblagichlari" },
      school: { title: "Maktab", blurb: "Bino resurslarini kuzatish" },
      business: { title: "Biznes", blurb: "Kichik korxona xarajatlari auditi" },
    },
    units: { home: "uydagi odamlar soni", school: "m² maydon", business: "m² maydon" },
    monthPrefix: "O",
    consumptionData: "Iste'mol ma'lumotlari",
    addMonth: "Oy qo'shish",
    kwh: "kVt·soat",
    m3: "m³",
    elecVsNorm: "Elektr energiyasi vs norma",
    waterVsNorm: "Suv vs norma",
    savingLabel: "oyiga potentsial tejash (taxminiy)",
    elecChartTitle: "ELEKTR ENERGIYASI, kVt·soat",
    waterChartTitle: "SUV, m³",
    aiRecs: "AI tavsiyalari",
    askAi: "AI yordamchisidan so'rash",
    collapse: "yig'ish",
    open: "ochish",
    chatExample: "Masalan: «Oshxonada suv sarfini qanday kamaytirish mumkin?»",
    chatPlaceholder: "Resurslarni tejash haqida savol bering...",
    thinking: "o'ylamoqda...",
    chatError: "AI so'roviga xato. Qayta urinib ko'ring.",
    aiSystemHint: "Siz Qozog'istonda resurslarni tejash bo'yicha EcoFin yordamchisisiz. Qisqa, do'stona, o'zbek tilida, aniq amaliy maslahatlar bilan javob bering.",
    recs: {
      elec_over: [
        "Cho'g'lanma lampalarni LED bilan almashtiring — yoritishda 80%gacha tejash.",
        "Eski texnikani tekshiring: 10 yildan oshgan muzlatgichlar va konditsionerlar ko'pincha 30% ko'proq energiya sarflaydi.",
        "Bo'sh xonalarda yorug'likni avtomatik o'chirishni sozlang.",
      ],
      water_over: [
        "Kranlarga aeratorlar o'rnating — bosimni yo'qotmasdan suv sarfini 20-30% kamaytiradi.",
        "Santexnikani oqishlarga tekshiring: tomchilayotgan kran oyiga 3 m³gacha yo'qotadi.",
        "Sug'orish uchun suv tarmog'i o'rniga yomg'ir suvini yig'ing.",
      ],
      ok: [
        "Sizning iste'molingiz norma doirasida — hozirgi odatlaringizni saqlang.",
        "Yana 5-10% tejash topish uchun eng yuqori soatlar jurnalini yuritib ko'ring.",
      ],
    },
  },
};

function genRecommendations(t, elecStatus, waterStatus) {
  const list = [];
  list.push(...(elecStatus === "over" ? t.recs.elec_over : []));
  list.push(...(waterStatus === "over" ? t.recs.water_over : []));
  if (list.length === 0) list.push(...t.recs.ok);
  return list.slice(0, 4);
}

function formatMoney(amountKzt, currency) {
  const c = CURRENCIES.find((x) => x.code === currency) || CURRENCIES[0];
  const value = Math.round(amountKzt / c.kztPerUnit);
  return `${value.toLocaleString(c.locale)} ${c.symbol}`;
}

function MiniBarChart({ data, colorClass }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="text-[11px] font-mono text-[#7C8579]">{d.value}</div>
          <div
            className={`w-full rounded-t-sm ${colorClass}`}
            style={{ height: `${Math.max((d.value / max) * 80, 4)}px` }}
          />
          <div className="text-[11px] text-[#8A9089]">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function Gauge({ pct, label, over }) {
  const clamped = Math.min(Math.max(pct, 0), 160);
  const r = 40, c = 2 * Math.PI * r;
  const frac = Math.min(clamped / 160, 1);
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EFE9DA" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={over ? "#C98A2B" : "#4F8F52"}
          strokeWidth="9"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" fontSize="18" fill="#26362E" fontFamily="monospace">
          {Math.round(pct)}%
        </text>
      </svg>
      <div className="text-sm text-[#6B756B] mt-1 text-center">{label}</div>
    </div>
  );
}

export default function EcoFinCopilot() {
  const [lang, setLang] = useState("ru");
  const [currency, setCurrency] = useState("KZT");
  const [profile, setProfile] = useState(null);
  const [unitCount, setUnitCount] = useState(4);
  const [months, setMonths] = useState([
    { label: "1", elec: 320, water: 14 },
    { label: "2", elec: 340, water: 16 },
    { label: "3", elec: 360, water: 18 },
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const t = STRINGS[lang];
  const PROFILES = [
    { id: "home", icon: Home, ...t.profiles.home },
    { id: "school", icon: School, ...t.profiles.school },
    { id: "business", icon: Store, ...t.profiles.business },
  ];

  const bench = profile ? BENCHMARKS[profile] : null;
  const unitLabel = profile ? t.units[profile] : "";

  const avgElec = useMemo(() => months.reduce((s, m) => s + Number(m.elec || 0), 0) / months.length, [months]);
  const avgWater = useMemo(() => months.reduce((s, m) => s + Number(m.water || 0), 0) / months.length, [months]);

  const expectedElec = bench ? bench.elecPerUnit * unitCount : 0;
  const expectedWater = bench ? bench.waterPerUnit * unitCount : 0;

  const elecPct = expectedElec ? (avgElec / expectedElec) * 100 : 0;
  const waterPct = expectedWater ? (avgWater / expectedWater) * 100 : 0;
  const elecStatus = elecPct > 110 ? "over" : "ok";
  const waterStatus = waterPct > 110 ? "over" : "ok";

  const potentialSavingKzt = Math.round(
    Math.max(avgElec - expectedElec, 0) * TARIFF.elec +
    Math.max(avgWater - expectedWater, 0) * TARIFF.water
  );

  const recommendations = genRecommendations(t, elecStatus, waterStatus);

  function updateMonth(i, field, value) {
    setMonths((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  }
  function addMonth() {
    setMonths((prev) => [...prev, { label: `${t.monthPrefix}${prev.length + 1}`, elec: 0, water: 0 }]);
  }
  function removeMonth(i) {
    setMonths((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    const newMsgs = [...chatMsgs, { role: "user", text: userMsg }];
    setChatMsgs(newMsgs);
    setChatInput("");
    setChatLoading(true);
    try {
      const context = `User profile: ${profile}. Average electricity: ${avgElec.toFixed(
        1
      )} kWh/month (norm ~${expectedElec.toFixed(1)}). Average water: ${avgWater.toFixed(
        1
      )} m3/month (norm ~${expectedWater.toFixed(1)}). Electricity status: ${elecStatus}, water status: ${waterStatus}.`;
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${t.aiSystemHint} User context: ${context}\n\nUser question: ${userMsg}`,
        }),
      });
      const data = await response.json();
      const text = data?.content?.map((b) => (b.type === "text" ? b.text : "")).join("\n") || t.chatError;
      setChatMsgs((prev) => [...prev, { role: "ai", text }]);
    } catch (e) {
      setChatMsgs((prev) => [...prev, { role: "ai", text: t.chatError }]);
      setChatMsgs((prev) => [...prev, { role: "ai", text: t.chatError }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ background: "#FFFDF7", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono2 { font-family: 'IBM Plex Mono', monospace; }
        select.efc-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0l5 6 5-6z' fill='%236B756B'/></svg>");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
      `}</style>

      <div className="border-b border-[#EFE9DA] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sprout size={24} className="text-[#4F8F52]" />
          <span className="font-display text-[#26362E] text-xl tracking-tight">{t.appName}</span>
        </div>

        <div className="flex items-center gap-4">
          {profile && (
            <button
              onClick={() => setProfile(null)}
              className="text-sm text-[#6B756B] hover:text-[#26362E] font-mono2 uppercase tracking-wide"
            >
              {t.changeProfile}
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-[#EAE2CC] rounded-full pl-2.5 pr-1.5 py-1">
              <Globe size={14} className="text-[#6B756B]" />
              <select
                aria-label="Language"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="efc-select bg-transparent text-sm text-[#26362E] pr-4 py-0.5 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="w-px h-5 bg-[#EAE2CC]" />

            <div className="flex items-center gap-1.5 bg-white border border-[#EAE2CC] rounded-full pl-2.5 pr-1.5 py-1">
              <Coins size={14} className="text-[#6B756B]" />
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="efc-select bg-transparent text-sm text-[#26362E] pr-4 py-0.5 focus:outline-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {!profile ? (
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="font-display text-[#26362E] text-3xl mb-2">{t.whoAreYou}</h1>
          <p className="text-[#6B756B] mb-10 text-base">{t.weakMvp}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setProfile(p.id)}
                className="text-left p-6 rounded-lg border border-[#EFE9DA] bg-white hover:border-[#4F8F52] hover:shadow-sm transition-all group"
              >
                <p.icon size={26} className="text-[#C98A2B] mb-3 group-hover:text-[#4F8F52] transition-colors" />
                <div className="font-display text-[#26362E] text-lg mb-1">{p.title}</div>
                <div className="text-[#6B756B] text-sm">{p.blurb}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          <div className="bg-white border border-[#EFE9DA] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="font-display text-[#26362E] text-lg">{t.consumptionData}</h2>
              <div className="flex items-center gap-2 text-sm text-[#6B756B]">
                <span>{unitLabel}:</span>
                <input
                  type="number"
                  value={unitCount}
                  onChange={(e) => setUnitCount(Number(e.target.value))}
                  className="w-16 bg-[#FFFCF5] border border-[#E7DFCB] rounded px-2 py-1.5 text-[#26362E] font-mono2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              {months.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={m.label}
                    onChange={(e) => updateMonth(i, "label", e.target.value)}
                    className="w-16 bg-[#FFFCF5] border border-[#E7DFCB] rounded px-2 py-1.5 text-[#26362E] text-sm"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    <Zap size={15} className="text-[#C98A2B]" />
                    <input
                      type="number"
                      value={m.elec}
                      onChange={(e) => updateMonth(i, "elec", e.target.value)}
                      className="w-full bg-[#FFFCF5] border border-[#E7DFCB] rounded px-2 py-1.5 text-[#26362E] font-mono2 text-sm"
                    />
                    <span className="text-xs text-[#8A9089]">{t.kwh}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    <Droplets size={15} className="text-[#2D7C93]" />
                    <input
                      type="number"
                      value={m.water}
                      onChange={(e) => updateMonth(i, "water", e.target.value)}
                      className="w-full bg-[#FFFCF5] border border-[#E7DFCB] rounded px-2 py-1.5 text-[#26362E] font-mono2 text-sm"
                    />
                    <span className="text-xs text-[#8A9089]">{t.m3}</span>
                  </div>
                  <button onClick={() => removeMonth(i)} className="text-[#B7B09A] hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addMonth}
              className="mt-3 flex items-center gap-1 text-sm text-[#4F8F52] hover:text-[#3E7541] font-medium"
            >
              <Plus size={15} /> {t.addMonth}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#EFE9DA] rounded-lg p-6 flex flex-col items-center">
              <Gauge pct={elecPct} label={t.elecVsNorm} over={elecStatus === "over"} />
            </div>
            <div className="bg-white border border-[#EFE9DA] rounded-lg p-6 flex flex-col items-center">
              <Gauge pct={waterPct} label={t.waterVsNorm} over={waterStatus === "over"} />
            </div>
            <div className="bg-white border border-[#EFE9DA] rounded-lg p-6 flex flex-col justify-center items-center">
              <Wallet size={22} className="text-[#C98A2B] mb-2" />
              <div className="font-mono2 text-2xl text-[#26362E]">{formatMoney(potentialSavingKzt, currency)}</div>
              <div className="text-sm text-[#6B756B] mt-1 text-center">{t.savingLabel}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#EFE9DA] rounded-lg p-6">
              <div className="text-xs text-[#8A9089] mb-2 font-mono2 tracking-wide">{t.elecChartTitle}</div>
              <MiniBarChart data={months.map((m) => ({ label: m.label, value: Number(m.elec) || 0 }))} colorClass="bg-[#C98A2B]" />
            </div>
            <div className="bg-white border border-[#EFE9DA] rounded-lg p-6">
              <div className="text-xs text-[#8A9089] mb-2 font-mono2 tracking-wide">{t.waterChartTitle}</div>
              <MiniBarChart data={months.map((m) => ({ label: m.label, value: Number(m.water) || 0 }))} colorClass="bg-[#2D7C93]" />
            </div>
          </div>

          <div className="bg-white border border-[#EFE9DA] rounded-lg p-6">
            <h2 className="font-display text-[#26362E] text-lg mb-3">{t.aiRecs}</h2>
            <ul className="space-y-2">
              {recommendations.map((r, i) => (
                <li key={i} className="text-sm text-[#3F4A42] flex gap-2">
                  <span className="text-[#4F8F52] mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#EFE9DA] rounded-lg overflow-hidden">
            <button
              onClick={() => setChatOpen((v) => !v)}
              className="w-full text-left px-6 py-4 font-display text-[#26362E] text-lg flex items-center justify-between"
            >
              {t.askAi}
              <span className="text-xs text-[#8A9089] font-mono2">{chatOpen ? t.collapse : t.open}</span>
            </button>
            {chatOpen && (
              <div className="px-6 pb-6">
                <div className="space-y-2 max-h-56 overflow-y-auto mb-3">
                  {chatMsgs.length === 0 && (
                    <div className="text-sm text-[#8A9089]">{t.chatExample}</div>
                  )}
                  {chatMsgs.map((m, i) => (
                    <div
                      key={i}
                      className={`text-sm rounded px-3 py-2 ${
                        m.role === "user" ? "bg-[#F8F5EC] text-[#3F4A42] ml-8" : "bg-[#E7F0E3] text-[#26362E] mr-8"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-2 text-sm text-[#8A9089] mr-8">
                      <Loader2 size={14} className="animate-spin" /> {t.thinking}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder={t.chatPlaceholder}
                    className="flex-1 bg-[#FFFCF5] border border-[#E7DFCB] rounded px-3 py-2.5 text-sm text-[#26362E] placeholder-[#B7B09A]"
                  />
                  <button
                    onClick={sendChat}
                    disabled={chatLoading}
                    className="bg-[#4F8F52] text-white rounded px-4 py-2.5 disabled:opacity-50 hover:bg-[#3E7541] transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
