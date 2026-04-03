import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, 
  Settings, Plus, Bell, Download, Moon, Sun, Filter,
  ChevronRight, ArrowUpRight, ArrowDownRight, Wallet,
  CreditCard, Calendar, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { cn } from './lib/utils';
import { generateMockData, getCategoryBreakdown, getIncomeSources } from './data';
import { Transaction, Theme, DashboardState } from './types';

// --- Components ---

const Card = ({ children, className, theme }: { children: React.ReactNode, className?: string, theme: Theme }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "glass rounded-3xl p-6 transition-all duration-500",
      theme === 'dark' ? "glass-dark" : "glass-light",
      className
    )}
  >
    {children}
  </motion.div>
);

const KPIComponent = ({ title, value, trend, icon: Icon, theme }: any) => (
  <Card theme={theme} className="flex flex-col justify-between h-full group hover:scale-[1.02] cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className={cn(
        "p-3 rounded-2xl",
        theme === 'dark' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-500"
      )}>
        <Icon size={24} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
        trend > 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
      )}>
        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div>
      <p className={cn("text-sm font-medium mb-1", theme === 'dark' ? "text-gray-400" : "text-gray-500")}>{title}</p>
      <h3 className={cn("text-3xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-gray-900")}>
        ${value.toLocaleString()}
      </h3>
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={cn(
        "glass p-4 rounded-2xl border text-sm",
        theme === 'dark' ? "glass-dark border-white/10" : "glass-light border-black/5"
      )}>
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="font-bold">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<DashboardState>({
    transactions: [],
    theme: 'dark',
    currency: 'USD',
    dateRange: 60,
  });
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const { dailyData: mockDaily, transactions: mockTransactions } = generateMockData(60);
    setState(prev => ({ ...prev, transactions: mockTransactions }));
    setDailyData(mockDaily);
  }, []);

  const filteredData = dailyData.slice(-state.dateRange);
  const filteredTransactions = state.transactions.filter(t => {
    const date = new Date(t.date);
    const start = startOfDay(subDays(new Date(), state.dateRange));
    return date >= start;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const growth = 12.5; // Mock growth

  const categoryBreakdown = getCategoryBreakdown(filteredTransactions);
  const incomeSources = getIncomeSources(filteredTransactions);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-emerald-500/30 transition-colors duration-700",
      state.theme === 'dark' ? "bg-dark-bg text-gray-100" : "bg-light-bg text-gray-900"
    )}>
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
          state.theme === 'dark' ? "bg-emerald-500" : "bg-blue-400"
        )} />
        <div className={cn(
          "absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
          state.theme === 'dark' ? "bg-teal-500" : "bg-purple-400"
        )} />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-40 glass border-b px-8 py-4 flex items-center justify-between",
        state.theme === 'dark' ? "glass-dark border-white/5" : "glass-light border-black/5"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            state.theme === 'dark' ? "bg-emerald-500 glow-accent" : "bg-blue-500 glow-accent-light"
          )}>
            <Wallet className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aether Finance</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-1 p-1 rounded-2xl glass border",
            state.theme === 'dark' ? "glass-dark border-white/10" : "glass-light border-black/5"
          )}>
            {[7, 30, 60].map((range) => (
              <button
                key={range}
                onClick={() => setState(prev => ({ ...prev, dateRange: range as any }))}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-medium transition-all",
                  state.dateRange === range 
                    ? (state.theme === 'dark' ? "bg-emerald-500 text-white" : "bg-blue-500 text-white")
                    : "hover:bg-white/5"
                )}
              >
                {range}D
              </button>
            ))}
          </div>

          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95",
              state.theme === 'dark' ? "bg-emerald-500 text-white glow-accent" : "bg-blue-500 text-white glow-accent-light"
            )}
          >
            <Plus size={18} />
            Add Entry
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPIComponent title="Total Income" value={totalIncome} trend={8.2} icon={TrendingUp} theme={state.theme} />
          <KPIComponent title="Total Expense" value={totalExpense} trend={-3.1} icon={TrendingDown} theme={state.theme} />
          <KPIComponent title="Net Savings" value={netSavings} trend={12.4} icon={DollarSign} theme={state.theme} />
          <KPIComponent title="Monthly Growth" value={growth} trend={2.5} icon={Activity} theme={state.theme} />
        </div>

        {/* 3x3 Grid Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Row 1 */}
          <Card theme={state.theme} className="lg:col-span-1 h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <Activity size={16} /> Income vs Expense
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={filteredData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={state.theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(val) => format(new Date(val), 'MMM d')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip theme={state.theme} />} />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <Filter size={16} /> Weekly Comparison
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={filteredData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={state.theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(val) => format(new Date(val), 'EEE')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip theme={state.theme} />} />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <PieIcon size={16} /> Expense Breakdown
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip theme={state.theme} />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Row 2 */}
          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <DollarSign size={16} /> Income Sources
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={incomeSources}
                  outerRadius={80}
                  dataKey="value"
                >
                  {incomeSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip theme={state.theme} />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <TrendingUp size={16} /> Savings Trend
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={state.theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(val) => format(new Date(val), 'MMM d')}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip theme={state.theme} />} />
                <Area type="monotone" dataKey="savings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <Activity size={16} /> Fixed vs Variable
            </h4>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Fixed', value: totalExpense * 0.4, color: '#8b5cf6' },
                    { name: 'Variable', value: totalExpense * 0.6, color: '#ec4899' }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip content={<CustomTooltip theme={state.theme} />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Row 3 */}
          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <Calendar size={16} /> Spending Intensity
            </h4>
            <div className="grid grid-cols-7 gap-2 h-full pb-12">
              {filteredData.slice(-28).map((day, i) => {
                const intensity = Math.min(day.expense / 500, 1);
                return (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg transition-all hover:scale-110 cursor-help"
                    style={{ 
                      backgroundColor: state.theme === 'dark' 
                        ? `rgba(16, 185, 129, ${intensity})` 
                        : `rgba(59, 130, 246, ${intensity})`,
                      border: `1px solid ${state.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                    }}
                    title={`${day.date}: $${day.expense}`}
                  />
                )
              })}
            </div>
          </Card>

          <Card theme={state.theme} className="h-[400px]">
            <h4 className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
              <Filter size={16} /> Top Categories
            </h4>
            <div className="space-y-4">
              {categoryBreakdown.slice(0, 5).map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{cat.name}</span>
                    <span>${cat.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.value / totalExpense) * 100}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card theme={state.theme} className="h-[400px] flex flex-col items-center justify-center text-center">
            <h4 className="text-sm font-medium text-gray-400 mb-8 flex items-center gap-2 self-start">
              <Activity size={16} /> Financial Health
            </h4>
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className={state.theme === 'dark' ? "stroke-white/5" : "stroke-black/5"}
                  strokeWidth="8"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  className={state.theme === 'dark' ? "stroke-emerald-500" : "stroke-blue-500"}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * 0.85) }}
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">85</span>
                <span className="text-xs text-gray-400 font-medium">Excellent</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-400 max-w-[200px]">
              Your savings rate is 24% higher than last month.
            </p>
          </Card>
        </div>
      </main>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={cn(
                "relative w-full max-w-lg glass rounded-[2.5rem] p-10 overflow-hidden",
                state.theme === 'dark' ? "glass-dark" : "glass-light"
              )}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Add Transaction</h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                  <Plus className="rotate-45" />
                </button>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsFormOpen(false); }}>
                <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10">
                  <button type="button" className="flex-1 py-2 rounded-xl text-sm font-bold bg-emerald-500 text-white">Income</button>
                  <button type="button" className="flex-1 py-2 rounded-xl text-sm font-bold hover:bg-white/5">Expense</button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none">
                      <option>Salary</option>
                      <option>Freelance</option>
                      <option>Food</option>
                      <option>Rent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes</label>
                  <textarea 
                    placeholder="What was this for?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none h-24 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
                    state.theme === 'dark' ? "bg-emerald-500 text-white glow-accent" : "bg-blue-500 text-white glow-accent-light"
                  )}
                >
                  Confirm Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "relative w-full max-w-md glass h-full p-10",
                state.theme === 'dark' ? "glass-dark" : "glass-light"
              )}
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                  <Plus className="rotate-45" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Dark Mode</p>
                    <p className="text-xs text-gray-400">Toggle system appearance</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={cn(
                      "w-14 h-8 rounded-full p-1 transition-colors",
                      state.theme === 'dark' ? "bg-emerald-500" : "bg-gray-300"
                    )}
                  >
                    <motion.div 
                      animate={{ x: state.theme === 'dark' ? 24 : 0 }}
                      className="w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferences</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <DollarSign size={18} />
                        <span className="font-medium">Currency</span>
                      </div>
                      <span className="text-sm font-bold">USD ($)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Bell size={18} />
                        <span className="font-medium">Notifications</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-500">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
                    <Download size={18} />
                    Export Financial Data
                  </button>
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600" />
                    <div>
                      <p className="font-bold">Rohit Mahato</p>
                      <p className="text-xs text-gray-400">Premium Member</p>
                    </div>
                    <ChevronRight className="ml-auto text-gray-400" size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
