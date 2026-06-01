import React from "react";
import { motion } from "motion/react";
import { Activity, ShieldAlert, BadgePercent, Coins, Clock, CheckSquare } from "lucide-react";
import { SystemStats, AuditLog } from "../types";

interface AnalyticsTabProps {
  stats: SystemStats;
  auditLogs: AuditLog[];
  setActiveTab: (tab: "analytics" | "tester" | "logs" | "config") => void;
}

export default function AnalyticsTab({ stats, auditLogs, setActiveTab }: AnalyticsTabProps) {
  const totalProcessed = stats.totalPassed + stats.totalBlocked + stats.totalWarnings;
  
  // Calculate compliance rate
  const complianceRate = totalProcessed > 0
    ? ((stats.totalPassed / totalProcessed) * 100).toFixed(1)
    : "100";

  // Filter logs safely to calculate hit statistics
  const piiHits = auditLogs.filter(l => l.checksBreakdown?.pii && !l.checksBreakdown.pii.passed).length;
  const techHits = auditLogs.filter(l => l.checksBreakdown?.tech && !l.checksBreakdown.tech.passed).length;
  const tokenHits = auditLogs.filter(l => l.checksBreakdown?.tokens && !l.checksBreakdown.tokens.passed).length;
  const policyHits = auditLogs.filter(l => l.checksBreakdown?.compliance && !l.checksBreakdown.compliance.passed).length;

  const maxViolation = Math.max(1, piiHits + techHits + tokenHits + policyHits);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Ingress Monitoring</h2>
        <p className="text-sm text-slate-500">Live prompt audit streams, security posture index, and cost containment analytics.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Processed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Prompts Audited</span>
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 font-mono">{totalProcessed}</span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">Live Stream</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Active historical prompt checks tracked</p>
        </div>

        {/* Card 2: PII Blocked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blocked Intrusions</span>
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600 border border-rose-100">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 font-mono">{stats.totalBlocked}</span>
            {stats.totalBlocked > 0 ? (
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md">Critical</span>
            ) : (
              <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded-md">Zero Risk</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">Prevented leakage of PII & key attacks</p>
        </div>

        {/* Card 3: Compliance Index */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance Index</span>
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100">
              <BadgePercent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 font-mono">{complianceRate}%</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">vs Limit</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Prompts cleared without incident</p>
        </div>

        {/* Card 4: Tokens Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tokens Limit Saved</span>
            <div className="bg-amber-50 p-2 rounded-xl text-amber-600 border border-amber-100">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">{stats.estimatedTokensSaved}</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Efficiency</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Drawn from blocked cost-heavy requests</p>
        </div>
      </div>

      {/* Main Grid: Performance indicators split with hit distribution details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Latency Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-2 space-y-6 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Gate Inspection Layer Statistics</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Average Parsing Delay</span>
              <span className="font-mono text-xl font-extrabold text-slate-800 flex items-center space-x-2">
                <Clock className="w-4.5 h-4.5 text-indigo-500" />
                <span>{stats.averageLatencyMs} ms</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-2">Local fast-regex fires in under 1ms. Advanced AI evaluation takes remaining time.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Model Node Status</span>
              <span className="font-mono text-xl font-extrabold text-emerald-600 flex items-center space-x-2">
                <CheckSquare className="w-4.5 h-4.5 text-emerald-500" />
                <span>Gemini API Certified</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-2">AI-driven semantic classifier operates continuously as the heavy checker.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Execution Pipeline Phases</h4>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">PHASE 01</span>
                  <span className="text-xs font-semibold text-slate-700">Abuse Token Quota Check</span>
                </div>
                <span className="text-xs text-slate-400 italic">Pre-filtering Stage</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">PHASE 02</span>
                  <span className="text-xs font-semibold text-slate-700">Customer PII Identity Scan</span>
                </div>
                <span className="text-xs text-slate-400 italic">Strict Local Regex Check</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">PHASE 03</span>
                  <span className="text-xs font-semibold text-slate-700">Corporate Blacklisted Terms Inspection</span>
                </div>
                <span className="text-xs text-slate-400 italic">Precompiled List Search</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">PHASE 04</span>
                  <span className="text-xs font-semibold text-slate-700">Multi-Layer Semantic Integrity (AI Layer)</span>
                </div>
                <span className="text-xs text-indigo-600 font-bold bg-indigo-55 bg-indigo-50/50 px-2.5 py-0.5 rounded-lg border border-indigo-100">Gemini LLM Classifier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hit Distribution Details bar graph */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-1">Audit Incident Distribution</h3>
            <p className="text-xs text-slate-500 mb-6">Breakdown of intercepted guardrail anomalies.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {stats.totalBlocked + stats.totalWarnings === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3 border border-slate-200">
                  ✓
                </div>
                <p className="text-xs font-semibold text-slate-500">Perfect Guardrail State</p>
                <p className="text-[10px] text-slate-400 mt-1">No security incident alerts have triggered on the active pipeline files.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* PII bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                    <span>PII Data Leaks</span>
                    <span className="font-mono text-slate-700">{piiHits} incidents</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${(piiHits / maxViolation) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Injection bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                    <span>Prompt Injection & Jailbreaks</span>
                    <span className="font-mono text-slate-700">{techHits} incidents</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${(techHits / maxViolation) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Token block bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                    <span>Costly Oversized Requests</span>
                    <span className="font-mono text-slate-700">{tokenHits} incidents</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(tokenHits / maxViolation) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Corporate compliance bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                    <span>Corporate Policy Violations</span>
                    <span className="font-mono text-slate-700">{policyHits} incidents</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${(policyHits / maxViolation) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab("tester")}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Launch Playground Tester</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
