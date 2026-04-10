import React, { useState, useRef, useEffect } from "react"
import {
  User, Check, Settings as SettingsIcon, ChevronUp,
  LogOut, SlidersHorizontal, CreditCard
} from "lucide-react"

export default function Settings({ user }) {
  const [name, setName]       = useState(user?.name || "")
  const [saved, setSaved]     = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const save = (e) => {
    e.preventDefault()
    localStorage.setItem("user", JSON.stringify({ ...user, name }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initial = (name || user?.name || "U").charAt(0).toUpperCase()

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-violet-100 p-6">
          <h3 className="text-sm font-semibold text-violet-700 mb-5 flex items-center gap-2">
            <User size={14} className="text-violet-500" />
            Profile information
          </h3>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">
                Display name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 px-3.5 rounded-xl border border-violet-100 bg-violet-50/40 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">
                Email address
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full h-10 px-3.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed</p>
            </div>
            <button
              type="submit"
              className={`h-9 px-5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5
                ${saved
                  ? "bg-emerald-500 text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white"}`}
            >
              {saved ? <><Check size={13}/> Saved!</> : "Save changes"}
            </button>
          </form>
        </div>

        {/* Account Card */}
        <div className="bg-white rounded-2xl border border-violet-100 p-6">
          <h3 className="text-sm font-semibold text-violet-700 mb-5 flex items-center gap-2">
            <CreditCard size={14} className="text-violet-500" />
            Account
          </h3>
          {[
            { label: "Plan",         value: "Free Trial",  chip: "14 days",  chipColor: "bg-amber-100 text-amber-700" },
            { label: "Member since", value: "March 2026" },
            { label: "Role",         value: "Admin",       chip: "Admin",    chipColor: "bg-violet-100 text-violet-700" },
            { label: "Status",       value: null,          chip: "Active",   chipColor: "bg-emerald-100 text-emerald-700" },
          ].map(({ label, value, chip, chipColor }) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-400">{label}</span>
              <div className="flex items-center gap-2">
                {value && <span className="text-xs font-semibold text-slate-700">{value}</span>}
                {chip  && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${chipColor}`}>{chip}</span>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}