import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Minimal translation resources — the platform is structured for i18n.
// Additional keys are added progressively; missing keys fall back to French.
const resources = {
  fr: {
    translation: {
      nav: { home: "Accueil", projects: "Projets", ecosystem: "Écosystème", about: "À propos", process: "Processus", premium: "Premium", signIn: "Connexion", join: "Rejoindre" },
      cta: { discover: "Découvrir", explore: "Explorer", invest: "Investir", seeProjects: "Voir les projets", createAccount: "Créer un compte" },
      hero: {
        badge: "L'écosystème panafricain de l'entrepreneuriat",
        title1: "Investissez dans l'Afrique",
        title2: "qui se construit.",
        subtitle: "MiPROJET connecte investisseurs et projets certifiés à travers un écosystème structuré : du terrain à la structuration, jusqu'au capital.",
      },
      universe: {
        title: "Quatre univers, une seule ambition",
        subtitle: "Un parcours continu pour l'entrepreneuriat africain.",
        miprojet: { name: "MiPROJET", tag: "Écosystème", desc: "La marque mère : vision, gouvernance et standards." },
        go: { name: "MiPROJET Go", tag: "Terrain", desc: "Micro-activités et entrepreneuriat informel accompagnés." },
        plus: { name: "MiPROJET+", tag: "Structuration", desc: "PME certifiées, gouvernance formalisée, modèle prouvé." },
        invest: { name: "MiPROJET Invest", tag: "Capital", desc: "Opportunités d'investissement sélectionnées et validées." },
      },
      projects: {
        title: "Opportunités sélectionnées",
        sub: "Chaque projet est certifié par notre chaîne de validation.",
        seeAll: "Voir tout le catalogue",
        channels: { GO: "Go", PLUS: "Structuré", INVEST: "Invest" },
      },
      footer: { rights: "Tous droits réservés." },
    },
  },
  en: {
    translation: {
      nav: { projects: "Projects", ecosystem: "Ecosystem", about: "About", process: "Process", premium: "Premium", signIn: "Sign in", join: "Join" },
      cta: { discover: "Discover", explore: "Explore", invest: "Invest", seeProjects: "View projects", createAccount: "Create account" },
      hero: {
        badge: "The pan-African entrepreneurship ecosystem",
        title1: "Invest in the Africa",
        title2: "being built.",
        subtitle: "MiPROJET connects investors with certified projects across a structured ecosystem — from the field to formalization, all the way to capital.",
      },
      universe: {
        title: "Four universes, one ambition",
        subtitle: "A continuous journey for African entrepreneurship.",
        miprojet: { name: "MiPROJET", tag: "Ecosystem", desc: "The parent brand: vision, governance and standards." },
        go: { name: "MiPROJET Go", tag: "Field", desc: "Micro-activities and informal entrepreneurs, supported." },
        plus: { name: "MiPROJET+", tag: "Structuring", desc: "Certified SMEs, formal governance, proven model." },
        invest: { name: "MiPROJET Invest", tag: "Capital", desc: "Curated and validated investment opportunities." },
      },
      projects: {
        title: "Selected opportunities",
        sub: "Every project is certified through our validation chain.",
        seeAll: "View full catalogue",
        channels: { GO: "Go", PLUS: "Structured", INVEST: "Invest" },
      },
      footer: { rights: "All rights reserved." },
    },
  },
  es: {
    translation: {
      nav: { projects: "Proyectos", ecosystem: "Ecosistema", about: "Nosotros", process: "Proceso", premium: "Premium", signIn: "Entrar", join: "Unirse" },
      cta: { discover: "Descubrir", explore: "Explorar", invest: "Invertir", seeProjects: "Ver proyectos", createAccount: "Crear cuenta" },
      hero: {
        badge: "El ecosistema panafricano del emprendimiento",
        title1: "Invierte en el África",
        title2: "que se construye.",
        subtitle: "MiPROJET conecta a inversores con proyectos certificados a través de un ecosistema estructurado.",
      },
      universe: {
        title: "Cuatro universos, una sola ambición",
        subtitle: "Un recorrido continuo para el emprendimiento africano.",
        miprojet: { name: "MiPROJET", tag: "Ecosistema", desc: "La marca matriz: visión, gobernanza y estándares." },
        go: { name: "MiPROJET Go", tag: "Terreno", desc: "Microactividades y emprendedores informales acompañados." },
        plus: { name: "MiPROJET+", tag: "Estructuración", desc: "PYMES certificadas, gobernanza formal, modelo probado." },
        invest: { name: "MiPROJET Invest", tag: "Capital", desc: "Oportunidades de inversión seleccionadas y validadas." },
      },
      projects: { title: "Oportunidades seleccionadas", sub: "Cada proyecto está certificado.", seeAll: "Ver catálogo completo", channels: { GO: "Go", PLUS: "Estructurado", INVEST: "Invest" } },
      footer: { rights: "Todos los derechos reservados." },
    },
  },
  de: {
    translation: {
      nav: { projects: "Projekte", ecosystem: "Ökosystem", about: "Über uns", process: "Prozess", premium: "Premium", signIn: "Anmelden", join: "Beitreten" },
      cta: { discover: "Entdecken", explore: "Erkunden", invest: "Investieren", seeProjects: "Projekte ansehen", createAccount: "Konto erstellen" },
      hero: {
        badge: "Das panafrikanische Unternehmer-Ökosystem",
        title1: "Investieren Sie in das Afrika,",
        title2: "das entsteht.",
        subtitle: "MiPROJET verbindet Investoren mit zertifizierten Projekten in einem strukturierten Ökosystem.",
      },
      universe: {
        title: "Vier Universen, eine Vision",
        subtitle: "Ein durchgehender Weg für afrikanisches Unternehmertum.",
        miprojet: { name: "MiPROJET", tag: "Ökosystem", desc: "Die Muttermarke: Vision, Governance, Standards." },
        go: { name: "MiPROJET Go", tag: "Feld", desc: "Mikro-Aktivitäten und informelle Unternehmer." },
        plus: { name: "MiPROJET+", tag: "Strukturierung", desc: "Zertifizierte KMU mit formeller Governance." },
        invest: { name: "MiPROJET Invest", tag: "Kapital", desc: "Ausgewählte, geprüfte Investmentchancen." },
      },
      projects: { title: "Ausgewählte Chancen", sub: "Jedes Projekt ist zertifiziert.", seeAll: "Vollständigen Katalog ansehen", channels: { GO: "Go", PLUS: "Strukturiert", INVEST: "Invest" } },
      footer: { rights: "Alle Rechte vorbehalten." },
    },
  },
  ar: {
    translation: {
      nav: { projects: "المشاريع", ecosystem: "النظام البيئي", about: "من نحن", process: "العملية", premium: "بريميوم", signIn: "دخول", join: "انضم" },
      cta: { discover: "اكتشف", explore: "استكشف", invest: "استثمر", seeProjects: "عرض المشاريع", createAccount: "إنشاء حساب" },
      hero: {
        badge: "المنظومة الأفريقية لريادة الأعمال",
        title1: "استثمر في إفريقيا",
        title2: "التي تُبنى.",
        subtitle: "تربط MiPROJET بين المستثمرين ومشاريع معتمدة عبر منظومة مهيكلة.",
      },
      universe: {
        title: "أربعة عوالم، طموح واحد",
        subtitle: "مسار متواصل لريادة الأعمال الأفريقية.",
        miprojet: { name: "MiPROJET", tag: "المنظومة", desc: "العلامة الأم: الرؤية والحوكمة والمعايير." },
        go: { name: "MiPROJET Go", tag: "الميدان", desc: "الأنشطة الصغيرة ورواد الأعمال غير الرسميين." },
        plus: { name: "MiPROJET+", tag: "الهيكلة", desc: "شركات صغيرة ومتوسطة معتمدة بحوكمة رسمية." },
        invest: { name: "MiPROJET Invest", tag: "رأس المال", desc: "فرص استثمارية مختارة ومعتمدة." },
      },
      projects: { title: "فرص مختارة", sub: "كل مشروع معتمد.", seeAll: "عرض الكتالوج الكامل", channels: { GO: "Go", PLUS: "منظّم", INVEST: "Invest" } },
      footer: { rights: "جميع الحقوق محفوظة." },
    },
  },
  zh: {
    translation: {
      nav: { projects: "项目", ecosystem: "生态", about: "关于", process: "流程", premium: "尊享", signIn: "登录", join: "加入" },
      cta: { discover: "探索", explore: "浏览", invest: "投资", seeProjects: "查看项目", createAccount: "创建账户" },
      hero: {
        badge: "泛非创业生态系统",
        title1: "投资正在建设中",
        title2: "的非洲。",
        subtitle: "MiPROJET 通过结构化生态系统，将投资者与经认证的项目连接起来。",
      },
      universe: {
        title: "四大宇宙，一个愿景",
        subtitle: "非洲创业的完整旅程。",
        miprojet: { name: "MiPROJET", tag: "生态", desc: "母品牌：愿景、治理与标准。" },
        go: { name: "MiPROJET Go", tag: "田野", desc: "受支持的微型活动与非正式创业。" },
        plus: { name: "MiPROJET+", tag: "结构化", desc: "经认证、正式治理的中小企业。" },
        invest: { name: "MiPROJET Invest", tag: "资本", desc: "精选和验证的投资机会。" },
      },
      projects: { title: "精选机会", sub: "每个项目均经认证。", seeAll: "查看完整目录", channels: { GO: "Go", PLUS: "结构化", INVEST: "Invest" } },
      footer: { rights: "版权所有。" },
    },
  },
} as const;

if (typeof window !== "undefined" && !i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: resources as never,
      fallbackLng: "fr",
      supportedLngs: ["fr", "en", "es", "de", "ar", "zh"],
      interpolation: { escapeValue: false },
      detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
    })
    .then(() => {
      const lang = i18n.language || "fr";
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    });

  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  });
}

export default i18n;
export const SUPPORTED_LANGS: { code: string; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];
