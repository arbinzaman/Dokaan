import { useState } from "react";
import {
  User,
  Mail,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useUser } from "../../../contexts/AuthContext";

const defaultTimetable = {
  workDays: "Mon-Fri",
  workStartTime: "09:00",
  workEndTime: "20:00",
};

const AddEmployee = ({ onSubmit }) => {
  const { dokaan } = useUser();
  console.log(dokaan);

  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    workLocation: "",
    workDays: defaultTimetable.workDays,
    workStartTime: defaultTimetable.workStartTime,
    workEndTime: defaultTimetable.workEndTime,
    dokaanId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 mb-10">
      <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/30 border border-white/20 rounded-2xl shadow-lg p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
          ✨ Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Email & Salary */}
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
                <DollarSign
                  size={20}
                  className="text-green-400 animate-pulse"
                />
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
                />
              </div>
            </label>
          </div>

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

export default AddEmployee;
