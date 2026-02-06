import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Video, Phone, Building } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Interview {
    id: string;
    title: string;
    time: string;
    date: Date;
    location: string;
    type: 'video' | 'phone' | 'onsite';
}

interface CalendarViewProps {
    interviews: Interview[];
}

const CalendarView = ({ interviews }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="card p-0 overflow-hidden border-blue-50/50 shadow-2xl shadow-blue-500/5">
            {/* Calendar Header */}
            <div className="p-8 border-b border-blue-50 flex justify-between items-center bg-white">
                <div>
                    <h3 className="text-2xl font-black font-outfit tracking-tight">{format(currentDate, 'MMMM yyyy')}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                        {interviews.length} Scheduled Sessions
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={prevMonth} className="btn-circle p-2.5 hover:bg-primary hover:text-white rounded-xl border border-blue-50 transition-all text-muted-foreground group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button onClick={nextMonth} className="btn-circle p-2.5 hover:bg-primary hover:text-white rounded-xl border border-blue-50 transition-all text-muted-foreground group">
                        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-blue-50 bg-[#f8fafc]/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest border-r border-blue-50 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                    const dayInterviews = interviews.filter(i => isSameDay(i.date, day));
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={idx}
                            className={`min-h-[140px] p-3 border-r border-b border-blue-50 last:border-r-0 relative group transition-all ${!isCurrentMonth ? 'bg-bg-main/30 opacity-40' : 'hover:bg-primary/[0.02]'}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-black tracking-tighter w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/70 group-hover:text-primary group-hover:bg-primary/10'}`}>
                                    {format(day, 'd')}
                                </span>
                                {dayInterviews.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </div>

                            <div className="space-y-1.5">
                                {dayInterviews.map((interview) => (
                                    <div key={interview.id} className="text-[10px] p-2 rounded-xl bg-white border border-blue-50 text-blue-900 font-extrabold truncate cursor-pointer shadow-sm hover:border-primary/50 transition-all flex items-center gap-1.5">
                                        <div className="w-1 h-3 rounded-full bg-primary" />
                                        {interview.time} {interview.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Agenda Section */}
            <div className="p-8 bg-[#f8fafc]/50 border-t border-blue-50">
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6">Upcoming Agenda</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {interviews.slice(0, 3).map(i => (
                        <div key={i.id} className="bg-white p-5 rounded-[24px] border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    {i.type === 'video' ? <Video size={18} /> : i.type === 'phone' ? <Phone size={18} /> : <Building size={18} />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-extrabold text-sm tracking-tight">{i.title}</p>
                                    <p className="text-[10px] font-black text-primary/50 uppercase tracking-widest mt-0.5">{i.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-4 border-t border-blue-50">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                    <MapPin size={12} className="text-primary" /> {i.location}
                                </div>
                                <button className="btn btn-primary py-1.5 px-4 text-[10px]">JOIN NOW</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
