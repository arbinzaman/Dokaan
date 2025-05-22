import { useState,  } from "react";
import {
  User,
  Mail,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";

const defaultTimetable = {
  workDays: "Mon-Fri",
  workStartTime: "09:00",
  workEndTime: "17:00",
};

const AddEmployee = ({ shops = [], onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    workLocation: "",
    workDays: defaultTimetable.workDays,
    workStartTime: defaultTimetable.workStartTime,
    workEndTime: defaultTimetable.workEndTime,
    dokaanId: "", // shop id
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
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Add New Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <User size={18} /> Name
          </span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Employee name"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Email */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <Mail size={18} /> Email
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email address"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Salary */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <DollarSign size={18} /> Salary (monthly)
          </span>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Salary in ৳"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Work Location */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <MapPin size={18} /> Work Location
          </span>
          <input
            type="text"
            name="workLocation"
            value={form.workLocation}
            onChange={handleChange}
            placeholder="Workplace address"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Work Days (default suggestion) */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <Calendar size={18} /> Work Days
          </span>
          <input
            type="text"
            name="workDays"
            value={form.workDays}
            onChange={handleChange}
            placeholder="E.g. Mon-Fri"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Work Start Time */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <Clock size={18} /> Work Start Time
          </span>
          <input
            type="time"
            name="workStartTime"
            value={form.workStartTime}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Work End Time */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <Clock size={18} /> Work End Time
          </span>
          <input
            type="time"
            name="workEndTime"
            value={form.workEndTime}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-white"
          />
        </label>

        {/* Shop Selection Dropdown */}
        <label className="block">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
            <Briefcase size={18} /> Select Shop
          </span>
          <select
            name="dokaanId"
            value={form.dokaanId}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="" disabled>
              Select a shop
            </option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
