import React from "react";
import { Clock, Cpu, CheckCircle } from "lucide-react";
import { AuditLog } from "../types";

interface HeaderProps {
  logsCount: number;
}

export default function Header({ logsCount }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Gate Standard Online
        </span>
        <span className="text-xs text-slate-400 font-mono hidden md:inline border-l border-slate-200 pl-3">
          PORT: 3000 Ingress Node
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Latency meter */}
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gate Latency</p>
          <p className="text-xs font-mono font-extrabold text-slate-700">14ms average</p>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* User profile info / Audit metrics inline */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50">
            CE
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">cehvivek@gmail.com</p>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">Admin Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
