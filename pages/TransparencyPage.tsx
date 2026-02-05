
import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowUp, 
  MessageCircle, 
  Share2, 
  Search,
  TrendingUp,
  Award,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants';
import { Complaint } from '../types';

const PERFORMANCE_DATA = [
  { name: 'Water', efficiency: 95, color: '#3b82f6' },
  { name: 'Power', efficiency: 88, color: '#eab308' },
  { name: 'Waste', efficiency: 82, color: '#22c55e' },
  { name: 'Roads', efficiency: 65, color: '#f97316' },
  { name: 'Safety', efficiency: 91, color: '#ef4444' },
];

const TransparencyPage: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
  const [filter, setFilter] = useState('All');
  const [upvotedItems, setUpvotedItems] = useState<Set<string>>(new Set());

  const handleUpvote = (id: string) => {
    const newUpvoted = new Set(upvotedItems);
    if (newUpvoted.has(id)) newUpvoted.delete(id);
    else newUpvoted.add(id);
    setUpvotedItems(newUpvoted);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-indigo-600 mb-2">
           <Activity className="w-5 h-5" />
           <span className="text-xs font-black uppercase tracking-widest">Public Integrity Ledger</span>
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter">City Pulse Record</h1>
        <p className="text-slate-500 max-w-2xl font-medium">
          Total transparency on city infrastructure, response times, and collective community needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Dept Performance</h3>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERFORMANCE_DATA} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={60} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                    {PERFORMANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[3rem] text-white shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
            <Award className="w-10 h-10 mb-6 text-indigo-200" />
            <h3 className="text-2xl font-bold mb-4">Integrity Index</h3>
            <p className="text-indigo-100 text-sm mb-8 font-medium leading-relaxed">99.4% of reported pulse points are verified within 24 hours. UrbisPulse ensures no issue is left unheard.</p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl transition-all text-xs font-black uppercase tracking-widest hover:bg-indigo-50 active:scale-95">Download Auditor Report</button>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              {['All Incidents', 'Critical Only'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-md' : 'text-slate-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative group flex-1 md:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Search keywords..." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 ring-indigo-500/20" />
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {complaints.map((complaint) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={complaint.id} 
                  className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {CATEGORIES.find(c => c.name === complaint.category)?.icon || <Activity className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold tracking-tight">{complaint.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{complaint.location}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{complaint.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${complaint.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                      {complaint.severity}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                    {complaint.description}
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUpvote(complaint.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${upvotedItems.has(complaint.id) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'}`}
                      >
                        <ArrowUp className={`w-4 h-4 ${upvotedItems.has(complaint.id) ? 'animate-bounce' : ''}`} />
                        <span>Upvote • {complaint.upvotes + (upvotedItems.has(complaint.id) ? 1 : 0)}</span>
                      </motion.button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                        <MessageCircle className="w-4 h-4" />
                        <span>Discuss (4)</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${complaint.status === 'Resolved' ? 'text-green-600' : 'text-amber-600'}`}>
                        {complaint.status}
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencyPage;
