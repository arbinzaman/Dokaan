import axios from "axios";
import Cookies from "js-cookie";
import { createInitialDemoDb } from "./demoData.js";

const STORAGE_KEY = "dokaan_demo_db_v1";
const DEMO_MODE_KEY = "dokaan_demo_mode";

export const isDemoModeActive = () => {
  try {
    if (localStorage.getItem(DEMO_MODE_KEY) === "true") return true;
  } catch {
    // ignore storage errors
  }
  const token = Cookies.get("XTOKEN") || "";
  return String(token).startsWith("demo-token-");
};

export const setDemoModeActive = (enabled) => {
  try {
    if (enabled) {
      localStorage.setItem(DEMO_MODE_KEY, "true");
    } else {
      localStorage.removeItem(DEMO_MODE_KEY);
    }
  } catch {
    // ignore storage errors
  }
};
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_ALIASES = {
  jan: 0, january: 0, "01": 0, "1": 0,
  feb: 1, february: 1, "02": 1, "2": 1,
  mar: 2, march: 2, "03": 2, "3": 2,
  apr: 3, april: 3, "04": 3, "4": 3,
  may: 4, "05": 4, "5": 4,
  jun: 5, june: 5, "06": 5, "6": 5,
  jul: 6, july: 6, "07": 6, "7": 6,
  aug: 7, august: 7, "08": 7, "8": 7,
  sep: 8, sept: 8, september: 8, "09": 8, "9": 8,
  oct: 9, october: 9, "10": 9,
  nov: 10, november: 10, "11": 10,
  dec: 11, december: 11, "12": 11,
};

let installed = false;

export const getDemoDb = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.shops)) {
        return parsed;
      }
    }
  } catch {
    // Corrupted demo DB — reset below
  }
  const initial = createInitialDemoDb();
  saveDemoDb(initial);
  return initial;
};

export const saveDemoDb = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage quota overflow gracefully
  }
};

export const resetDemoDb = () => {
  const fresh = createInitialDemoDb();
  saveDemoDb(fresh);
  return fresh;
};

const sanitizeUser = (u) => {
  if (!u) return null;
  const { password, ...safe } = u;
  void password;
  return safe;
};

const getUserShops = (db, user) => {
  if (!user) return [];
  if (user.role === "admin") return [];
  const owned = db.shops.filter(
    (s) =>
      String(s.ownerId) === String(user.id) ||
      (Array.isArray(user.shopIds) && user.shopIds.includes(s.id))
  );
  return owned;
};

export const buildDemoSessionPayload = (roleOrEmail = "owner@dokaan.demo") => {
  const db = getDemoDb();
  const normalized = String(roleOrEmail || "").toLowerCase().trim();
  const matched =
    db.users.find((u) => u.email.toLowerCase() === normalized) ||
    db.users.find((u) => u.role.toLowerCase() === normalized) ||
    db.users[0];

  const safeUser = sanitizeUser(matched);
  const shops = getUserShops(db, matched);
  const token = `demo-token-${matched.id}-${matched.role}`;

  return {
    token,
    user: safeUser,
    dokaan: shops,
    savedShop: shops[0] || null,
  };
};

export const activateDemoSession = (roleOrEmail = "owner@dokaan.demo") => {
  setDemoModeActive(true);
  const session = buildDemoSessionPayload(roleOrEmail);
  localStorage.setItem("user", JSON.stringify(session.user));
  localStorage.setItem("dokaan", JSON.stringify(session.dokaan));
  if (session.savedShop) {
    localStorage.setItem("savedShop", JSON.stringify(session.savedShop));
  } else {
    localStorage.removeItem("savedShop");
  }
  Cookies.set("XTOKEN", session.token, { expires: 7, path: "/" });
  return session;
};

const getActiveUserFromToken = (db, headers) => {
  const rawToken =
    headers?.Authorization ||
    headers?.authorization ||
    Cookies.get("XTOKEN") ||
    "";
  const match = String(rawToken).match(/demo-token-(\d+)/);
  if (match) {
    const found = db.users.find((u) => String(u.id) === match[1]);
    if (found) return found;
  }
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (stored?.id) {
      const found = db.users.find((u) => String(u.id) === String(stored.id));
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return db.users[0];
};

const parseMonthParam = (monthStr) => {
  if (monthStr == null || monthStr === "") return null;
  const key = String(monthStr).toLowerCase().trim();
  return key in MONTH_ALIASES ? MONTH_ALIASES[key] : null;
};

const matchesDateFilters = (isoDate, { year, month, day }) => {
  if (!year && !month && !day) return true;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  if (year && String(d.getFullYear()) !== String(year)) return false;
  if (month) {
    const targetMonth = parseMonthParam(month);
    if (targetMonth !== null && d.getMonth() !== targetMonth) return false;
  }
  if (day && d.getDate() !== Number(day)) return false;
  return true;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve) => {
    if (typeof File === "undefined" || !(file instanceof File)) {
      resolve(typeof file === "string" ? file : null);
      return;
    }
    if (file.size > 600 * 1024) {
      resolve(URL.createObjectURL(file));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

const parseBody = async (rawBody) => {
  if (!rawBody) return { isFormData: false, data: {} };
  if (typeof FormData !== "undefined" && rawBody instanceof FormData) {
    const obj = {};
    for (const [key, val] of rawBody.entries()) {
      if (typeof File !== "undefined" && val instanceof File) {
        obj[key] = await readFileAsDataUrl(val);
      } else {
        obj[key] = val;
      }
    }
    return { isFormData: true, data: obj };
  }
  if (typeof rawBody === "string") {
    try {
      return { isFormData: false, data: JSON.parse(rawBody) };
    } catch {
      return { isFormData: false, data: {} };
    }
  }
  return { isFormData: false, data: rawBody };
};

const getBaseUrl = () =>
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BASE_URL) ||
  "https://dokaan-backend.vercel.app/api/v1";

const isApiRequest = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const baseUrl = getBaseUrl();
  if (baseUrl && rawUrl.startsWith(baseUrl)) return true;
  if (rawUrl.includes("/api/v1/")) return true;
  if (rawUrl.startsWith("undefined/")) return true;
  return false;
};

const extractEndpointAndQuery = (rawUrl, axiosParams) => {
  let clean = rawUrl;
  const baseUrl = getBaseUrl();
  if (baseUrl && clean.startsWith(baseUrl)) {
    clean = clean.slice(baseUrl.length);
  } else if (clean.includes("/api/v1")) {
    clean = clean.slice(clean.indexOf("/api/v1") + "/api/v1".length);
  } else if (clean.startsWith("undefined/")) {
    clean = clean.slice("undefined".length);
  }

  const [pathPart, queryPart = ""] = clean.split("?");
  const params = {};
  const sp = new URLSearchParams(queryPart);
  for (const [k, v] of sp.entries()) {
    params[k] = v;
  }
  if (axiosParams && typeof axiosParams === "object") {
    Object.entries(axiosParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params[k] = String(v);
      }
    });
  }

  const normalizedPath = `/${pathPart.replace(/^\/+|\/+$/g, "")}`;
  return { path: normalizedPath, params };
};

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const computeAnalytics = (db, shopId, params) => {
  const type = params.type || "month";
  const now = new Date();
  const targetYear = Number(params.year) || now.getFullYear();
  const targetMonth =
    params.month !== undefined ? parseMonthParam(params.month) : now.getMonth();
  const targetDateStr = params.date || now.toISOString().slice(0, 10);

  const shopSales = db.sales.filter((s) => String(s.shopId) === String(shopId));
  const shopExpenses = db.expenses.filter(
    (e) => String(e.shopId) === String(shopId)
  );

  const inPeriod = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return false;
    if (type === "day") {
      return d.toISOString().slice(0, 10) === targetDateStr;
    }
    if (type === "week") {
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays >= -1 && diffDays <= 7;
    }
    if (type === "month") {
      return d.getFullYear() === targetYear && d.getMonth() === targetMonth;
    }
    return d.getFullYear() === targetYear;
  };

  let periodSales = shopSales.filter((s) => inPeriod(s.soldAt));
  let periodExpenses = shopExpenses.filter((e) => inPeriod(e.date || e.updated_at));

  // If user picks a distant empty date, keep honest empty breakdown; for current
  // month/week/day our relative demo timestamps naturally match!
  const revenueBreakdown = {};
  periodSales.forEach((s) => {
    const key = s.itemCategory || "Sales";
    revenueBreakdown[key] = round2((revenueBreakdown[key] || 0) + Number(s.totalPrice || 0));
  });

  const expenseBreakdown = {};
  periodExpenses.forEach((e) => {
    const amt = Number(e.amount || 0);
    if (e.type === "income") {
      const key = e.category || "Other Income";
      revenueBreakdown[key] = round2((revenueBreakdown[key] || 0) + amt);
    } else {
      const key = e.category || "General";
      expenseBreakdown[key] = round2((expenseBreakdown[key] || 0) + amt);
    }
  });

  const totalRevenue = round2(
    Object.values(revenueBreakdown).reduce((a, b) => a + b, 0)
  );
  const totalExpenses = round2(
    Object.values(expenseBreakdown).reduce((a, b) => a + b, 0)
  );
  const netProfit = round2(totalRevenue - totalExpenses);

  // Build grouped buckets for RevenueExpenseChart
  const report = {};
  if (type === "day") {
    const buckets = ["Morning", "Afternoon", "Evening"];
    buckets.forEach((b) => {
      report[b] = { totalRevenue: 0, totalExpense: 0, netProfit: 0 };
    });
    periodSales.forEach((s) => {
      const h = new Date(s.soldAt).getHours();
      const label = h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
      report[label].totalRevenue = round2(report[label].totalRevenue + Number(s.totalPrice || 0));
    });
    periodExpenses.forEach((e) => {
      const h = new Date(e.date || e.updated_at).getHours();
      const label = h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
      if (e.type === "income") {
        report[label].totalRevenue = round2(report[label].totalRevenue + Number(e.amount || 0));
      } else {
        report[label].totalExpense = round2(report[label].totalExpense + Number(e.amount || 0));
      }
    });
    Object.values(report).forEach((v) => {
      v.netProfit = round2(v.totalRevenue - v.totalExpense);
    });
  } else if (type === "week") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayKey = d.toISOString().slice(0, 10);
      const dayRev =
        shopSales
          .filter((s) => s.soldAt?.slice(0, 10) === dayKey)
          .reduce((sum, s) => sum + Number(s.totalPrice || 0), 0) +
        shopExpenses
          .filter((e) => e.type === "income" && (e.date || "").slice(0, 10) === dayKey)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const dayExp = shopExpenses
        .filter((e) => e.type !== "income" && (e.date || "").slice(0, 10) === dayKey)
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      report[label] = {
        totalRevenue: round2(dayRev),
        totalExpense: round2(dayExp),
        netProfit: round2(dayRev - dayExp),
      };
    }
  } else if (type === "month") {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    weeks.forEach((w) => {
      report[w] = { totalRevenue: 0, totalExpense: 0, netProfit: 0 };
    });
    periodSales.forEach((s) => {
      const dom = new Date(s.soldAt).getDate();
      const idx = Math.min(3, Math.floor((dom - 1) / 7));
      report[weeks[idx]].totalRevenue = round2(
        report[weeks[idx]].totalRevenue + Number(s.totalPrice || 0)
      );
    });
    periodExpenses.forEach((e) => {
      const dom = new Date(e.date || e.updated_at).getDate();
      const idx = Math.min(3, Math.floor((dom - 1) / 7));
      if (e.type === "income") {
        report[weeks[idx]].totalRevenue = round2(
          report[weeks[idx]].totalRevenue + Number(e.amount || 0)
        );
      } else {
        report[weeks[idx]].totalExpense = round2(
          report[weeks[idx]].totalExpense + Number(e.amount || 0)
        );
      }
    });
    Object.values(report).forEach((v) => {
      v.netProfit = round2(v.totalRevenue - v.totalExpense);
    });
  } else {
    // Year view: last 6 months up to current month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(targetYear, now.getMonth() - i, 1);
      const label = MONTH_NAMES[d.getMonth()];
      const mRev =
        shopSales
          .filter((s) => {
            const sd = new Date(s.soldAt);
            return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
          })
          .reduce((sum, s) => sum + Number(s.totalPrice || 0), 0) +
        shopExpenses
          .filter((e) => {
            const ed = new Date(e.date || e.updated_at);
            return (
              e.type === "income" &&
              ed.getFullYear() === d.getFullYear() &&
              ed.getMonth() === d.getMonth()
            );
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const mExp = shopExpenses
        .filter((e) => {
          const ed = new Date(e.date || e.updated_at);
          return (
            e.type !== "income" &&
            ed.getFullYear() === d.getFullYear() &&
            ed.getMonth() === d.getMonth()
          );
        })
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      report[label] = {
        totalRevenue: round2(mRev),
        totalExpense: round2(mExp),
        netProfit: round2(mRev - mExp),
      };
    }
  }

  return {
    statement: {
      summary: { totalRevenue, totalExpenses, netProfit },
      revenueBreakdown,
      expenseBreakdown,
    },
    report,
  };
};

const handleDemoApiRequest = async ({ method, rawUrl, params: axiosParams, body: rawBody, headers }) => {
  const m = String(method || "GET").toUpperCase();
  const { path, params } = extractEndpointAndQuery(rawUrl, axiosParams);
  const { isFormData, data: body } = await parseBody(rawBody);
  const db = getDemoDb();
  const activeUser = getActiveUserFromToken(db, headers);

  // Brief natural latency for smooth UI feedback
  await new Promise((r) => setTimeout(r, 75));

  // ================= AUTH =================
  if (m === "POST" && path === "/auth/login") {
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    let user = db.users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      // Offline demo: any new email signs in as a fresh shop owner with sample shops
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 4) {
        return {
          status: 401,
          data: {
            message:
              "Enter a valid email and a password of at least 4 characters.",
          },
        };
      }
      const displayName =
        email
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .replace(/\d+/g, "")
          .trim()
          .replace(/\b\w/g, (c) => c.toUpperCase()) || "Demo Owner";
      user = {
        id: db.nextIds.user++,
        name: displayName,
        email,
        password,
        role: "shop-owner",
        twoFactorEnabled: false,
        subscriptionStatus: true,
        profileImageUrl: null,
        shopIds: db.shops.slice(0, 2).map((s) => s.id),
        createdAt: new Date().toISOString(),
      };
      db.users.unshift(user);
      saveDemoDb(db);
    } else if (user.password && user.password !== password) {
      return {
        status: 401,
        data: {
          message:
            "Incorrect password for this account. Built-in demo accounts use password: demo123.",
        },
      };
    }

    const shops = getUserShops(db, user);
    return {
      status: 200,
      data: {
        status: 200,
        access_token: `demo-token-${user.id}-${user.role}`,
        user: sanitizeUser(user),
        dokaan: shops,
      },
    };
  }

  if (m === "POST" && path === "/auth/send-otp") {
    return {
      status: 200,
      data: { status: 200, message: "Demo OTP sent! Enter 123456 to verify." },
    };
  }

  if (m === "POST" && path === "/auth/verify-otp") {
    const otp = String(body.otp || "").trim();
    if (otp.length < 4) {
      return { status: 400, data: { message: "Enter any 4–6 digit code (e.g. 123456)." } };
    }
    if (activeUser) {
      activeUser.twoFactorEnabled = true;
      saveDemoDb(db);
    }
    return { status: 200, data: { status: 200, message: "OTP verified successfully!" } };
  }

  if (m === "POST" && path === "/auth/disable-2fa") {
    if (!body.password) {
      return { status: 400, data: { message: "Password is required." } };
    }
    if (activeUser) {
      activeUser.twoFactorEnabled = false;
      saveDemoDb(db);
    }
    return { status: 200, data: { status: 200, message: "2FA disabled successfully." } };
  }

  if (m === "PUT" && path === "/auth/change-password") {
    if (!body.oldPassword || !body.newPassword) {
      return { status: 400, data: { message: "Old and new passwords are required." } };
    }
    if (activeUser) {
      activeUser.password = body.newPassword;
      saveDemoDb(db);
    }
    return { status: 200, data: { status: 200, message: "Password updated successfully!" } };
  }

  // ================= PROFILE =================
  const profileMatch = path.match(/^\/profile\/([^/]+)$/);
  if (m === "PUT" && profileMatch) {
    const id = profileMatch[1];
    const target = db.users.find((u) => String(u.id) === String(id)) || activeUser;
    if (!target) return { status: 404, data: { message: "User not found." } };
    if (body.name) target.name = body.name;
    if (body.email) target.email = body.email;
    if (body.profileImageUrl) target.profileImageUrl = body.profileImageUrl;
    saveDemoDb(db);
    return {
      status: 200,
      data: { status: 200, data: sanitizeUser(target), message: "Profile updated!" },
    };
  }

  // ================= DOKAAN (SHOPS & SIGNUP) =================
  if (m === "POST" && path === "/dokaan") {
    const isRegistration = !isFormData && Boolean(body.password && body.name);

    if (isRegistration) {
      const existing = db.users.find(
        (u) => u.email.toLowerCase() === String(body.email || "").toLowerCase()
      );
      if (existing) {
        return {
          status: 409,
          data: { message: "An account with this email already exists. Please sign in." },
        };
      }
      const newUserId = db.nextIds.user++;
      const newShopId = db.nextIds.shop++;
      const newShop = {
        id: newShopId,
        ownerId: newUserId,
        dokaan_name: body.dokaan_name || "My Demo Shop",
        dokaan_location: body.dokaan_location || "Dhaka, Bangladesh",
        dokaan_email: body.dokaan_email || body.email,
        dokaan_phone: body.dokaan_phone || "01700-000000",
        dokaan_type: body.dokaan_type || "Groceries",
        dokaan_Tin_Certificate: body.dokaan_Tin_Certificate || "",
        dokaan_imageUrl: null,
        createdAt: new Date().toISOString(),
      };
      const newUser = {
        id: newUserId,
        name: body.name,
        email: body.email,
        password: body.password,
        role: "shop-owner",
        twoFactorEnabled: false,
        subscriptionStatus: true,
        profileImageUrl: null,
        shopIds: [newShopId],
        createdAt: new Date().toISOString(),
      };
      db.users.unshift(newUser);
      db.shops.push(newShop);
      saveDemoDb(db);
      return {
        status: 201,
        data: {
          status: 201,
          access_token: `demo-token-${newUser.id}-${newUser.role}`,
          data: { owner: sanitizeUser(newUser), dokaan: [newShop] },
        },
      };
    }

    // Add new shop for existing owner
    const newShopId = db.nextIds.shop++;
    const ownerId = Number(body.ownerId || activeUser?.id || 101);
    const newShop = {
      id: newShopId,
      ownerId,
      dokaan_name: body.dokaan_name || "New Branch",
      dokaan_location: body.dokaan_location || "Dhaka",
      dokaan_email: body.dokaan_email || "",
      dokaan_phone: body.dokaan_phone || "",
      dokaan_type: body.dokaan_type || "General",
      dokaan_Tin_Certificate: body.dokaan_Tin_Certificate || "",
      dokaan_imageUrl: body.dokaan_imageUrl || null,
      createdAt: new Date().toISOString(),
    };
    db.shops.push(newShop);
    const owner = db.users.find((u) => String(u.id) === String(ownerId));
    if (owner) {
      owner.shopIds = Array.from(new Set([...(owner.shopIds || []), newShopId]));
    }
    saveDemoDb(db);
    return { status: 201, data: { status: 201, data: newShop } };
  }

  const dokaanIdMatch = path.match(/^\/dokaan\/([^/]+)$/);
  if (m === "PUT" && dokaanIdMatch) {
    const id = dokaanIdMatch[1];
    const shop = db.shops.find((s) => String(s.id) === String(id));
    if (!shop) return { status: 404, data: { message: "Shop not found." } };
    [
      "dokaan_name",
      "dokaan_email",
      "dokaan_phone",
      "dokaan_type",
      "dokaan_location",
      "dokaan_Tin_Certificate",
    ].forEach((field) => {
      if (body[field] !== undefined) shop[field] = body[field];
    });
    if (body.dokaan_imageUrl) shop.dokaan_imageUrl = body.dokaan_imageUrl;
    saveDemoDb(db);
    return { status: 200, data: { status: 200, data: shop, message: "Shop updated!" } };
  }

  if (m === "DELETE" && dokaanIdMatch) {
    const id = dokaanIdMatch[1];
    db.shops = db.shops.filter((s) => String(s.id) !== String(id));
    db.users.forEach((u) => {
      if (Array.isArray(u.shopIds)) {
        u.shopIds = u.shopIds.filter((sid) => String(sid) !== String(id));
      }
    });
    saveDemoDb(db);
    return { status: 200, data: { status: 200, message: "Shop deleted." } };
  }

  // ================= PRODUCTS =================
  if (m === "GET" && path === "/products") {
    const shopId = params.shopId;
    const list = shopId
      ? db.products.filter((p) => String(p.shopId) === String(shopId))
      : db.products;
    return { status: 200, data: { status: 200, data: list } };
  }

  if (m === "GET" && path === "/products/total-products") {
    const totals = db.shops.map((s) => ({
      shopId: s.id,
      totalProducts: db.products.filter((p) => String(p.shopId) === String(s.id)).length,
    }));
    return { status: 200, data: { status: 200, data: totals } };
  }

  const productByIdMatch = path.match(/^\/products\/id\/([^/]+)$/);
  if (m === "GET" && productByIdMatch) {
    const id = productByIdMatch[1];
    const product = db.products.find((p) => String(p.id) === String(id));
    if (!product) return { status: 404, data: { message: "Product not found." } };
    return { status: 200, data: { status: 200, data: product } };
  }

  if (m === "POST" && path === "/products/scan") {
    const query = String(body.barcode || "").trim().toLowerCase();
    const shopId = body.shopId || params.shopId;
    const pool = shopId
      ? db.products.filter((p) => String(p.shopId) === String(shopId))
      : db.products;

    const matched =
      pool.find((p) => String(p.code).toLowerCase() === query) ||
      pool.find((p) => p.name.toLowerCase().includes(query) || String(p.code).toLowerCase().includes(query));

    if (!matched) {
      return {
        status: 404,
        data: { message: `No product found matching "${body.barcode}".` },
      };
    }

    return {
      status: 200,
      data: {
        matchedProduct: {
          ...matched,
          productName: matched.name,
          productCode: matched.code,
        },
      },
    };
  }

  if (m === "POST" && path === "/products") {
    const stockNum = Number(body.stock ?? body.initialStock ?? 0);
    const newProduct = {
      id: db.nextIds.product++,
      shopId: Number(body.shopId || params.shopId || 1),
      ownerId: Number(body.ownerId || activeUser?.id || 101),
      name: body.name || "Untitled Product",
      code: String(body.code || `894${Date.now().toString().slice(-5)}`),
      itemCategory: body.itemCategory || "General",
      purchasePrice: Number(body.purchasePrice || 0),
      salesPrice: Number(body.salesPrice || 0),
      initialStock: stockNum,
      stock: stockNum,
      totalSold: 0,
      description: body.description || "",
      imageUrl: body.imageUrl || null,
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    saveDemoDb(db);
    return { status: 201, data: { status: 201, data: newProduct } };
  }

  const productCodeOrIdMatch = path.match(/^\/products\/([^/]+)$/);
  if (m === "PUT" && productCodeOrIdMatch) {
    const key = decodeURIComponent(productCodeOrIdMatch[1]);
    const shopId = body.shopId || params.shopId;
    const target = db.products.find(
      (p) =>
        (String(p.code) === key || String(p.id) === key) &&
        (!shopId || String(p.shopId) === String(shopId))
    );
    if (!target) return { status: 404, data: { message: "Product not found." } };
    const nextStock = Number(body.stock ?? body.initialStock ?? target.stock);
    target.name = body.name ?? target.name;
    target.itemCategory = body.itemCategory ?? target.itemCategory;
    target.purchasePrice = Number(body.purchasePrice ?? target.purchasePrice);
    target.salesPrice = Number(body.salesPrice ?? target.salesPrice);
    target.stock = nextStock;
    target.initialStock = Math.max(target.initialStock || 0, nextStock);
    saveDemoDb(db);
    return { status: 200, data: { status: 200, data: target } };
  }

  if (m === "DELETE" && productCodeOrIdMatch) {
    const id = decodeURIComponent(productCodeOrIdMatch[1]);
    db.products = db.products.filter(
      (p) => String(p.id) !== id && String(p.code) !== id
    );
    saveDemoDb(db);
    return { status: 200, data: { status: 200, message: "Product deleted." } };
  }

  // ================= SALES =================
  if (m === "GET" && path === "/sales") {
    const shopId = params.shopId;
    const filtered = db.sales
      .filter((s) => (!shopId || String(s.shopId) === String(shopId)))
      .filter((s) => matchesDateFilters(s.soldAt, params))
      .sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt));
    return { status: 200, data: { filteredSales: filtered, data: filtered } };
  }

  if (m === "POST" && path === "/sales") {
    const shopId = Number(body.shopId || params.shopId || 1);
    const shop = db.shops.find((s) => String(s.id) === String(shopId)) || db.shops[0];
    const soldAt = body.soldAt || new Date().toISOString();
    const soldItems = Array.isArray(body.products) ? body.products : [];
    const sellerObj = {
      id: activeUser?.id || body.sellerId || 101,
      name: activeUser?.name || "Arbin Zaman",
    };

    let grandTotal = 0;
    const invoiceProducts = [];

    soldItems.forEach((item) => {
      const product = db.products.find(
        (p) =>
          String(p.shopId) === String(shopId) &&
          (String(p.code) === String(item.code) || p.name === item.productName)
      );
      const qty = Math.max(1, Number(item.quantity || 1));
      const unitPrice = Number(item.salesPrice ?? product?.salesPrice ?? 0);
      const disc = Number(item.discount || 0);
      const lineTotal = round2(
        item.totalPrice ?? unitPrice * qty - (disc / 100) * unitPrice * qty
      );
      grandTotal = round2(grandTotal + lineTotal);

      if (product) {
        product.stock = Math.max(0, Number(product.stock ?? product.initialStock ?? 0) - qty);
        product.totalSold = Number(product.totalSold || 0) + qty;
      }

      const saleRow = {
        id: db.nextIds.sale++,
        shopId,
        name: item.productName || product?.name || "Item",
        itemCategory: product?.itemCategory || "General",
        code: item.code || product?.code || "N/A",
        salesPrice: unitPrice,
        quantity: qty,
        discount: disc,
        totalPrice: lineTotal,
        soldAt,
        seller: sellerObj,
        shop: { id: shop.id, name: shop.dokaan_name },
      };
      db.sales.unshift(saleRow);

      invoiceProducts.push({
        productName: saleRow.name,
        code: saleRow.code,
        quantity: qty,
        salesPrice: unitPrice,
        discount: disc,
      });
    });

    // Update or create customer record (skip anonymous walk-ins)
    const cust = body.customer || {};
    if (cust.name && cust.name.toLowerCase() !== "walk-in customer") {
      const existingCustomer = db.customers.find(
        (c) =>
          String(c.shopId) === String(shopId) &&
          ((cust.phone && c.phone === cust.phone) ||
            c.name.toLowerCase() === cust.name.toLowerCase())
      );
      if (existingCustomer) {
        const shopPurchase = existingCustomer.purchases.find(
          (p) => String(p.shopId) === String(shopId)
        );
        if (shopPurchase) {
          shopPurchase.purchaseCount += 1;
        } else {
          existingCustomer.purchases.push({
            shopId,
            shopName: shop.dokaan_name,
            purchaseCount: 1,
          });
        }
        const totalP = existingCustomer.purchases.reduce((s, p) => s + p.purchaseCount, 0);
        if (totalP >= 5) {
          existingCustomer.favorite = true;
          existingCustomer.isFavorite = true;
        }
      } else {
        db.customers.unshift({
          id: db.nextIds.customer++,
          shopId,
          name: cust.name,
          phone: cust.phone || "N/A",
          email: cust.email || "",
          address: cust.address || "",
          favorite: false,
          isFavorite: false,
          createdAt: soldAt,
          purchases: [{ shopId, shopName: shop.dokaan_name, purchaseCount: 1 }],
        });
      }
    }

    const invoiceSeq = db.nextIds.invoice++;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${invoiceSeq}`;
    const newInvoice = {
      id: invoiceSeq,
      shopId,
      invoiceNumber,
      invoiceId: invoiceNumber,
      customer: {
        name: cust.name || "Walk-in Customer",
        phone: cust.phone || "N/A",
        email: cust.email || "",
        address: cust.address || "",
      },
      sellerName: sellerObj.name,
      user: sanitizeUser(activeUser),
      shop,
      totalPrice: grandTotal,
      createdAt: soldAt,
      products: invoiceProducts,
    };
    db.invoices.unshift(newInvoice);

    // Also reflect in Orders list for immediate visibility
    db.orders.unshift({
      id: `ORD-${db.nextIds.order++}`,
      shopId,
      customer: newInvoice.customer.name,
      phone: newInvoice.customer.phone,
      items: invoiceProducts.map((p) => `${p.productName} (x${p.quantity})`).join(", "),
      total: grandTotal,
      status: "Delivered",
      date: soldAt.slice(0, 10),
    });

    saveDemoDb(db);
    return {
      status: 201,
      data: { status: 201, invoice: newInvoice, data: newInvoice },
    };
  }

  if (m === "GET" && path === "/sales/total") {
    const shopId = params.shopId;
    const list = shopId
      ? db.sales.filter((s) => String(s.shopId) === String(shopId))
      : db.sales;
    return {
      status: 200,
      data: { shopId: Number(shopId || 1), totalSales: list.length },
    };
  }

  if (m === "GET" && path === "/sales/total-revenue") {
    const shopId = params.shopId;
    const list = shopId
      ? db.sales.filter((s) => String(s.shopId) === String(shopId))
      : db.sales;
    const totalRevenue = round2(
      list.reduce((sum, s) => sum + Number(s.totalPrice || 0), 0)
    );
    return {
      status: 200,
      data: { totalRevenue, salesGrowth: "+18.4%" },
    };
  }

  if (m === "GET" && path === "/sales/total-sales-count") {
    const shopId = params.shopId;
    const list = shopId
      ? db.sales.filter((s) => String(s.shopId) === String(shopId))
      : db.sales;

    const dailySalesData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const count = list
        .filter((s) => s.soldAt?.slice(0, 10) === dayKey)
        .reduce((sum, s) => sum + Number(s.quantity || 1), 0);
      dailySalesData.push({ name: label, sales: count });
    }

    const now = new Date();
    return {
      status: 200,
      data: {
        totalSales: list.length,
        date: now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        dailySalesData,
      },
    };
  }

  if (m === "GET" && path === "/sales/stats-by-month") {
    const shopId = params.shopId;
    const list = shopId
      ? db.sales.filter((s) => String(s.shopId) === String(shopId))
      : db.sales;
    const now = new Date();
    const series = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const total = list
        .filter((s) => {
          const sd = new Date(s.soldAt);
          return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
        })
        .reduce((sum, s) => sum + Number(s.totalPrice || 0), 0);
      series.push({ month: MONTH_NAMES[d.getMonth()], sales: round2(total) });
    }
    return { status: 200, data: series };
  }

  if (m === "GET" && path === "/sales/category-wise") {
    const shopId = params.shopId;
    const list = shopId
      ? db.sales.filter((s) => String(s.shopId) === String(shopId))
      : db.sales;
    const map = {};
    list.forEach((s) => {
      const cat = s.itemCategory || "General";
      map[cat] = round2((map[cat] || 0) + Number(s.totalPrice || 0));
    });
    const result = Object.entries(map).map(([category, totalSalesAmount]) => ({
      category,
      totalSalesAmount,
    }));
    return { status: 200, data: result };
  }

  if (m === "GET" && path === "/sales/top-selling") {
    const shopId = String(params.shopId || 1);
    const topProducts = db.products
      .filter((p) => String(p.shopId) === shopId)
      .sort((a, b) => Number(b.totalSold || 0) - Number(a.totalSold || 0))
      .slice(0, 6)
      .map((p) => ({
        name: p.name.length > 18 ? `${p.name.slice(0, 16)}…` : p.name,
        totalSold: Number(p.totalSold || 0),
        initialStock: Number(p.stock ?? p.initialStock ?? 0),
        stock: Number(p.stock ?? 0),
      }));
    return {
      status: 200,
      data: {
        totalTopSellingProducts: topProducts.filter((p) => p.totalSold > 0).length,
        [shopId]: { products: topProducts },
      },
    };
  }

  if (m === "GET" && path === "/sales/products/low-stock") {
    const shopId = params.shopId;
    const lowStock = db.products.filter(
      (p) =>
        (!shopId || String(p.shopId) === String(shopId)) &&
        Number(p.stock ?? p.initialStock ?? 0) < 10
    );
    return { status: 200, data: { totalLowStockProducts: lowStock.length } };
  }

  // ================= INVOICES =================
  if (m === "GET" && path === "/invoices") {
    const shopId = params.shopId;
    const list = db.invoices
      .filter((inv) => !shopId || String(inv.shopId) === String(shopId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { status: 200, data: { status: 200, data: list } };
  }

  // ================= CUSTOMERS =================
  if (m === "GET" && path === "/customers/stats") {
    const shopId = params.shopId;
    const list = shopId
      ? db.customers.filter((c) => String(c.shopId) === String(shopId))
      : db.customers;
    const favoriteCustomers = list.filter((c) => c.favorite || c.isFavorite).length;
    const totalPurchases = list.reduce(
      (sum, c) =>
        sum +
        (Array.isArray(c.purchases)
          ? c.purchases.reduce((ps, p) => ps + Number(p.purchaseCount || 0), 0)
          : 0),
      0
    );
    return {
      status: 200,
      data: {
        data: {
          totalCustomers: list.length,
          favoriteCustomers,
          totalPurchases,
          customers: list,
        },
      },
    };
  }

  if (m === "GET" && path === "/customers/search") {
    const shopId = params.shopId;
    const q = String(params.search || "").toLowerCase().trim();
    const list = db.customers.filter(
      (c) =>
        (!shopId || String(c.shopId) === String(shopId)) &&
        (!q ||
          c.name?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q))
    );
    return { status: 200, data: { data: list } };
  }

  if (m === "GET" && path === "/customers/growth") {
    const shopId = params.shopId;
    const list = shopId
      ? db.customers.filter((c) => String(c.shopId) === String(shopId))
      : db.customers;
    const now = new Date();
    const baseSeries = [4, 7, 10, 14, 18, 23];
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = list.filter((c) => {
        const cd = new Date(c.createdAt);
        return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
      }).length;
      data.push({
        month: MONTH_NAMES[d.getMonth()],
        users: baseSeries[5 - i] + count,
      });
    }
    return {
      status: 200,
      data: {
        data,
        lastUpdatedMonth: now.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      },
    };
  }

  if (m === "GET" && path === "/customers") {
    const shopId = params.shopId;
    const list = db.customers
      .filter((c) => !shopId || String(c.shopId) === String(shopId))
      .filter((c) => matchesDateFilters(c.createdAt, params));
    return { status: 200, data: { data: list } };
  }

  // ================= EMPLOYEES =================
  if (m === "GET" && path === "/employee") {
    const shopId = params.shopId;
    const list = shopId
      ? db.employees.filter((e) => String(e.dokaanId) === String(shopId))
      : db.employees;
    return { status: 200, data: { data: list } };
  }

  if (m === "POST" && path === "/employee") {
    const newEmp = {
      id: db.nextIds.employee++,
      dokaanId: Number(body.dokaanId || 1),
      name: body.name || "New Staff",
      email: body.email || "staff@dokaan.demo",
      shopRole: body.shopRole || "Cashier",
      salary: Number(body.salary || 0),
      workDays: body.workDays || "Sat-Thu",
      workHours: body.workHours || "9am - 6pm",
      workLocation: body.workLocation || "Main Branch",
      workStatus: body.workStatus || "active",
    };
    db.employees.unshift(newEmp);

    // Also add employee account so they can sign in during demo if desired!
    if (body.email && body.password) {
      const exists = db.users.some(
        (u) => u.email.toLowerCase() === body.email.toLowerCase()
      );
      if (!exists) {
        db.users.push({
          id: db.nextIds.user++,
          name: newEmp.name,
          email: newEmp.email,
          password: body.password,
          role: "employee",
          twoFactorEnabled: false,
          subscriptionStatus: true,
          profileImageUrl: null,
          shopIds: [newEmp.dokaanId],
          createdAt: new Date().toISOString(),
        });
      }
    }

    saveDemoDb(db);
    return { status: 201, data: { status: 201, data: newEmp } };
  }

  // ================= EXPENSES & ANALYTICS =================
  if (m === "GET" && path === "/expenses/income-statement") {
    const shopId = params.shopId || 1;
    const { statement } = computeAnalytics(db, shopId, params);
    return { status: 200, data: { data: statement } };
  }

  if (m === "GET" && path === "/expenses/financial-report") {
    const shopId = params.shopId || 1;
    const { report } = computeAnalytics(db, shopId, params);
    return { status: 200, data: { data: report } };
  }

  if (m === "GET" && path === "/expenses") {
    const shopId = params.shopId;
    const list = db.expenses
      .filter((e) => !shopId || String(e.shopId) === String(shopId))
      .filter((e) => matchesDateFilters(e.date || e.updated_at, params))
      .sort((a, b) => new Date(b.date || b.updated_at) - new Date(a.date || a.updated_at));
    return { status: 200, data: { data: list } };
  }

  if (m === "POST" && path === "/expenses") {
    const shopId = Number(body.shopId || params.shopId || 1);
    const shop = db.shops.find((s) => String(s.id) === String(shopId)) || db.shops[0];
    const nowIso = body.date ? new Date(body.date).toISOString() : new Date().toISOString();
    const newEntry = {
      id: db.nextIds.expense++,
      shopId,
      title: body.title || body.notes || body.category || "Expense",
      notes: body.notes || body.title || "",
      amount: Number(body.amount || 0),
      category: body.category || "General",
      type: body.type || "variable",
      isPaid: body.type === "fixed" ? false : true,
      date: nowIso,
      updated_at: nowIso,
      createdBy: {
        id: activeUser?.id || 101,
        name: activeUser?.name || "Arbin Zaman",
      },
      shop: { id: shop.id, name: shop.dokaan_name },
    };
    db.expenses.unshift(newEntry);
    saveDemoDb(db);
    return { status: 201, data: { status: 201, data: newEntry } };
  }

  const expenseIdMatch = path.match(/^\/expenses\/([^/]+)$/);
  if (m === "PUT" && expenseIdMatch) {
    const id = expenseIdMatch[1];
    const target = db.expenses.find((e) => String(e.id) === String(id));
    if (!target) return { status: 404, data: { message: "Expense not found." } };
    if (body.title !== undefined) target.title = body.title;
    if (body.notes !== undefined) target.notes = body.notes;
    if (body.amount !== undefined) target.amount = Number(body.amount);
    if (body.category !== undefined) target.category = body.category;
    if (body.isPaid !== undefined) target.isPaid = Boolean(body.isPaid);
    if (body.date !== undefined) target.date = new Date(body.date).toISOString();
    target.updated_at = new Date().toISOString();
    saveDemoDb(db);
    return { status: 200, data: { status: 200, data: target } };
  }

  // ================= PLATFORM USERS (ADMIN) =================
  if (m === "GET" && path === "/user/user-growth") {
    const now = new Date();
    const counts = [6, 11, 16, 22, 29, 36 + db.users.length];
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({ month: MONTH_NAMES[d.getMonth()], users: counts[5 - i] });
    }
    return { status: 200, data: { data } };
  }

  if (m === "GET" && path === "/user") {
    return { status: 200, data: { data: db.users.map(sanitizeUser) } };
  }

  const userIdMatch = path.match(/^\/user\/([^/]+)$/);
  if (m === "DELETE" && userIdMatch) {
    const id = userIdMatch[1];
    db.users = db.users.filter((u) => String(u.id) !== String(id));
    saveDemoDb(db);
    return { status: 200, data: { status: 200, message: "User deleted." } };
  }

  // ================= ORDERS (DEMO INTERACTIVE) =================
  if (m === "GET" && path === "/orders") {
    const shopId = params.shopId;
    const list = shopId
      ? db.orders.filter((o) => String(o.shopId) === String(shopId))
      : db.orders;
    return { status: 200, data: { data: list } };
  }

  const orderIdMatch = path.match(/^\/orders\/([^/]+)$/);
  if ((m === "PUT" || m === "PATCH") && orderIdMatch) {
    const id = decodeURIComponent(orderIdMatch[1]);
    const target = db.orders.find((o) => String(o.id) === id);
    if (!target) return { status: 404, data: { message: "Order not found." } };
    if (body.status) target.status = body.status;
    saveDemoDb(db);
    return { status: 200, data: { status: 200, data: target } };
  }

  return {
    status: 404,
    data: { message: `Demo endpoint not implemented: ${m} ${path}` },
  };
};

export const installDemoServer = () => {
  if (installed) return;
  installed = true;

  // Ensure initial demo database is seeded in localStorage
  getDemoDb();

  // Only intercept when Demo Mode is explicitly active OR logging into a @dokaan.demo account.
  // Real user logins, signups, and sessions pass directly through to the live backend!
  const shouldInterceptRequest = (fullUrl, method, rawBody, headers) => {
    if (!isApiRequest(fullUrl)) return false;

    const m = String(method || "GET").toUpperCase();
    const { path } = extractEndpointAndQuery(fullUrl, null);

    // Explicit login check: @dokaan.demo uses offline demo; all other emails go to the real backend
    if (m === "POST" && path === "/auth/login") {
      try {
        const parsed =
          typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody || {};
        const email = String(parsed.email || "").toLowerCase().trim();
        if (email.endsWith("@dokaan.demo")) {
          setDemoModeActive(true);
          return true;
        }
        setDemoModeActive(false);
        return false;
      } catch {
        return false;
      }
    }

    // Check active demo mode or demo token header
    const authHeader = headers?.Authorization || headers?.authorization || "";
    if (String(authHeader).startsWith("demo-token-")) return true;
    return isDemoModeActive();
  };

  // 1. Intercept axios API calls ONLY in Demo Mode
  const defaultAxiosAdapter = axios.defaults.adapter;
  axios.defaults.adapter = async (config) => {
    const fullUrl = config.baseURL
      ? `${config.baseURL.replace(/\/+$/, "")}/${String(config.url || "").replace(/^\/+/, "")}`
      : String(config.url || "");

    if (!shouldInterceptRequest(fullUrl, config.method, config.data, config.headers)) {
      if (typeof defaultAxiosAdapter === "function") {
        return defaultAxiosAdapter(config);
      }
      return axios.getAdapter(defaultAxiosAdapter)(config);
    }

    const result = await handleDemoApiRequest({
      method: config.method,
      rawUrl: fullUrl,
      params: config.params,
      body: config.data,
      headers: config.headers,
    });

    const responseObj = {
      data: result.data,
      status: result.status,
      statusText: result.status >= 200 && result.status < 300 ? "OK" : "Error",
      headers: { "content-type": "application/json" },
      config,
      request: {},
    };

    if (result.status >= 400) {
      const err = new Error(result.data?.message || `Request failed with status ${result.status}`);
      err.isAxiosError = true;
      err.config = config;
      err.response = responseObj;
      throw err;
    }

    return responseObj;
  };

  // 2. Intercept window.fetch API calls ONLY in Demo Mode
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const method = init.method || (typeof input !== "string" && input?.method) || "GET";
    const headersObj = {};
    if (init.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((v, k) => {
          headersObj[k] = v;
        });
      } else {
        Object.assign(headersObj, init.headers);
      }
    }

    if (!shouldInterceptRequest(url, method, init.body, headersObj)) {
      return originalFetch(input, init);
    }

    const result = await handleDemoApiRequest({
      method,
      rawUrl: url,
      params: null,
      body: init.body,
      headers: headersObj,
    });

    return new Response(JSON.stringify(result.data), {
      status: result.status,
      statusText: result.status >= 200 && result.status < 300 ? "OK" : "Error",
      headers: { "Content-Type": "application/json" },
    });
  };
};
