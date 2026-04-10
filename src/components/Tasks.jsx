import React, { useState } from "react"
import { CheckSquare, Plus, X, Check } from "lucide-react"

const INIT = [
  { id: 1, title: "Follow up with Priya about demo",      done: false, priority: "High"   },
  { id: 2, title: "Send proposal to Quantum Systems",      done: false, priority: "High"   },
  { id: 3, title: "Schedule onboarding call",              done: true,  priority: "Medium" },
  { id: 4, title: "Update CRM contact details",            done: false, priority: "Low"    },
]

const priorityStyle = {
  High:   "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low:    "bg-emerald-100 text-emerald-700",
}

export default function Tasks() {
  const [tasks, setTasks]   = useState(INIT)
  const [input, setInput]   = useState("")
  const [priority, setPri]  = useState("Medium")

  const add = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), title: input, done: false, priority }])
    setInput("")
  }

  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t))
  const remove = (id) => setTasks(tasks.filter(t => t.id !== id))

  const pending   = tasks.filter(t => !t.done).length
  const completed = tasks.filter(t => t.done).length

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Tasks</h2>
        <p className="text-sm text-slate-500">{pending} pending · {completed} completed</p>
      </div>

      {/* Add Task */}
      <form onSubmit={add} className="flex gap-2">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        <select
          value={priority} onChange={e => setPri(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none text-slate-600">
          {["High","Medium","Low"].map(p => <option key={p}>{p}</option>)}
        </select>
        <button type="submit"
          className="h-10 w-10 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center justify-center transition-all">
          <Plus size={18} />
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id}
            className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 transition-all
              ${task.done ? "border-slate-100 opacity-60" : "border-slate-200"}`}>
            <button onClick={() => toggle(task.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${task.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300 hover:border-violet-400"}`}>
              {task.done && <Check size={13} className="text-white" strokeWidth={3} />}
            </button>
            <span className={`flex-1 text-sm ${task.done ? "line-through text-slate-400" : "text-slate-700"}`}>
              {task.title}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${priorityStyle[task.priority]}`}>
              {task.priority}
            </span>
            <button onClick={() => remove(task.id)}
              className="text-slate-300 hover:text-red-400 hover:bg-red-50 p-1 rounded-lg transition-all">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <CheckSquare size={36} className="mb-3 opacity-30" />
          <p className="text-sm">No tasks yet. Add one above!</p>
        </div>
      )}
    </div>
  )
}