import { environment } from '../config/environment';
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, AlertCircle, MessageSquarePlus, Phone, Mail, StickyNote, X, Search } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import CustomDatePicker from "@/components/CustomDatePicker";
import Pagination from "@/components/Pagination";

type LeadLog = {
  id: string;
  message: string;
  type: "call" | "message" | "email" | "note" | "status_change";
  createdAt: string;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  age?: string;
  state?: string;
  time?: string;
  status: string;
  logs: LeadLog[] | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "#3b82f6" },
  { value: "contacted", label: "Contacted", color: "#f59e0b" },
  { value: "follow_up", label: "Follow Up", color: "#a855f7" },
  { value: "interested", label: "Interested", color: "#10b981" },
  { value: "converted", label: "Converted", color: "#16a34a" },
  { value: "not_interested", label: "Not Interested", color: "#9ca3af" },
  { value: "lost", label: "Lost", color: "#ef4444" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  contacted: "bg-amber-500/10 text-amber-600 border-amber-200",
  follow_up: "bg-purple-500/10 text-purple-600 border-purple-200",
  interested: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  converted: "bg-green-500/10 text-green-700 border-green-200",
  not_interested: "bg-gray-500/10 text-gray-500 border-gray-200",
  lost: "bg-red-500/10 text-red-500 border-red-200",
};

const LOG_TYPE_OPTIONS = [
  { value: "call", label: "Call" },
  { value: "message", label: "Message" },
  { value: "email", label: "Email" },
  { value: "note", label: "Note" },
];

const LOG_TYPE_ICONS: Record<string, React.ReactNode> = {
  call: <Phone size={12} />,
  message: <MessageSquarePlus size={12} />,
  email: <Mail size={12} />,
  note: <StickyNote size={12} />,
  status_change: <RefreshCw size={12} />,
};

interface LeadsStats {
  total: number;
  byStatus: Record<string, number>;
}

export default function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Date filtering state
  const [dateRange, setDateRange] = useState("7days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Log drawer state
  const [logDrawerLead, setLogDrawerLead] = useState<Lead | null>(null);
  const [newLogMessage, setNewLogMessage] = useState("");
  const [newLogType, setNewLogType] = useState("note");
  const [isAddingLog, setIsAddingLog] = useState(false);

  // Search & status filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Stats state
  const [stats, setStats] = useState<LeadsStats | null>(null);
  const [showStats, setShowStats] = useState(false);

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 days" },
    { value: "1month", label: "Last month" },
    { value: "6months", label: "Last 6 months" },
    { value: "custom", label: "Custom Range" },
  ];

  // Helper for authenticated fetch with auto-refresh
  const authFetch = async (url: string, options: RequestInit = {}) => {
    let res = await fetch(url, { ...options, credentials: "include" });
    
    if (res.status === 401) {
      const refreshRes = await fetch(`${environment.apiUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      
      if (refreshRes.ok) {
        res = await fetch(url, { ...options, credentials: "include" });
      } else {
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }
    
    return res;
  };

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();

      if (dateRange !== "all") {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        let startTimestamp = "";
        let endTimestamp = "";
        
        if (dateRange === "today") {
          startTimestamp = todayStart.toString();
        } else if (dateRange === "7days") {
          startTimestamp = (todayStart - (7 * 24 * 60 * 60 * 1000)).toString();
        } else if (dateRange === "1month") {
          startTimestamp = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime().toString();
        } else if (dateRange === "6months") {
          startTimestamp = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).getTime().toString();
        } else if (dateRange === "custom") {
          if (customStartDate) {
            startTimestamp = new Date(customStartDate).getTime().toString();
          }
          if (customEndDate) {
            endTimestamp = (new Date(customEndDate).getTime() + (24 * 60 * 60 * 1000)).toString();
          }
        }

        if (startTimestamp) params.append("startDate", startTimestamp);
        if (endTimestamp) params.append("endDate", endTimestamp);
      }

      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter) params.append("status", statusFilter);

      const queryParams = `?${params.toString()}`;

      const res = await authFetch(`${environment.apiUrl}/leads${queryParams}`);
      
      if (!res.ok) throw new Error("Failed to fetch leads");
      
      const responseData = await res.json();
      
      const data = responseData.data || [];
      const total = responseData.total || 0;
      const pages = responseData.totalPages || 1;
      
      setLeads(data);
      setTotalLeads(total);
      setTotalPages(pages);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await authFetch(`${environment.apiUrl}/leads/stats`);
      if (res.ok) {
        const { data } = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [dateRange, customStartDate, customEndDate, page, limit, debouncedSearch, statusFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLeads();
    fetchStats();
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await authFetch(`${environment.apiUrl}/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const { data: updatedLead } = await res.json();

      // Update lead in local state
      setLeads(prev => prev.map(l => l.id === leadId ? updatedLead : l));

      // If drawer is open for this lead, update it too
      if (logDrawerLead?.id === leadId) {
        setLogDrawerLead(updatedLead);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleAddLog = async () => {
    if (!logDrawerLead || !newLogMessage.trim()) return;

    try {
      setIsAddingLog(true);
      const res = await authFetch(`${environment.apiUrl}/leads/${logDrawerLead.id}/logs`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newLogMessage.trim(), type: newLogType }),
      });

      if (!res.ok) throw new Error("Failed to add log");

      const { data: updatedLead } = await res.json();

      setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
      setLogDrawerLead(updatedLead);
      setNewLogMessage("");
    } catch (err) {
      console.error("Error adding log:", err);
    } finally {
      setIsAddingLog(false);
    }
  };

  const getStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.label || status;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground/40">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm tracking-widest uppercase">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
        <AlertCircle className="shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium mb-1">Failed to load data</h3>
          <p className="text-sm opacity-80">{error}</p>
          <button onClick={handleRefresh} className="mt-4 text-xs font-medium uppercase tracking-wider underline">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-foreground tracking-tight mb-1 flex items-center gap-3">
              Captured Leads
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors flex items-center gap-1"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
                <motion.svg
                  animate={{ rotate: showStats ? 180 : 0 }}
                  width="10" height="6" viewBox="0 0 12 8" fill="none" className="opacity-50"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </button>
            </h2>
            <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">Total: {totalLeads} · Showing: {leads.length}</p>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 bg-background border border-foreground/10 hover:bg-foreground/5 text-foreground rounded-xl transition-colors disabled:opacity-50 text-xs font-medium h-[34px]"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-foreground/50" : "text-foreground/50"} />
            Refresh
          </button>
        </div>
        
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, state..."
              className="bg-background border border-foreground/10 text-foreground text-xs rounded-xl pl-9 pr-8 py-2 w-full sm:w-56 focus:outline-none focus:border-foreground/20 transition-colors placeholder:text-foreground/30 h-[34px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-foreground/30 hover:text-foreground transition-colors rounded-full hover:bg-foreground/5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="w-44">
            <CustomSelect
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              options={STATUS_OPTIONS}
              placeholder="All Statuses"
              size="sm"
            />
          </div>

          <AnimatePresence>
            {dateRange === "custom" && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <CustomDatePicker
                  value={customStartDate}
                  onChange={(val) => { setCustomStartDate(val); setPage(1); }}
                  placeholder="Start Date"
                  maxDate={customEndDate ? new Date(customEndDate) : new Date()}
                />
                <span className="text-foreground/30 text-xs px-1">to</span>
                <CustomDatePicker
                  value={customEndDate}
                  onChange={(val) => { setCustomEndDate(val); setPage(1); }}
                  placeholder="End Date"
                  minDate={customStartDate ? new Date(customStartDate) : undefined}
                  maxDate={new Date()}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="w-44">
            <CustomSelect
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              options={dateOptions}
              size="sm"
              allowClear={false}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showStats && stats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {STATUS_OPTIONS.map(opt => {
                const count = stats.byStatus[opt.value] || 0;
                return (
                  <button 
                    key={opt.value} 
                    onClick={() => handleStatusFilterChange(opt.value)}
                    className={`border rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 shadow-sm transition-all cursor-pointer text-left w-full ${
                      statusFilter === opt.value 
                        ? 'shadow-md scale-[1.02]' 
                        : 'hover:shadow-md hover:scale-[1.01]'
                    }`}
                    style={{
                      backgroundColor: statusFilter === opt.value ? `${opt.color}25` : `${opt.color}10`, // 25% vs 10% opacity
                      borderColor: statusFilter === opt.value ? opt.color : `${opt.color}30`,          // solid vs 30% opacity
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider truncate" style={{ color: opt.color }}>{opt.label}</span>
                    </div>
                    <span className="text-lg font-sans font-bold tracking-tight shrink-0" style={{ color: opt.color }}>
                      {count.toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {leads.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-2xl border border-foreground/5">
          <p className="text-foreground/40 font-medium">No leads match this criteria.</p>
        </div>
      ) : (
        <div className="bg-background border border-foreground/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[500px] border-b border-foreground/5 relative">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Contact</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Age</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">State</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Time Pref.</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium text-center">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {leads.map((lead, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                    key={lead.id} 
                    className="hover:bg-foreground/[0.02] transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3 text-xs text-foreground/50 whitespace-nowrap">
                      {new Intl.DateTimeFormat('en-IN', { 
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true
                      }).format(new Date(lead.createdAt))}
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="text-xs font-medium text-foreground leading-tight">{lead.name}</div>
                      <div className="text-[10px] text-foreground/40 font-mono mt-0.5">{lead.phone}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-xs text-foreground/50">{lead.age || "—"}</td>
                    <td className="px-4 sm:px-6 py-3 text-xs text-foreground/50">{lead.state || "—"}</td>
                    <td className="px-4 sm:px-6 py-3 text-xs text-foreground/50 capitalize">{lead.time || "—"}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex justify-center">
                        <div className="w-32">
                          <CustomSelect
                            value={lead.status || "new"}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            options={STATUS_OPTIONS}
                            size="sm"
                            allowClear={false}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <button
                        onClick={() => setLogDrawerLead(lead)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                      >
                        <MessageSquarePlus size={12} />
                        Logs {lead.logs && lead.logs.length > 0 && (
                          <span className="bg-foreground/10 text-foreground/60 rounded-full px-1.5 py-0.5 text-[9px] font-semibold">{lead.logs.length}</span>
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
            limit={limit}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}

      {/* Log Drawer */}
      <AnimatePresence>
        {logDrawerLead && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLogDrawerLead(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-background border-l border-foreground/10 shadow-2xl z-[201] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-foreground/5">
                <div>
                  <h3 className="text-lg font-serif text-foreground">{logDrawerLead.name}</h3>
                  <p className="text-xs text-foreground/40 font-mono mt-0.5">{logDrawerLead.phone}</p>
                </div>
                <button
                  onClick={() => setLogDrawerLead(null)}
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors text-foreground/40 hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status badge */}
              <div className="px-6 py-3 border-b border-foreground/5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${STATUS_COLORS[logDrawerLead.status] || STATUS_COLORS.new}`}>
                  {getStatusLabel(logDrawerLead.status)}
                </span>
              </div>

              {/* Log entries */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
                {(!logDrawerLead.logs || logDrawerLead.logs.length === 0) ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/30 text-sm">No communication logs yet.</p>
                    <p className="text-foreground/20 text-xs mt-1">Add a note below to get started.</p>
                  </div>
                ) : (
                  [...logDrawerLead.logs].reverse().map((log) => (
                    <div key={log.id} className="flex gap-3 group">
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                        log.type === "status_change" ? "bg-purple-500/10 text-purple-500" :
                        log.type === "call" ? "bg-green-500/10 text-green-600" :
                        log.type === "email" ? "bg-blue-500/10 text-blue-600" :
                        log.type === "message" ? "bg-amber-500/10 text-amber-600" :
                        "bg-foreground/5 text-foreground/40"
                      }`}>
                        {LOG_TYPE_ICONS[log.type] || <StickyNote size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-relaxed">{log.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-foreground/30 capitalize">{log.type.replace("_", " ")}</span>
                          <span className="text-[10px] text-foreground/20">·</span>
                          <span className="text-[10px] text-foreground/30">
                            {new Intl.DateTimeFormat('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              day: 'numeric',
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            }).format(new Date(log.createdAt))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add log form */}
              <div className="border-t border-foreground/5 px-6 py-4 space-y-3">
                <div className="w-28">
                  <CustomSelect
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value)}
                    options={LOG_TYPE_OPTIONS}
                    size="sm"
                    allowClear={false}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLogMessage}
                    onChange={(e) => setNewLogMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddLog()}
                    placeholder="Add a note..."
                    className="flex-1 bg-foreground/[0.03] border border-foreground/10 text-foreground text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-foreground/20 transition-colors placeholder:text-foreground/30"
                  />
                  <button
                    onClick={handleAddLog}
                    disabled={!newLogMessage.trim() || isAddingLog}
                    className="px-4 py-2.5 bg-foreground text-background text-xs font-medium rounded-xl hover:bg-foreground/80 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {isAddingLog ? "..." : "Add"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
