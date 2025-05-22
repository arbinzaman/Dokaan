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
} from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";           // 1. Import toast
import { useNavigate } from "react-router-dom";              // 2. Import navigate

const AddAEmployee = () => {
  const { dokaan } = useUser();
  const navigate = useNavigate();                            // 3. Get navigate function

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    salary: 0,
    workLocation: "",
    workDays: "Mon,Tue,Wed,Thu,Fri",
    workStartTime: "09:00",
    workEndTime: "17:00",
    workHours: "9am - 5pm",
    workStatus: "active",
    dokaanId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: name === "salary" ? Number(value) : value };

      if (name === "workStartTime" || name === "workEndTime") {
        const start = name === "workStartTime" ? value : prev.workStartTime;
        const end = name === "workEndTime" ? value : prev.workEndTime;

        const formatTime = (t) => {
          let [h] = t.split(":");
          h = Number(h);
          const ampm = h >= 12 ? "pm" : "am";
          h = h % 12 || 12;
          return `${h}${ampm}`;
        };

        updated.workHours = `${formatTime(start)} - ${formatTime(end)}`;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("XTOKEN");

    const nowDate = new Date().toISOString().slice(0, 10);

    const workStartISO = new Date(`${nowDate}T${form.workStartTime}:00Z`).toISOString();
    const workEndISO = new Date(`${nowDate}T${form.workEndTime}:00Z`).toISOString();

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      dokaanId: Number(form.dokaanId),
      salary: Number(form.salary),
      workLocation: form.workLocation,
      workDays: form.workDays,
      workStartTime: workStartISO,
      workEndTime: workEndISO,
      workHours: form.workHours,
      workStatus: form.workStatus,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/employee`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      // Show success toast
      toast.success("Employee added successfully!", {
        position: "bottom-center",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          padding: "12px 24px",
          fontWeight: "600",
        },
      });

      // Navigate after short delay (to let toast show)
      setTimeout(() => {
        navigate("/dashboard/employee");
      }, 1500);
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee.", {
        position: "bottom-center",
        duration: 3000,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 mb-10">
      <Toaster /> {/* 4. Add toaster container */}
      <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/30 border border-white/20 rounded-2xl shadow-lg p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
          ✨ Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ... your existing form fields unchanged ... */}
          {/* Name */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
              <User size={20} className="text-pink-400 animate-pulse" />
              Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-300"
            />
          </label>

          {/* Email & Password */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
                <Mail size={20} className="text-blue-400 animate-pulse" />
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              />
            </label>

            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
                <KeyRound size={20} className="text-yellow-400 animate-pulse" />
                Password
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-300"
              />
            </label>
          </div>

          {/* Salary */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
              <DollarSign size={20} className="text-green-400 animate-pulse" />
              Salary
            </span>
            <div className="flex items-center rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white">
              <span className="px-3 text-lg text-green-300">৳</span>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Amount"
                required
                className="w-full bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300"
                min={0}
              />
            </div>
          </label>

          {/* Work Days & Location */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
                <Calendar size={20} className="text-purple-400 animate-pulse" />
                Work Days
              </span>
              <input
                type="text"
                name="workDays"
                value={form.workDays}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-300"
                placeholder="Mon,Tue,Wed,Thu,Fri"
              />
            </label>

            <label className="w-full sm:w-1/2 block">
              <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
                <MapPin size={20} className="text-yellow-400 animate-pulse" />
                Work Location
              </span>
              <input
                type="text"
                name="workLocation"
                value={form.workLocation}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-300"
                placeholder="Main Shop"
              />
            </label>
          </div>

          {/* Times */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
              <Clock size={20} className="text-cyan-400 animate-pulse" />
              Work Start Time
            </span>
            <input
              type="time"
              name="workStartTime"
              value={form.workStartTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
              <Clock size={20} className="text-cyan-400 animate-pulse" />
              Work End Time
            </span>
            <input
              type="time"
              name="workEndTime"
              value={form.workEndTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </label>

          {/* Shop Selection */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium text-white">
              <Briefcase size={20} className="text-orange-400 animate-pulse" />
              Select Shop
            </span>
            <select
              name="dokaanId"
              value={form.dokaanId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/30 bg-white/10 dark:bg-gray-700 text-white p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="" disabled>
                Choose a shop
              </option>
              {dokaan.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.dokaan_name} ({shop.dokaan_location})
                </option>
              ))}
            </select>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-yellow-500 hover:to-pink-500 text-white font-semibold py-2 rounded-xl transition-all shadow-lg hover:scale-105"
          >
            🚀 Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAEmployee;
