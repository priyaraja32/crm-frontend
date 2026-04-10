import React, { useState } from "react"
import { User, Check } from "lucide-react"

export default function Settings({ user }) {
  const [name, setName]   = useState(user?.name || "")
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    localStorage.setItem("user", JSON.stringify({...user, name}))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <User size={16} className="text-violet-500" /> Profile Information
          </h3>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Display Name</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email Address</label>
              <input
                value={user?.email || ""} disabled
                className="w-full h-10 px-3.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>
            <button type="submit"
              className={`h-10 px-6 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                ${saved ? "bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
              {saved ? <><Check size={14}/> Saved!</> : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Account Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-5">Account</h3>
          {[
            ["Plan",         "Free Trial (14 days)"],
            ["Member since", "March 2026"],
            ["Role",         "Admin"],
            ["Status",       "Active"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-800">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}