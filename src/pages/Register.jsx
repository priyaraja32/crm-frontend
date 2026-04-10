import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User, Zap, CheckCircle } from "lucide-react"
import { registerUser } from "../services/api"

//   Register component
const Field = ({ label, name, type = "text", placeholder, icon: Icon, value, onChange, error }) => (
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all
          ${error
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
            : "border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white"}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiErr, setApiErr]   = useState("")
  const [form, setForm]       = useState({ name: "", email: "", password: "" })
  const [errors, setErrors]   = useState({})

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
    setApiErr("")
  }

  const validate = () => {
    let err = {}
    if (!form.name.trim())  err.name     = "Name is required"
    if (!form.email.trim()) err.email    = "Email is required"
    if (!form.password)     err.password = "Password is required"
    else if (form.password.length < 6) err.password = "Minimum 6 characters"
    setErrors(err)
    return !Object.keys(err).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const res = await registerUser(form)
      const { token, user } = res.data.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/dashboard")
    } catch (err) {
      setApiErr(err?.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-transparent to-indigo-800/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">Nexus CRM</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Start building<br />
            <span className="text-violet-400 italic">stronger</span><br />
            connections.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-10">
            Join thousands of teams already growing with Nexus CRM.
          </p>
          <div className="space-y-3">
            {["Unlimited customer records", "Real-time dashboard", "Smart lead tracking", "14-day free trial"].map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-violet-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-slate-600 text-xs">© 2026 Nexus CRM. All rights reserved.</p>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">Nexus CRM</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-8">Get started in under a minute</p>

          {apiErr && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              <span>⚠</span> {apiErr}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <Field label="Full Name"  name="name"     type="text"     placeholder="Name"                  icon={User} value={form.name}     onChange={change} error={errors.name} />
            <Field label="Work Email" name="email"    type="email"    placeholder="name@company.com"       icon={Mail} value={form.email}    onChange={change} error={errors.email} />
            <Field label="Password"   name="password" type="password" placeholder="minimum six characters" icon={Lock} value={form.password} onChange={change} error={errors.password} />

            <p className="text-xs text-slate-400">
              By creating an account, you agree to our{" "}
              <span className="text-violet-600 cursor-pointer">Terms</span> and{" "}
              <span className="text-violet-600 cursor-pointer">Privacy Policy</span>.
            </p>

            <button type="submit" disabled={loading}
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <span onClick={() => navigate("/")} className="text-violet-600 font-semibold cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}