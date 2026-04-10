// import React, { useState } from "react"
// import { User, Check } from "lucide-react"

// export default function Settings({ user }) {
//   const [name, setName]   = useState(user?.name || "")
//   const [saved, setSaved] = useState(false)

//   const save = (e) => {
//     e.preventDefault()
//     localStorage.setItem("user", JSON.stringify({...user, name}))
//     setSaved(true)
//     setTimeout(() => setSaved(false), 2500)
//   }

//   return (
//     <div className="space-y-5 max-w-2xl">
//       <div>
//         <h2 className="text-lg font-bold text-slate-800">Settings</h2>
//         <p className="text-sm text-slate-500">Manage your account preferences</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl border border-slate-200 p-6">
//           <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
//             <User size={16} className="text-violet-500" /> Profile Information
//           </h3>
//           <form onSubmit={save} className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-slate-700 block mb-1.5">Display Name</label>
//               <input
//                 value={name} onChange={e => setName(e.target.value)}
//                 placeholder="Your name"
//                 className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-slate-700 block mb-1.5">Email Address</label>
//               <input
//                 value={user?.email || ""} disabled
//                 className="w-full h-10 px-3.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
//               />
//               <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
//             </div>
//             <button type="submit"
//               className={`h-10 px-6 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
//                 ${saved ? "bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
//               {saved ? <><Check size={14}/> Saved!</> : "Save Changes"}
//             </button>
//           </form>
//         </div>

//         {/* Account Card */}
//         <div className="bg-white rounded-2xl border border-slate-200 p-6">
//           <h3 className="font-bold text-slate-800 mb-5">Account</h3>
//           {[
//             ["Plan",         "Free Trial (14 days)"],
//             ["Member since", "March 2026"],
//             ["Role",         "Admin"],
//             ["Status",       "Active"],
//           ].map(([label, val]) => (
//             <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
//               <span className="text-sm text-slate-500">{label}</span>
//               <span className="text-sm font-semibold text-slate-800">{val}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

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

  // Close dropdown on outside click
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
    <div className="flex h-screen bg-violet-50/40 font-sans">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-56 bg-white border-r border-violet-100 flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-violet-100">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-800">Nexus CRM</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { label: "Customers", icon: <User size={15}/>, badge: 1 },
            { label: "Leads",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
            { label: "Tasks",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
            { label: "Settings",  icon: <SettingsIcon size={15}/>, active: true },
          ].map(item => (
            <div key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors
                ${item.active
                  ? "bg-violet-100 text-violet-700 font-medium"
                  : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"}`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-violet-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* ── Avatar + Dropdown ─────────────────────────────── */}
        <div className="p-3 border-t border-violet-100" ref={dropRef}>

          {/* Dropdown Menu — renders above the avatar button */}
          {dropOpen && (
            <div className="mb-2 bg-white border border-violet-100 rounded-xl shadow-lg overflow-hidden">
              {/* User info header */}
              <div className="px-3.5 py-3 border-b border-violet-50">
                <p className="text-sm font-semibold text-slate-800">{name || user?.name || "User"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email || "user@gmail.com"}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              {/* Menu items */}
              {[
                { icon: <User size={13}/>,              label: "View profile" },
                { icon: <SlidersHorizontal size={13}/>, label: "Preferences" },
              ].map(item => (
                <button key={item.label}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors text-left"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-violet-50 my-1" />
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                <LogOut size={13}/>
                Sign out
              </button>
            </div>
          )}

          {/* Avatar trigger button */}
          <button
            onClick={() => setDropOpen(v => !v)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-violet-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{name || user?.name || "User"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || "user@gmail.com"}</p>
            </div>
            <ChevronUp
              size={13}
              className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${dropOpen ? "rotate-0" : "rotate-180"}`}
            />
          </button>

        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-2xl">

          <h2 className="text-lg font-bold text-slate-800">Settings</h2>
          <p className="text-sm text-slate-400 mt-0.5 mb-6">Manage your account preferences</p>

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
      </main>
    </div>
  )
}