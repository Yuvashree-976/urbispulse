
import React, { useState, useMemo } from 'react';
import { 
  Maximize2, 
  Minus, 
  Plus, 
  Search, 
  Layers, 
  AlertCircle,
  MapPin,
  Activity,
  Filter,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_COMPLAINTS, CATEGORIES } from '../constants';

const HeatmapPage: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [zoom, setZoom] = useState(1);

  const filteredComplaints = useMemo(() => {
    if (activeCategory === 'all') return MOCK_COMPLAINTS;
    return MOCK_COMPLAINTS.filter(c => c.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [activeCategory]);

  // Generate clusters for the "heat" effect
  const clusters = useMemo(() => {
    // In a real app, this would be a sophisticated library.
    // Here we use the actual lat/lng from constants to place SVG circles.
    return filteredComplaints;
  }, [filteredComplaints]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Sidebar Controls */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-80 border-r dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-6 z-20 shadow-xl overflow-y-auto"
      >
        <div>
          <h2 className="text-2xl font-extrabold mb-1 flex items-center gap-2">
            City Pulse <Activity className="w-5 h-5 text-indigo-600" />
          </h2>
          <p className="text-xs text-slate-500">Live intensity of verified grievances.</p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter Category</label>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${activeCategory === 'all' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
            >
              All Incidents
            </button>
            {CATEGORIES.slice(0, 6).map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${activeCategory === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t dark:border-slate-800">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heat Metrics</label>
           {[
             { label: 'Critical Wards', val: '04', color: 'text-red-500' },
             { label: 'Resolved (Last 24h)', val: '128', color: 'text-green-500' },
             { label: 'Active Reports', val: filteredComplaints.length, color: 'text-indigo-600' }
           ].map((metric, i) => (
             <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
               <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
               <span className={`text-sm font-bold ${metric.color}`}>{metric.val}</span>
             </div>
           ))}
        </div>

        <div className="mt-auto p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Map Legend</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-3">Red zones indicate high volume of unresolved critical reports.</p>
          <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full"></div>
        </div>
      </motion.div>

      {/* Map Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-200 dark:bg-slate-900">
        {/* SVG Map Background Rendering */}
        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          style={{ transformOrigin: 'center', scale: zoom }}
        >
          {/* Mock City Grid Lines */}
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" />
          </pattern>
          <rect width="1000" height="1000" fill="url(#grid)" />

          {/* District Borders */}
          <path d="M 200,100 Q 400,150 500,100 T 800,200 L 900,500 L 700,800 Q 400,700 200,800 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-slate-700 opacity-30" />

          {/* The "Heat" Clusters */}
          {clusters.map((c, i) => (
            <g key={c.id}>
              {/* Radial heat glow */}
              <defs>
                <radialGradient id={`glow-${c.id}`}>
                  <stop offset="0%" stopColor={c.severity === 'High' ? '#ef4444' : '#6366f1'} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={c.severity === 'High' ? '#ef4444' : '#6366f1'} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle 
                cx={c.lng} cy={c.lat} 
                r={c.severity === 'High' ? 120 : 80} 
                fill={`url(#glow-${c.id})`}
                className="animate-pulse"
              />
              
              {/* Interactive Pin */}
              <motion.circle 
                cx={c.lng} cy={c.lat} r="6" 
                fill="white" stroke="#4f46e5" strokeWidth="2"
                whileHover={{ r: 10, fill: '#4f46e5' }}
                className="cursor-pointer shadow-lg"
                onClick={() => setSelectedPin(c)}
              />
            </g>
          ))}
        </motion.svg>

        {/* UI Overlay: Floating Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Locate district..." 
                className="pl-9 pr-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-2xl rounded-2xl text-xs w-64 outline-none border border-white dark:border-slate-800 focus:ring-2 ring-indigo-500/20" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:bg-slate-50 transition-colors"><Plus className="w-4 h-4" /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:bg-slate-50 transition-colors"><Minus className="w-4 h-4" /></button>
            <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all mt-2"><Maximize2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Info Card Popover */}
        <AnimatePresence>
          {selectedPin && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute z-40 w-72 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 rounded text-[9px] font-black uppercase tracking-widest">
                   {selectedPin.severity} Intensity
                 </div>
                 <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-slate-900">&times;</button>
              </div>
              <h3 className="font-bold text-lg mb-1">{selectedPin.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{selectedPin.location} • {selectedPin.category}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Status</span>
                  <span className="text-amber-500">{selectedPin.status}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500 w-1/3"></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 group">
                  Track Resolution <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Dashboard Overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-[400px] pointer-events-none">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-5 glass rounded-[2rem] shadow-2xl pointer-events-auto border-t-2 border-indigo-500"
          >
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Incident Summary</h4>
               <span className="text-[10px] font-black text-indigo-600 animate-pulse">● LIVE UPDATES</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Avg Response</p>
                  <p className="text-lg font-bold">14.2 min</p>
               </div>
               <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Solve Rate</p>
                  <p className="text-lg font-bold text-green-600">92.4%</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
