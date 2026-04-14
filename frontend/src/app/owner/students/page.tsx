'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useHostel } from '@/context/HostelContext';
import HostelSelector from '@/components/layout/HostelSelector';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2,
  Users,
  Search,
  Building2,
  Receipt,
  AlertCircle,
  User,
  Filter,
  ChevronDown,
  LayoutGrid,
  CreditCard,
  Mail,
  Phone,
  Home,
  X,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const StudentsPage = () => {
  const { selectedHostel } = useHostel();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`owner/students?hostel_id=${selectedHostel}&status=${statusFilter}`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedHostel, statusFilter]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase().trim();
    return students.filter(student => 
      student.name?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.hostel_name?.toLowerCase().includes(term) ||
      student.room_number?.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  if (loading && students.length === 0) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Control</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Portfolio Student Roster & Fee Status</p>
        </div>
        <div className="flex items-center gap-6">
          <HostelSelector />
          <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
            <div className="text-right">
              <p className="text-sm font-black text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Owner</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-8 pb-24">
        {/* FILTERS & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[350px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, room or phone..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none focus:border-indigo-200 focus:bg-white transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative hidden md:block">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-2xl pl-4 pr-10 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-200 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
              >
                <option value="all">All Status</option>
                <option value="active">Active Residents</option>
                <option value="graduated">Graduated</option>
                <option value="inactive">Exited/Inactive</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-50 px-5 py-2.5 rounded-2xl border border-indigo-100/50">
              <Users size={18} className="text-indigo-600" />
              <span className="text-sm font-black text-indigo-900">{filteredStudents.length} Students</span>
            </div>
          </div>
        </div>

        {/* STUDENT CARDS GRID */}
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Users size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No Residents Found</p>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.student_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full relative"
                >
                  {/* Decorative Gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="p-8 pb-6 flex-1 relative z-10">
                    {/* Identity Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500 shadow-inner border border-white">
                          <User size={32} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-black text-slate-800 text-xl tracking-tight group-hover:text-indigo-800 transition-colors truncate capitalize">
                            {student.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border transition-all duration-500",
                              student.status === 'active' 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white" 
                                : "bg-slate-50 text-slate-500 border-slate-100"
                            )}>
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                student.status === 'active' ? "bg-emerald-500 group-hover:bg-white animate-pulse" : "bg-slate-400"
                              )} />
                              {student.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hostel & Room Info */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Building2 size={14} strokeWidth={2.5} />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Hostel</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-slate-700 leading-tight">
                            {student.hostel_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 pl-8 border-l border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Home size={14} strokeWidth={2.5} />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Room & Type</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-700">#{student.details?.assigned_slot || student.room_number || 'N/A'}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-100">
                              {student.room_type_name || 'Standard'}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-slate-100">
                              {student.capacity === 1 ? 'Single Seater' : 
                               student.capacity === 2 ? 'Dual Seater' : 
                               student.capacity === 3 ? 'Triple Seater' : 
                               student.capacity === 4 ? 'Four Seater' : 
                               student.capacity ? `${student.capacity} Seater` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-all duration-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600 tracking-tight">{student.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <Link 
                    href={`/owner/students/${student.student_id}`}
                    className="px-8 py-5 border-t border-slate-50 bg-slate-50/30 group-hover:bg-indigo-50/50 transition-colors duration-500 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">View Financial Ledger</span>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-500">
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
