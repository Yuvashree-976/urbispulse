
import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Activity,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Complaint, User, ComplaintStatus } from '../types';

const AdminDashboard: React.FC<{ complaints: Complaint[], updateComplaint: (id: string, u: Partial<Complaint>) => void, user: User | null }> = ({ complaints, updateComplaint, user }) => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  if (!user || user.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4">
        <Activity className="w-20 h-20 text-indigo-100" />
        <h2 className="text-2xl font-bold">Admin Privileges Required</h2>
        <p className="text-slate-500 max-w-sm">This console is reserved for verified municipal administrators.</p>
        <Link to="/auth" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Admin Portal Login</Link>
      </div>
    );
  }

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaint(id, { status });
    setSelectedIncident(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto p-4 md:p-12 flex flex-col gap-12">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Activity className="w-8 h-8 text-indigo-600 pulse-soft" />
               <h1 className="text-4xl font-black tracking-tighter">Admin Nexus</h1>
               <span className="px-3 py-1 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">Global Oversight</span>
            </div>
            <p className="text-slate-500 font-medium">Monitoring all wards • Departmental routing protocol active</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95">
              <BarChart3 className="w-4 h-4" /> Reports
            </button>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-100 transition-all active:scale-95">
              <Settings className="w-4 h-4" /> Nexus Config
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'System Resolution', value: '88.4%', trend: '+2.1%', icon: <CheckCircle2 />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Unassigned Load', value: complaints.filter(c => c.status === 'Submitted').length, trend: 'High', icon: <UserPlus />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Escalated Issues', value: '14', trend: '-2', icon: <ShieldAlert />, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Verified Wards', value: '24', trend: 'Stable', icon: <Activity />, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((kpi, i) => (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${kpi.bg} dark:bg-slate-800 flex items-center justify-center ${kpi.color} shadow-inner group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(kpi.icon as React.ReactElement, { size: 28 })}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full">{kpi.trend}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{kpi.label}</p>
              <h3 className="text-3xl font-black tracking-tight">{kpi.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Queue with Management Actions */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm flex flex-col"
          >
            <div className="p-10 border-b dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-2xl tracking-tight">Global Work Queue</h3>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-indigo-600 transition-colors" />
                  <input type="text" placeholder="Filter operational queue..." className="pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs outline-none focus:ring-2 ring-indigo-500/20 w-64" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                    <th className="px-6 py-8">Lifecycle</th>
                    <th className="px-6 py-8">Incident Data</th>
                    <th className="px-6 py-8">Resolution Routing</th>
                    <th className="px-6 py-8 text-right">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {complaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-8">
                        <div className="flex flex-col gap-1">
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-center ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold text-center border ${item.severity === 'High' ? 'text-red-500 border-red-100' : 'text-slate-400 border-slate-100'}`}>
                            {item.severity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <p className="text-base font-bold tracking-tight">{item.title}</p>
                        <p className="text-[10px] font-mono text-indigo-400 mt-1 font-black">{item.id}</p>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <Users size={14} className="text-slate-400" />
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{item.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedIncident(selectedIncident === item.id ? null : item.id)}
                            className="p-3 bg-white border dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                          >
                            <Settings size={16} className="text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Action Center Sidebar */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {selectedIncident ? (
                <motion.div 
                  key="action-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border-2 border-indigo-500 shadow-2xl relative"
                >
                  <button onClick={() => setSelectedIncident(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900">&times;</button>
                  <h3 className="font-bold text-2xl tracking-tight mb-2">Intervention Desk</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-8">Modifying Incident {selectedIncident}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Set Deployment Phase</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Under Review', 'Assigned', 'In Progress', 'Resolved'] as ComplaintStatus[]).map(status => (
                          <button 
                            key={status}
                            onClick={() => handleStatusChange(selectedIncident, status)}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all text-left flex items-center justify-between group"
                          >
                            {status} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t dark:border-slate-800">
                      <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Flag for Escalation</button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-desk"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <ShieldAlert className="w-14 h-14 mb-6 text-indigo-200" />
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">Nexus Insight</h3>
                  <p className="text-indigo-100 text-sm mb-10 font-medium leading-relaxed">Select an incident from the work queue to trigger administrative intervention or rerouting.</p>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Queue Health</p>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-white"></motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 shadow-sm"
            >
              <h3 className="font-bold text-xl mb-6">System Health</h3>
              <div className="space-y-4">
                {[
                  { label: 'Gateway latency', val: '22ms', color: 'text-green-500' },
                  { label: 'API Integrity', val: '99.9%', color: 'text-green-500' },
                  { label: 'Sync Status', val: 'Active', color: 'text-indigo-600' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <span className={`text-xs font-black ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
