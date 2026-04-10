import React from "react"
import { TrendingUp } from "lucide-react"

export default function Leads({ customers = [] }) {
  const leads = customers.filter(c => c.status === "Lead")

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Leads</h2>
        <p className="text-sm text-slate-500">{leads.length} potential customers in pipeline</p>
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">
          <TrendingUp size={40} className="mb-3 opacity-30" />
          <h3 className="font-semibold text-slate-600 mb-1">No leads yet</h3>
          <p className="text-sm">Add customers with status "Lead" from the Customers tab</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {leads.map(lead => (
            <div key={lead._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-600 font-bold text-lg flex items-center justify-center flex-shrink-0">
                {lead.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 truncate">{lead.name}</h4>
                <p className="text-sm text-slate-500 truncate">{lead.company || "No company"}</p>
                <p className="text-xs text-slate-400 truncate">{lead.email || "No email"}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex-shrink-0">
                Lead
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}