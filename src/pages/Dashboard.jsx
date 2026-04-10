import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
   TrendingUp,
    CheckSquare,
     Settings as SettingsIcon,
  LogOut, 
  Plus,
   Search, 
   Edit2, 
   Trash2, 
   Zap, 
   Bell,
    Menu, X
} from "lucide-react"
import { getCustomers,
   createCustomer, 
   updateCustomer, 
   deleteCustomer } from "../services/api"
import Leads    from "../components/Leads"
import Tasks    from "../components/Tasks"
import Settings from "../components/Settings"

//status badge
const Badge = ({ status }) => {
  const map = {
    Active:   "bg-emerald-100 text-emerald-700",
    Lead:     "bg-amber-100 text-amber-700",
    Inactive: "bg-red-100 text-red-700",
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  )
}

//avatar component
const Avatar = ({ name, size = "sm" }) => {
  const s = size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-base"
  return (
    <div className={`${s} rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [page, setPage]           = useState("customers")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [search, setSearch]       = useState("")
  const [sidebarOpen, setSidebar] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const res = await getCustomers()
      setCustomers(res.data.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return
    await deleteCustomer(id)
    setCustomers(prev => prev.filter(c => c._id !== id))
  }

  const filtered = customers.filter(c =>
    [c.name, c.company, c.email].some(f =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const stats = [
    { label: "Total",    val: customers.length,                          color: "text-slate-800",   bg: "bg-white" },
    { label: "Active",   val: customers.filter(c=>c.status==="Active").length,   color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Leads",    val: customers.filter(c=>c.status==="Lead").length,     color: "text-amber-600",   bg: "bg-amber-50" },
    { label: "Inactive", val: customers.filter(c=>c.status==="Inactive").length, color: "text-red-500",     bg: "bg-red-50" },
  ]

  const navItems = [
    { id: "customers", label: "Customers", icon: Users,          badge: customers.length },
    { id: "leads",     label: "Leads",     icon: TrendingUp,     badge: customers.filter(c=>c.status==="Lead").length },
    { id: "tasks",     label: "Tasks",     icon: CheckSquare,    badge: null },
    { id: "settings",  label: "Settings",  icon: SettingsIcon,   badge: null },
  ]

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebar(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-slate-200
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
  
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Nexus CRM</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebar(false)}>
            <X size={18} />
          </button>
        </div>

   
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button key={id}
              onClick={() => { setPage(id); setSidebar(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${page === id
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <Icon size={17} className={page === id ? "text-violet-600" : "text-slate-400"} />
              <span className="flex-1 text-left">{label}</span>
              {badge > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${page === id ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>


        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={user?.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
            </div>
            <button onClick={logout}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

   
        <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center gap-4 flex-shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebar(true)}>
            <Menu size={20} />
          </button>
          <h1 className="text-base font-bold text-slate-800">
            {navItems.find(n => n.id === page)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
              <Bell size={15} />
            </button>
            <Avatar name={user?.name} />
          </div>
        </header>

  
        <main className="flex-1 overflow-y-auto p-6">

     
          {page === "customers" && (
            <div className="space-y-5">

            
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, val, color, bg }) => (
                  <div key={label} className={`${bg} rounded-2xl p-5 border border-slate-200`}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${color}`}>{val}</p>
                  </div>
                ))}
              </div>

            
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <button
                  onClick={() => { setEditItem(null); setShowForm(true) }}
                  className="flex items-center gap-2 h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-md hover:shadow-violet-200 active:scale-95">
                  <Plus size={15} /> Add Customer
                </button>
              </div>

         
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-3" />
                  <p className="text-sm">Loading customers...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">
                  <Users size={40} className="mb-3 opacity-30" />
                  <h3 className="font-semibold text-slate-600 mb-1">{search ? "No results found" : "No customers yet"}</h3>
                  <p className="text-sm">{search ? "Try different search" : "Click 'Add Customer' to get started"}</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {["Name","Email","Phone","Company","Status","Actions"].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(c => (
                        <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={c.name} />
                              <span className="font-medium text-slate-800">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{c.email || "—"}</td>
                          <td className="px-4 py-3 text-slate-500">{c.phone || "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{c.company || "—"}</td>
                          <td className="px-4 py-3"><Badge status={c.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => { setEditItem(c); setShowForm(true) }}
                                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-violet-500 hover:bg-violet-50 hover:border-violet-300 transition-all">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => handleDelete(c._id)}
                                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-300 transition-all">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {page === "leads"    && <Leads customers={customers} />}
          {page === "tasks"    && <Tasks />}
          {page === "settings" && <Settings user={user} />}
        </main>
      </div>


      {showForm && (
        <CustomerModal
          customer={editItem}
          onClose={() => { setShowForm(false); setEditItem(null) }}
          onSaved={load}
        />
      )}
    </div>
  )
}

// modal component for adding/editing customers
function CustomerModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:    customer?.name    || "",
    email:   customer?.email   || "",
    phone:   customer?.phone   || "",
    company: customer?.company || "",
    status:  customer?.status  || "Lead",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const validate = () => {
    let err = {}
    if (!form.name.trim()) err.name = "Name is required"
    setErrors(err)
    return !Object.keys(err).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      customer ? await updateCustomer(customer._id, form) : await createCustomer(form)
      await onSaved()
      onClose()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    Lead:     "border-amber-400 bg-amber-50 text-amber-700",
    Active:   "border-emerald-400 bg-emerald-50 text-emerald-700",
    Inactive: "border-red-400 bg-red-50 text-red-500",
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{customer ? "Edit Customer" : "Add New Customer"}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name *</label>
            <input
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="John Doe"
              className={`w-full h-10 px-3.5 rounded-xl border text-sm outline-none transition-all bg-slate-50
                ${errors.name ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white"}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
            <input
              type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              placeholder="john@company.com"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
            />
          </div>

          {/* Phone + Company */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Phone</label>
              <input
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Company</label>
              <input
                value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                placeholder="Acme Corp"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Status</label>
            <div className="flex gap-2">
              {["Lead","Active","Inactive"].map(s => (
                <button type="button" key={s}
                  onClick={() => setForm({...form, status: s})}
                  className={`flex-1 h-9 rounded-xl border-2 text-xs font-bold transition-all
                    ${form.status === s ? statusColors[s] : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</>
                : customer ? "Update" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}