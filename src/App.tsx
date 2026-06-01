import { useState, useEffect } from "react";
import { 
  Shield, 
  Activity, 
  Settings, 
  ListTodo, 
  Terminal, 
  RefreshCw, 
  Lock,
  Server
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AnalyticsTab from "./components/AnalyticsTab";
import SandboxTab from "./components/SandboxTab";
import AuditLogsTab from "./components/AuditLogsTab";
import SecurityPolicyTab from "./components/SecurityPolicyTab";
import { GuardrailConfig, GuardrailResult, AuditLog, SystemStats } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"analytics" | "tester" | "logs" | "config">("analytics");
  const [stats, setStats] = useState<SystemStats>({
    totalPassed: 0,
    totalBlocked: 0,
    totalWarnings: 0,
    averageLatencyMs: 0,
    totalTokensProcessed: 0,
    estimatedTokensSaved: 0
  });

  const [config, setConfig] = useState<GuardrailConfig>({
    maxTokenLimit: 1500,
    maxTokenAction: "alarm",
    piiAction: "block",
    customKeywords: [],
    enabledChecks: {
      tech: true,
      compliance: true,
      safety: true,
      context: true,
      pii: true,
      tokens: true
    },
    piiPatterns: []
  });

  // Playground variables
  const [testPrompt, setTestPrompt] = useState("");
  const [testUserId, setTestUserId] = useState("developer_john");
  const [testUserIP, setTestUserIP] = useState("192.168.1.45");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<GuardrailResult | null>(null);
  
  // Audit Logs & Config lists
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Load configuration and statistics
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/guardrail/config");
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error("Failed to load config", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/guardrail/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/guardrail/logs");
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) {
      console.error("Failed to load log entries", err);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStats();
    fetchLogs();
  }, []);

  const handleSaveConfig = async (updatedConfig: GuardrailConfig) => {
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/guardrail/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig)
      });
      if (res.ok) {
        setConfig(updatedConfig);
      }
    } catch (err) {
      console.error("Save config error", err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestPrompt = async () => {
    if (!testPrompt.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch("/api/guardrail/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: testPrompt,
          userId: testUserId,
          userIP: testUserIP
        })
      });
      const data = await res.json();
      setEvaluationResult(data);
      
      // Refresh backend stats and logs after a new evaluation
      fetchStats();
      fetchLogs();
    } catch (err) {
      console.error("Evaluation runtime failed", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to delete all historical logs? This action is permanent and irreversible.")) return;
    try {
      const res = await fetch("/api/guardrail/logs", { method: "DELETE" });
      if (res.ok) {
        fetchLogs();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to clear historical records", err);
    }
  };

  return (
    <div className="h-full min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 border-t-2 border-indigo-650">
      
      {/* 1. Header (Top bar) */}
      <Header logsCount={auditLogs.length} />

      {/* 2. Main content container */}
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

        {/* Content body with custom transitions wrapping different tabs */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto bg-slate-55 bg-slate-50">
          
          {activeTab === "analytics" && (
            <AnalyticsTab stats={stats} auditLogs={auditLogs} setActiveTab={setActiveTab} />
          )}

          {activeTab === "tester" && (
            <SandboxTab 
              testPrompt={testPrompt}
              setTestPrompt={setTestPrompt}
              testUserId={testUserId}
              setTestUserId={setTestUserId}
              testUserIP={testUserIP}
              setTestUserIP={setTestUserIP}
              isEvaluating={isEvaluating}
              evaluationResult={evaluationResult}
              setEvaluationResult={setEvaluationResult}
              handleTestPrompt={handleTestPrompt}
            />
          )}

          {activeTab === "logs" && (
            <AuditLogsTab auditLogs={auditLogs} handleClearLogs={handleClearLogs} />
          )}

          {activeTab === "config" && (
            <SecurityPolicyTab 
              config={config} 
              setConfig={setConfig} 
              handleSaveConfig={handleSaveConfig} 
              isSavingConfig={isSavingConfig} 
            />
          )}

        </main>
      </div>

      {/* 3. Footer info bar */}
      <footer className="h-10 bg-slate-100 border-t border-slate-200 flex items-center px-6 justify-between shrink-0">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase italic">
          SECURED BY GUARDRAIL ENTERPRISE ENGINE
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">API Ingress Node 4: Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">Redis cache: Sync</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
