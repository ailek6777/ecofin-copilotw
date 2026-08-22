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
