import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, Zap } from "lucide-react"
import { loginUser } from "../services/api"

export default function Login() {
  const navigate = useNavigate()
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiErr, setApiErr]   = useState("")
  const [form, setForm]       = useState({ email: "", password: "" })
  const [errors, setErrors]   = useState({})

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
    setApiErr("")
  }

  const validate = () => {
    let err = {}
    if (!form.email.trim())    err.email    = "Email is required"
    if (!form.password.trim()) err.password = "Password is required"
    setErrors(err)
    return !Object.keys(err).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const res = await loginUser(form)
      const { token, user } = res.data.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/dashboard")
    } catch (err) {
      setApiErr(err?.response?.data?.message || "Invalid credentials")
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
            Every customer<br />
            <span className="text-violet-400 italic">relationship</span><br />
            matters.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Manage leads, close deals, and grow your business from one powerful workspace.
          </p>
        </div>
        <div className="relative z-10 flex gap-8">
          {[["12k+","Active Users"],["98%","Satisfaction"],["3x","Faster Deals"]].map(([n,l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-white">{n}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{l}</div>
            </div>
          ))}
        </div>
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

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your workspace</p>

          {apiErr && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              <span>⚠</span> {apiErr}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" name="email" value={form.email} onChange={change}
                  placeholder="name@company.com"
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all
                    ${errors.email
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white"}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <span className="text-xs text-violet-600 cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={show ? "text" : "password"} name="password" value={form.password} onChange={change}
                  placeholder="••••••••"
                  className={`w-full h-11 pl-10 pr-11 rounded-xl border text-sm outline-none transition-all
                    ${errors.password
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white"}`}
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Signing in...</>
                : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-violet-600 font-semibold cursor-pointer hover:underline">
              Create one free
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}