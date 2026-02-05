
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Award,
  TrendingUp,
  LayoutGrid,
  List,
  Building2,
  Users,
  Lock,
  Activity,
  UserCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Complaint, User, ComplaintStatus } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const Dashboard: React.FC<{ user: User | null, complaints: Complaint[], updateComplaint: (id: string, u: Partial<Complaint>) => void }> = ({ user, complaints, updateComplaint }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');

  if (!user) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4">
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600">
           <Lock size={48} />
         </motion.div>
         <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">Access Restricted</h2>
            <p className="text-slate-500 max-w-sm font-medium">Please enter your specialized portal to view and manage your UrbisPulse community dashboard.</p>
         </div>
         <Link to="/auth" className="px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">Go to Auth Gateway</Link>
       </div>
    );
  }

  const isWardMember = user.role === 'Ward Member';
  
  const filteredData = complaints.filter(c => {
    if (isWardMember) return c.location.toLowerCase().includes(user.ward?.toLowerCase() || '');
    if (user.role === 'Admin') return true; 
    return !c.isAnonymous || c.id; 
  }).filter(c => {
    if (activeTab === 'pending') return c.status !== 'Resolved';
    if (activeTab === 'resolved') return c.status === 'Resolved';
    return true;
  });

  const handleVerify = (id: string) => {
    updateComplaint(id, { status: 'Under Review' });
  };

  const handleFastTrack = (id: string) => {
    updateComplaint(id, { status: 'In Progress', severity: 'High' });
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <aside className="hidden lg:flex w-72 border-r dark:border-slate-800 bg-white dark:bg-slate-900 flex-col p-8 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="space-y-2 mb-8">
          {[
            { id: 'all', name: 'Unified View', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'pending', name: isWardMember ? 'Ward Queue' : 'Active Items', icon: <List className="w-4 h-4" /> },
            { id: 'resolved', name: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
          ].map((nav) => (
            <button 
              key={nav.id} 
              onClick={() => setActiveTab(nav.id as any)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === nav.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              {nav.icon} {nav.name}
            </button>
          ))}
        </div>

        <div className="mt-auto p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 blur-2xl rounded-full"></div>
          <div className="flex items-center gap-4 mb-5">
             <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
               <Award className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-black text-indigo-100 tracking-widest">Efficiency</p>
                <h4 className="font-bold text-lg">9.4/10</h4>
             </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-white"></motion.div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-12 overflow-x-hidden">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto">
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-4xl font-black tracking-tighter">{user.role} Hub</h1>
                 <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${isWardMember ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {user.ward || user.department || 'GLOBAL'}
                 </span>
              </div>
              <p className="text-slate-500 font-medium">Monitoring {filteredData.length} records in your operational jurisdiction.</p>
            </div>
            {user.role === 'Citizen' && (
              <Link to="/file-complaint" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-100 flex items-center gap-3 hover:bg-indigo-700 transition-all active:scale-95">
                <Plus className="w-5 h-5" /> Register Report
              </Link>
            )}
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: isWardMember ? 'Ward Unverified' : 'My Active', value: filteredData.filter(c => c.status === 'Submitted').length, icon: <Activity />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Work In Progress', value: filteredData.filter(c => c.status === 'In Progress').length, icon: <Zap />, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Ward Resolution', value: '92%', icon: <CheckCircle2 />, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Verified Wards', value: isWardMember ? user.ward : 'Global', icon: <Users />, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm flex flex-col gap-4 group hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={item} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="p-10 border-b dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="font-bold text-2xl tracking-tight">Active Pulse Queue</h3>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-indigo-600 transition-colors" />
                  <input type="text" placeholder="Filter operational ID..." className="pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs outline-none focus:ring-2 ring-indigo-500/20 w-64" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                    <th className="px-6 py-6">ID</th>
                    <th className="px-6 py-6">Context</th>
                    <th className="px-6 py-6">Status</th>
                    <th className="px-6 py-6 text-right">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filteredData.map((complaint) => (
                    <motion.tr key={complaint.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-8">
                         <span className="font-mono text-sm font-bold text-indigo-600">{complaint.id}</span>
                      </td>
                      <td className="px-6 py-8">
                        <p className="text-base font-bold tracking-tight mb-1">{complaint.title}</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{complaint.category} • {complaint.location}</span>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${complaint.status === 'Resolved' ? 'text-green-600' : 'text-amber-600'}`}>
                            {complaint.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isWardMember && complaint.status === 'Submitted' && (
                            <button 
                              onClick={() => handleVerify(complaint.id)}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            >
                              Verify Report
                            </button>
                          )}
                          {isWardMember && complaint.status === 'Under Review' && (
                            <button 
                              onClick={() => handleFastTrack(complaint.id)}
                              className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                            >
                              <Zap size={10} /> Fast-Track
                            </button>
                          )}
                          <Link to={`/track/${complaint.id}`} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-white transition-all">
                             <ArrowUpRight size={18} />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
