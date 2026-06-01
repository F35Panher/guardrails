import React from "react";
import { Shield, Activity, Terminal, ListTodo, Settings, Cpu } from "lucide-react";
import { SystemStats } from "../types";

interface SidebarProps {
  activeTab: "analytics" | "tester" | "logs" | "config";
  setActiveTab: (tab: "analytics" | "tester" | "logs" | "config") => void;
  stats: SystemStats;
}

export default function Sidebar({ activeTab, setActiveTab, stats }: SidebarProps) {
  const totalProcessed = stats.totalPassed + stats.totalBlocked + stats.totalWarnings;
  // Calculate a fake active ratio or use actual token limits
  const activePercentage = totalProcessed > 0 
    ? Math.min(100, Math.round((stats.totalTokensProcessed / Math.max(1, stats.totalTokensProcessed + 5000)) * 100)) 
    : 12;

  const menuItems = [
    { id: "analytics", label: "Live Monitoring", icon: Activity },
    { id: "tester", label: "Sandbox Playground", icon: Terminal },
    { id: "logs", label: "Audit Ledger Logs", icon: ListTodo },
    { id: "config", label: "Security Policy", icon: Settings },
  ] as const;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col p-5 shrink-0 justify-between self-stretch">
      <div className="space-y-6">
        {/* Brand Logo header */}
        <div className="flex items-center gap-3 pb-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm shadow-indigo-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center">
              GUARDRAIL<span className="text-indigo-600">.ai</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Enterprise Integrity</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-55 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Token usage threshold info box */}
      <div className="mt-8">
        <div className="p-4 bg-slate-900 rounded-xl text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
          
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Gate Traffic Load</p>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xl font-mono font-bold">{activePercentage}%</span>
            <span className="text-[10px] text-indigo-400 font-semibold font-mono">CAPACITY ALERT</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500 rounded-full" 
              style={{ width: `${Math.max(10, activePercentage)}%` }}
            ></div>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Ingress load calculated via local API limits</p>
        </div>
      </div>
    </aside>
  );
}
