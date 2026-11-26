/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const TRANSLATIONS = {
  // Navigation & Route Titles
  "nav.overview": { en: "Overview", bn: "হোম ওভারভিউ" },
  "nav.shops": { en: "Shops", bn: "দোকানসমূহ" },
  "nav.addShop": { en: "Add Shop", bn: "নতুন দোকান" },
  "nav.inventory": { en: "Inventory", bn: "স্টক / ইনভেন্টরি" },
  "nav.products": { en: "Products", bn: "পণ্য তালিকা" },
  "nav.addProduct": { en: "Add Product", bn: "পণ্য যোগ করুন" },
  "nav.pos": { en: "Sell (POS)", bn: "বিক্রি (POS)" },
  "nav.sales": { en: "Sales", bn: "বিক্রয় হিসাব" },
  "nav.orders": { en: "Orders", bn: "অর্ডারসমূহ" },
  "nav.invoices": { en: "Invoices", bn: "রসিদ / বিল" },
  "nav.invoicePreview": { en: "Invoice Preview", bn: "রসিদ প্রিভিউ" },
  "nav.customers": { en: "Customers", bn: "কাস্টমার" },
  "nav.customerList": { en: "Customer List", bn: "কাস্টমার তালিকা" },
  "nav.expenses": { en: "Expenses", bn: "খরচ ও বিল" },
  "nav.addExpense": { en: "Add Expense", bn: "খরচ লিখুন" },
  "nav.addIncome": { en: "Record Income", bn: "আয় লিখুন" },
  "nav.addFixedCost": { en: "Add Fixed Cost", bn: "ফিক্সড বিল যোগ" },
  "nav.analytics": { en: "Analytics", bn: "আয়-ব্যয় রিপোর্ট" },
  "nav.employees": { en: "Employees", bn: "কর্মচারী" },
  "nav.addEmployee": { en: "Add Employee", bn: "কর্মচারী যোগ" },
  "nav.users": { en: "Users", bn: "ব্যবহারকারী" },
  "nav.settings": { en: "Settings", bn: "সেটিংস" },
  "nav.allProducts": { en: "All Products", bn: "সব পণ্য" },
  "nav.inStock": { en: "In Stock", bn: "স্টকে আছে" },
  "nav.outOfStock": { en: "Out of Stock", bn: "স্টক শেষ" },
  "nav.productDetails": { en: "Product Details", bn: "পণ্যের বিবরণ" },
  "nav.menu": { en: "Menu", bn: "মেনু" },
  "nav.more": { en: "More", bn: "আরো" },
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.sell": { en: "Sell", bn: "বিক্রি" },
  "nav.stock": { en: "Stock", bn: "স্টক" },
  "nav.bills": { en: "Bills", bn: "খরচ" },

  // Common Actions
  "common.newSale": { en: "New Sale", bn: "নতুন বিক্রি" },
  "common.addProduct": { en: "Add Product", bn: "পণ্য যোগ" },
  "common.addExpense": { en: "Add Expense", bn: "খরচ লিখুন" },
  "common.invoices": { en: "Invoices", bn: "রসিদ দেখুন" },
  "common.switchShop": { en: "Switch Shop", bn: "দোকান বদলান" },
  "common.currentShop": { en: "Current Shop", bn: "বর্তমান দোকান" },
  "common.language": { en: "Language", bn: "ভাষা" },
  "common.darkColor": { en: "Black Mode Colors", bn: "ব্ল্যাক মোড কালার" },
  "common.logout": { en: "Logout", bn: "লগআউট" },
  "common.signIn": { en: "Sign In", bn: "লগইন" },
  "common.dashboard": { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  "common.liveDemo": { en: "Live Demo", bn: "লাইভ ডেমো" },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("dokaan_lang");
      return saved === "bn" ? "bn" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("dokaan_lang", lang);
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next === "bn" ? "bn" : "en");
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "en" ? "bn" : "en"));
  }, []);

  const pick = useCallback(
    (enText, bnText) => (lang === "bn" ? bnText : enText),
    [lang]
  );

  const t = useCallback(
    (key, fallback) => {
      const entry = TRANSLATIONS[key];
      if (!entry) return fallback || key;
      return entry[lang] || entry.en || fallback || key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      isBn: lang === "bn",
      setLang,
      toggleLang,
      pick,
      t,
    }),
    [lang, setLang, toggleLang, pick, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
