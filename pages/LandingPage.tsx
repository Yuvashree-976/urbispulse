
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Lock,
  MessageSquareShare,
  PieChart,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURE_HIGHLIGHTS } from '../constants';

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 px-4 md:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/40 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"
          ></motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/30 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 border border-indigo-100 dark:border-indigo-800"
          >
            <Activity className="w-3 h-3" />
            <span>Over 12,000 community pulse points resolved</span>
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            The City's <br /><span className="text-indigo-600">Unified Pulse.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium"
          >
            UrbisPulse is the transparent backbone of modern governance. Report issues, validate community needs, and watch your city transform in real-time.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/file-complaint" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-300 dark:shadow-none flex items-center justify-center gap-2 group active:scale-95">
              File a Report
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/transparency" className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
              Track Pulse
            </Link>
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: <CheckCircle2 />, val: '94%', label: 'Resolution Index' },
              { icon: <Clock />, val: '14h', label: 'Avg. Response' },
              { icon: <PieChart />, val: '850+', label: 'Active Wards' },
            ].map((stat, i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] shadow-xl border border-slate-200/50 flex flex-col items-center">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-4xl font-black mb-1">{stat.val}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Governance Re-imagined.</h2>
            <p className="text-slate-500 font-medium">UrbisPulse connects citizens directly to the source of resolution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {FEATURE_HIGHLIGHTS.map((feature, idx) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={idx} 
                className="group p-10 rounded-[3rem] bg-white dark:bg-slate-800 shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-700"
              >
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
