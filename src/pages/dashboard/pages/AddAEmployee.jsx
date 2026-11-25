import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
  KeyRound,
  Shield,
} from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const formatClockTime = (t) => {
  if (!t || !t.includes(":")) return "";
  const [rawH, rawM] = t.split(":");
  let h = Number(rawH);
  const m = Number(rawM);
  if (Number.isNaN(h)) return "";
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2, "0")}${ampm}` : `${h}${ampm}`;
};

const AddAEmployee = () => {
  const { dokaan, savedShop } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shopList = Array.isArray(dokaan)
    ? dokaan.filter(Boolean)
    : dokaan
    ? [dokaan]
    : [];

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    shopRole: "Cashier",
    salary: "",
    workLocation: savedShop?.dokaan_location || "",
    workDays: "Sat,Sun,Mon,Tue,Wed,Thu",
    workStartTime: "09:00",
    workEndTime: "18:00",
    workHours: "9am - 6pm",
    workStatus: "active",
    dokaanId: savedShop?.id ? String(savedShop.id) : shopList[0]?.id ? String(shopList[0].id) : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "workStartTime" || name === "workEndTime") {
        const start = name === "workStartTime" ? value : prev.workStartTime;
        const end = name === "workEndTime" ? value : prev.workEndTime;
        const fStart = formatClockTime(start);
        const fEnd = formatClockTime(end);
        if (fStart && fEnd) {
          updated.workHours = `${fStart} - ${fEnd}`;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nowDate = new Date().toISOString().slice(0, 10);
    const startObj = new Date(`${nowDate}T${form.workStartTime || "09:00"}:00`);
    const endObj = new Date(`${nowDate}T${form.workEndTime || "18:00"}:00`);

    if (Number.isNaN(startObj.getTime()) || Number.isNaN(endObj.getTime())) {
      toast.error("Please enter valid work start and end times.");
      return;
    }

    const token = Cookies.get("XTOKEN");
    setIsSubmitting(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      shopRole: form.shopRole.trim() || "Employee",
      dokaanId: Number(form.dokaanId),
      salary: Number(form.salary) || 0,
      workLocation: form.workLocation.trim(),
      workDays: form.workDays.trim(),
      workStartTime: startObj.toISOString(),
      workEndTime: endObj.toISOString(),
      workHours: form.workHours,
      workStatus: form.workStatus,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/employee`,
        payload,
        {
          headers: token ? { Authorization: `${token}` } : undefined,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee added successfully!");
      navigate("/dashboard/employee");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(
        error?.response?.data?.message || "Failed to add employee."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-2 sm:px-4 py-6 mb-10">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <User size={16} className="text-indigo-500" />
                Name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahim Uddin"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Shield size={16} className="text-purple-500" />
                Role
              </span>
              <input
                type="text"
                name="shopRole"
                value={form.shopRole}
                onChange={handleChange}
                placeholder="Cashier / Manager"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Mail size={16} className="text-sky-500" />
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <KeyRound size={16} className="text-amber-500" />
                Password
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              <DollarSign size={16} className="text-emerald-500" />
              Monthly Salary
            </span>
            <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="px-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ৳
              </span>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="15000"
                required
                min={0}
                className="w-full bg-transparent text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none"
              />
            </div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Calendar size={16} className="text-purple-500" />
                Work Days
              </span>
              <input
                type="text"
                name="workDays"
                value={form.workDays}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Sat,Sun,Mon,Tue,Wed,Thu"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <MapPin size={16} className="text-amber-500" />
                Work Location
              </span>
              <input
                type="text"
                name="workLocation"
                value={form.workLocation}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Main Shop"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Clock size={16} className="text-sky-500" />
                Work Start Time
              </span>
              <input
                type="time"
                name="workStartTime"
                value={form.workStartTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Clock size={16} className="text-sky-500" />
                Work End Time
              </span>
              <input
                type="time"
                name="workEndTime"
                value={form.workEndTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="flex items-center gap-2 mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              <Briefcase size={16} className="text-orange-500" />
              Select Shop
            </span>
            <select
              name="dokaanId"
              value={form.dokaanId}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Choose a shop
              </option>
              {shopList.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.dokaan_name} ({shop.dokaan_location})
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {isSubmitting ? "Adding Employee..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAEmployee;
