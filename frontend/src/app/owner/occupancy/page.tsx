'use client';

import React, { useState, useEffect } from 'react';
import { useHostel } from '@/context/HostelContext';
import HostelSelector from '@/components/layout/HostelSelector';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2,
  Building2,
  Users,
  DoorOpen,
  ChevronRight,
  ArrowLeft,
  Circle,
  LayoutGrid,
  Info,
  User,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OccupancyPage = () => {
  const { selectedHostel } = useHostel();
  const [hostelsData, setHostelsData] = useState<any[]>([]);
  const [selectedDrillDown, setSelectedDrillDown] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchOccupancy = async () => {
      setLoading(true);
      try {
        const res = await api.get('/owner/occupancy');
        setHostelsData(res.data);
      } catch (err) {
        console.error('Error fetching occupancy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupancy();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  const filteredHostels = selectedHostel === 'all' 
    ? hostelsData 
    : hostelsData.filter(h => h.hostel_id.toString() === selectedHostel);

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* HEADER */}
      <header className="px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {selectedDrillDown && (
            <button 
              onClick={() => setSelectedDrillDown(null)}
              className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#4F46E5] transition-all border border-transparent hover:border-[#F1F5F9]"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
              {selectedDrillDown ? selectedDrillDown.hostel_name : 'Occupancy Map'}
            </h1>
            <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              {selectedDrillDown ? 'Room-level availability details' : 'Portfolio inventory overview'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!selectedDrillDown && <HostelSelector />}
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] font-black text-sm">
            {user?.name?.charAt(0) || 'C'}
          </div>
        </div>
      </header>

      <div className="px-6 pb-24">
        <AnimatePresence mode="wait">
          {!selectedDrillDown ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredHostels.map((hostel, idx) => {
                const occupancyPercent = Math.round((hostel.occupied_students / (hostel.calculated_capacity || ((hostel.total_rooms || 0) * 2))) * 100);
                return (
                  <motion.div
                    key={hostel.hostel_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedDrillDown(hostel)}
                    className="bg-white p-8 rounded-[2.5rem] border border-[#F1F5F9] shadow-sm hover:shadow-xl hover:shadow-indigo-50/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center border border-[#F1F5F9] group-hover:bg-[#EEF2FF] group-hover:border-[#E0E7FF] transition-all">
                        <Building2 className="text-[#94A3B8] group-hover:text-[#4F46E5]" size={28} />
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                        occupancyPercent > 90 ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#F0FDF4] text-[#10B981]"
                      )}>
                        {occupancyPercent > 90 ? 'High Demand' : 'Available'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#1E293B] tracking-tight group-hover:text-[#4F46E5] transition-all">
                      {hostel.hostel_name}
                    </h3>
                    <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mt-1">
                      {hostel.total_rooms} Units • {hostel.occupied_students} Residents
                    </p>

                    <div className="mt-10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#64748B] uppercase tracking-tighter">Usage</span>
                        <span className="text-xs font-black text-[#1E293B]">{occupancyPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${occupancyPercent}%` }}
                          className={cn(
                            "h-full rounded-full transition-all",
                            occupancyPercent > 90 ? "bg-[#EF4444]" : "bg-[#4F46E5]"
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#F8FAFC] flex items-center justify-between text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest">Explore Units</span>
                      <ChevronRight size={16} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="drilldown"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Units', value: selectedDrillDown.total_rooms, icon: DoorOpen, color: 'text-[#4F46E5]', bg: 'bg-[#EEF2FF]' },
                  { label: 'Active Residents', value: selectedDrillDown.occupied_students, icon: Users, color: 'text-[#10B981]', bg: 'bg-[#F0FDF4]' },
                  { label: 'Open Slots', value: (selectedDrillDown.calculated_capacity || ((selectedDrillDown.total_rooms || 0) * 2)) - selectedDrillDown.occupied_students, icon: LayoutGrid, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-[#F1F5F9] shadow-sm flex items-center gap-5">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[#94A3B8] text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-[#1E293B]">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-[#F1F5F9] shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-xs font-black text-[#1E293B] uppercase tracking-[0.2em]">Unit Status Matrix</h2>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Circle size={8} fill="#10B981" className="text-[#10B981]" />
                      <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle size={8} fill="#EF4444" className="text-[#EF4444]" />
                      <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest">Full</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {selectedDrillDown.rooms?.map((room: any, idx: number) => {
                    const isFull = room.occupied >= room.capacity;
                    const isPartiallyFull = room.occupied > 0 && room.occupied < room.capacity;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "aspect-square rounded-[2rem] border-2 p-5 flex flex-col justify-between transition-all cursor-default shadow-sm",
                          isFull 
                            ? "bg-[#FEF2F2] border-[#FEE2E2]" 
                            : (isPartiallyFull ? "bg-[#EEF2FF] border-[#E0E7FF]" : "bg-[#F0FDF4] border-[#DCFCE7]")
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-black",
                          isFull ? "text-[#991B1B]" : (isPartiallyFull ? "text-[#3730A3]" : "text-[#065F46]")
                        )}>
                          UNIT {room.room_no}
                        </span>
                        <div className="space-y-2">
                          <p className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            isFull ? "text-[#DC2626]" : (isPartiallyFull ? "text-[#4F46E5]" : "text-[#059669]")
                          )}>
                            {isFull ? 'Occupied' : (isPartiallyFull ? 'Partially' : 'Open')}
                          </p>
                          <div className="flex gap-1.5">
                            {Array.from({ length: room.capacity }).map((_, i) => (
                              <Circle 
                                key={i}
                                size={8} 
                                fill={i < room.occupied ? (isFull ? '#EF4444' : '#4F46E5') : '#CBD5E1'} 
                                className={i < room.occupied ? (isFull ? 'text-[#EF4444]' : 'text-[#4F46E5]') : 'text-[#CBD5E1]'} 
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#EEF2FF] border border-[#E0E7FF] p-6 rounded-[2rem] flex gap-5 items-start">
                <Info className="text-[#4F46E5] shrink-0 mt-0.5" size={20} />
                <p className="text-[#3730A3] text-[10px] font-bold leading-relaxed uppercase tracking-widest opacity-80">
                  This unit matrix is synced with warden allocations. residents are mapped to individual units. red units are at 100% capacity.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OccupancyPage;