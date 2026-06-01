import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sliders, 
  Settings, 
  Trash2, 
  Plus, 
  Save, 
  Check, 
  RefreshCw,
  Eye,
  Shield,
  HelpCircle,
  Server
} from "lucide-react";
import { GuardrailConfig } from "../types";

interface SecurityPolicyTabProps {
  config: GuardrailConfig;
  setConfig: (config: GuardrailConfig) => void;
  handleSaveConfig: (updatedConfig: GuardrailConfig) => void;
  isSavingConfig: boolean;
}

export default function SecurityPolicyTab({
  config,
  setConfig,
  handleSaveConfig,
  isSavingConfig,
}: SecurityPolicyTabProps) {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const word = newKeyword.trim().toLowerCase();
    if (config.customKeywords.includes(word)) {
      setNewKeyword("");
      return;
    }
    const updated = {
      ...config,
      customKeywords: [...config.customKeywords, word]
    };
    setConfig(updated);
    handleSaveConfig(updated);
    setNewKeyword("");
  };

  const handleRemoveKeyword = (word: string) => {
    const updated = {
      ...config,
      customKeywords: config.customKeywords.filter(k => k !== word)
    };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleToggleCheck = (checkKey: keyof typeof config.enabledChecks) => {
    const updated = {
      ...config,
      enabledChecks: {
        ...config.enabledChecks,
        [checkKey]: !config.enabledChecks[checkKey]
      }
    };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleTogglePattern = (patternId: string) => {
    const updated = {
      ...config,
      piiPatterns: config.piiPatterns.map(p => p.id === patternId ? { ...p, enabled: !p.enabled } : p)
    };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handlePatternSeverityChange = (patternId: string, severity: "block" | "alarm") => {
    const updated = {
      ...config,
      piiPatterns: config.piiPatterns.map(p => p.id === patternId ? { ...p, severity } : p)
    };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Security Gateway Policy</h2>
          <p className="text-sm text-slate-500">Enable algorithmic validation filters, restrict private keys, and configure API mitigation actions.</p>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <RefreshCw className={`w-3.5 h-3.5 ${isSavingConfig ? "animate-spin" : ""}`} />
            <span>Policy Auto-Syncs</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns (form params) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 01: Quotas and Actions */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>01. Ingestion Quotas and Mitigation Actions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Max Ingress Token Length</label>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={config.maxTokenLimit}
                  onChange={(e) => {
                    const updated = { ...config, maxTokenLimit: parseInt(e.target.value) };
                    setConfig(updated);
                  }}
                  onMouseUp={() => handleSaveConfig(config)}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                  <span>Standard Query (100)</span>
                  <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {config.maxTokenLimit} tokens
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Offense Over-quota Action</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  {(["alarm", "block"] as const).map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, maxTokenAction: act };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`py-1.5 rounded-lg text-2xs font-extrabold uppercase transition-all cursor-pointer ${
                        config.maxTokenAction === act
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                  How the Ingress gateway reacts if a user query exceeds maximum parameters.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Active PII Violation Mitigation Action</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                {(["alarm", "block", "redact"] as const).map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => {
                      const updated = { ...config, piiAction: act };
                      setConfig(updated);
                      handleSaveConfig(updated);
                    }}
                    className={`py-1.5 rounded-lg text-2xs font-extrabold uppercase transition-all cursor-pointer ${
                      config.piiAction === act
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 04: Advanced AI Evaluation Provider & Credentials */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>04. Advanced AI Evaluation engine & Credentials</span>
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-505">Evaluation:</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...config, disableAiEvaluation: !config.disableAiEvaluation };
                    setConfig(updated);
                    handleSaveConfig(updated);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    !config.disableAiEvaluation ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      !config.disableAiEvaluation ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-700 w-12">
                  {!config.disableAiEvaluation ? "ACTIVE" : "OFF"}
                </span>
              </div>
            </div>

            {config.disableAiEvaluation ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800">
                <p className="text-xs font-semibold leading-relaxed">
                  ⚠️ <strong>Master Switch Off:</strong> Advanced LLM Validation layers are deactivated. The gateway will function purely on fast local Regex scanning and static Keyword lists.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select AI Provider Service</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config, aiProvider: "gemini" as const };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        (config.aiProvider || "gemini") === "gemini"
                          ? "bg-white text-indigo-700 shadow-xs border border-indigo-100"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      Google Gemini
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config, aiProvider: "openai" as const };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        config.aiProvider === "openai"
                          ? "bg-white text-emerald-700 shadow-xs border border-emerald-100"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      OpenAI / Local LLM
                    </button>
                  </div>
                </div>

                {config.aiProvider === "openai" ? (
                  <div className="space-y-3.5 bg-slate-50/55 p-4 rounded-xl border border-slate-200 mt-2">
                    <p className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                      <span className="shrink-0 inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Configure Endpoint (e.g. OpenAI service or local LM Studio):
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Base URL</label>
                        <input
                          type="text"
                          value={config.openaiBaseUrl || ""}
                          onChange={(e) => {
                            const updated = { ...config, openaiBaseUrl: e.target.value };
                            setConfig(updated);
                          }}
                          onBlur={(e) => {
                            const updated = { ...config, openaiBaseUrl: e.target.value };
                            handleSaveConfig(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                          placeholder="http://localhost:1234/v1"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">API Secret Token / Key</label>
                        <input
                          type="password"
                          value={config.openaiApiKey || ""}
                          onChange={(e) => {
                            const updated = { ...config, openaiApiKey: e.target.value };
                            setConfig(updated);
                          }}
                          onBlur={(e) => {
                            const updated = { ...config, openaiApiKey: e.target.value };
                            handleSaveConfig(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                          placeholder="Enter your-lm-studio-token-here..."
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900 text-[10px] font-mono text-slate-350 p-3 rounded-lg border border-slate-800 mt-1 space-y-1">
                      <p className="text-emerald-400 font-bold">// Usage Example:</p>
                      <p className="text-slate-200 font-medium">from openai import OpenAI</p>
                      <p className="text-slate-200 font-medium">client = OpenAI(</p>
                      <p className="text-slate-200 font-medium font-semibold pl-4">base_url="{config.openaiBaseUrl || 'http://localhost:1234/v1'}",</p>
                      <p className="text-slate-200 font-medium font-semibold pl-4">api_key="{config.openaiApiKey ? '••••••••' : 'your-lm-studio-token-here'}"</p>
                      <p className="text-slate-200 font-medium">)</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                    <div className="text-[11px] text-slate-505 text-slate-500 leading-relaxed">
                      Powered by the native enterprise integration key for Google Gemini model, bypassing local endpoint fields. Ensure the <strong>GEMINI_API_KEY</strong> environment variable is defined.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 02: Verification layers switches */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>02. Security Gateway Filter Stages</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { key: "tech", title: "Jailbreaking & Threat Attacks", desc: "Halt prompt injections & framework manipulation attempts." },
                { key: "pii", title: "Identity Leak Scanners", desc: "Redact or block private credit card sequences immediately." },
                { key: "compliance", title: "Corporate Policy Filters", desc: "Restrict discussions violating corporate governance criteria." },
                { key: "safety", title: "Safety & Toxicity Inspection", desc: "Ensure messages are free of profanities and offensive intents." },
                { key: "context", title: "Context Validity Alignments", desc: "Ensure queries reference authorized workplace operations only." },
                { key: "tokens", title: "System Quota Protection", desc: "Audit query lengths to safeguard server memory thresholds." },
              ].map((layer) => {
                const isChecked = config.enabledChecks[layer.key as keyof typeof config.enabledChecks];
                return (
                  <div 
                    key={layer.key} 
                    onClick={() => handleToggleCheck(layer.key as keyof typeof config.enabledChecks)}
                    className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked 
                        ? "bg-indigo-50/40 border-indigo-200" 
                        : "bg-slate-50/50 border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="mt-1 accent-indigo-650 accent-indigo-600 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{layer.title}</p>
                      <p className="text-[10px] text-slate-400 group-hover:text-slate-500 leading-normal">{layer.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 03: Blacklisted Custom Keywords */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">03. Restricted Corporate Keywords Database</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddKeyword(); }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800"
                placeholder="Type word (e.g. project_codename) and hit enter..."
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-3 py-2 bg-slate-900 border border-transparent hover:bg-indigo-750 hover:bg-slate-850 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Keyword</span>
              </button>
            </div>

            {config.customKeywords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No custom words added yet. Any keywords described in workspace projects are passed cleanly.</p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-2">
                {config.customKeywords.map((word) => (
                  <span 
                    key={word}
                    className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg pl-2.5 pr-1 py-1 text-xs font-mono font-bold text-slate-700"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(word)}
                      className="w-5 h-5 rounded hover:bg-rose-50 text-slate-450 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Policies Snapshot and snapshots code snaps */}
        <div className="space-y-6">
          {/* Active Custom Regex pattern matching lists */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Regex Matching Signatures</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {config.piiPatterns.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No active regex definitions.</p>
              ) : (
                config.piiPatterns.map((pat) => (
                  <div key={pat.id} className="py-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800">{pat.name}</p>
                        <p className="font-mono text-[9px] text-slate-400 font-semibold">{pat.pattern}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Selector severity action */}
                        <select
                          value={pat.severity}
                          onChange={(e) => handlePatternSeverityChange(pat.id, e.target.value as "block" | "alarm")}
                          className="bg-slate-50 border border-slate-250 py-1 px-1.5 rounded-lg text-[10px] font-bold text-slate-600 focus:outline-none"
                        >
                          <option value="block">Block</option>
                          <option value="alarm">Alarm</option>
                        </select>

                        {/* Enable toggle checkbox */}
                        <input
                          type="checkbox"
                          checked={pat.enabled}
                          onChange={() => handleTogglePattern(pat.id)}
                          className="accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* JSON configuration Snap view, inspired by the HTML view of design spec! */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-extrabold uppercase text-slate-450 tracking-wider">Config Snapshot</h4>
              <span className="text-[10px] font-mono font-bold text-slate-400">stable-v1.4.2</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[10px] leading-relaxed overflow-x-auto text-slate-300">
              <pre className="text-indigo-300 whitespace-pre">
{JSON.stringify({ 
  policy: "strict_enterprise_compliance",
  auto_block: config.piiAction === "block" ? ["PII_LEAK", "THREATS_ATTACK"] : [],
  token_alarm: config.maxTokenLimit,
  scanners: Object.keys(config.enabledChecks).filter(k => config.enabledChecks[k as keyof typeof config.enabledChecks])
}, null, 2)}
              </pre>
            </div>
            
            <p className="text-[9px] text-slate-400 italic mt-2.5 block text-center">
              * Any modifications sync down dynamically to standard Redis caches.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
