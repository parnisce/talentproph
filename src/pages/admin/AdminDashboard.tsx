import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { motion } from 'framer-motion';
import { ShieldCheck, DollarSign, MessageSquare, TrendingUp, Users, ArrowUpRight, Activity } from 'lucide-react';
import Chat from '../../components/Chat';

const AdminOverview = () => {
    const stats = [
        { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-primary bg-primary/10', trend: '+12.5%' },
        { label: 'Support Tickets', value: '24', icon: MessageSquare, color: 'text-accent bg-accent/10', trend: '-2' },
        { label: 'New Users', value: '156', icon: Users, color: 'text-secondary bg-secondary/10', trend: '+18%' },
    ];

    const tickets = [
        { id: 'T-1024', user: 'Sarah Peterson', subject: 'Payment Issue', priority: 'High', status: 'Open' },
        { id: 'T-1025', user: 'Alex Reyes', subject: 'Login Trouble', priority: 'Medium', status: 'Open' },
        { id: 'T-1026', user: 'Mike Chen', subject: 'Account Verification', priority: 'Low', status: 'Pending' },
    ];

    return (
        <div className="space-y-10">
            {/* Admin Warning Header */}
            <div className="flex items-center gap-4 bg-accent/5 border border-accent/20 p-6 rounded-[32px] text-accent">
                <div className="p-3 bg-accent rounded-2xl text-white shadow-xl shadow-accent/20">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <p className="font-extrabold text-lg tracking-tight">Admin Environment Active</p>
                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Authorized access only • Activity logging enabled</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -5 }}
                        className="card p-8 group relative overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-extrabold tracking-tight">{stat.value}</h3>
                        </div>
                        <Activity className="absolute bottom-[-20%] right-[-5%] text-primary/5 w-40 h-40 group-hover:text-primary/10 transition-colors" />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Support Tickets */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-2xl font-black font-outfit tracking-tight">Pending Support</h3>
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            View All Queues <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className="card overflow-hidden p-0 border-blue-50/50">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafc] border-b border-blue-50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ticket ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">User</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Subject</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Priority</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                                        <td className="px-8 py-6 font-mono font-black text-primary text-xs">{ticket.id}</td>
                                        <td className="px-8 py-6 font-extrabold text-sm tracking-tight">{ticket.user}</td>
                                        <td className="px-8 py-6 text-xs font-bold text-muted-foreground">{ticket.subject}</td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${ticket.priority === 'High' ? 'bg-accent/10 text-accent ring-1 ring-accent/20' :
                                                    ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-primary/10 text-primary'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                                                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card p-8">
                        <div className="flex justify-between items-center mb-10">
                            <h4 className="text-lg font-black font-outfit tracking-tight">System Revenue</h4>
                            <TrendingUp size={20} className="text-secondary" />
                        </div>
                        <div className="h-48 flex items-end gap-3 px-2">
                            {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/10 rounded-xl hover:bg-primary transition-all relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ${h * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                        </div>
                    </div>

                    <div className="card p-8 bg-primary text-white border-none relative overflow-hidden">
                        <Activity className="absolute bottom-[-10%] left-[-10%] text-white/10 w-32 h-32" />
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/20 pb-4">Live Performance</h4>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                    <span>Database Load</span>
                                    <span>24%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-1/4" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                    <span>Network Latency</span>
                                    <span>12ms</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[12%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <DashboardLayout role="admin" userName="System Admin">
            <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/support" element={
                    <Chat
                        currentUser={{ id: 'admin', name: 'System Admin' }}
                        recipient={{ id: '2', name: 'Sarah Peterson', status: 'Employer' }}
                    />
                } />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboard;
