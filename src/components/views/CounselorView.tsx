import React, { useState, useEffect } from 'react';
import { Counselor, BookingRequest } from '../../types';
import { Storage, INITIAL_COUNSELORS } from '../../lib/storage';
import {
  Users,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Clock,
  Star,
  AlertCircle,
  X,
} from 'lucide-react';

export const CounselorView: React.FC = () => {
  const [counselors] = useState<Counselor[]>(INITIAL_COUNSELORS);
  const [search, setSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [bookingModal, setBookingModal] = useState<Counselor | null>(null);

  // Form states
  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [department, setDepartment] = useState<string>('B.Tech CSE - 2nd Year');
  const [preferredSlot, setPreferredSlot] = useState<string>('Tomorrow 3:00 PM');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [notes, setNotes] = useState<string>('');
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    setUserBookings(Storage.getBookings());
  }, []);

  const filtered = counselors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.specialty.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      c.designation.toLowerCase().includes(search.toLowerCase());
    const matchesLang =
      selectedLanguage === 'All' || c.languages.includes(selectedLanguage);
    return matchesSearch && matchesLang;
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModal || !studentName.trim() || !studentEmail.trim()) return;

    const request: BookingRequest = {
      id: 'book_' + Date.now(),
      counselorId: bookingModal.id,
      counselorName: bookingModal.name,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      department,
      preferredSlot,
      urgency,
      notes,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    Storage.saveBooking(request);
    setUserBookings(Storage.getBookings());
    setBookedSuccess(true);

    setTimeout(() => {
      setBookedSuccess(false);
      setBookingModal(null);
      setStudentName('');
      setStudentEmail('');
      setNotes('');
    }, 2200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <Users className="w-4 h-4" />
          Campus Healthcare Coordination
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Campus Counselor Connect</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Explore campus welfare guides and mental health mentors. Facilitates seamless appointment coordination.
        </p>
      </div>

      {/* Mandatory Demo Data Clarification Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Academic Prototype Notice:</strong> The profiles and slots below represent synthetic demo counselor personas for B.Tech project presentation and evaluation. No medical claim or real-world appointment is booked without formal college clinic EHR integration.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search counselor by name or specialty (e.g. CBT, Burnout, Hostel)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none text-slate-700 cursor-pointer"
          >
            <option value="All">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Bengali">Bengali</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>
      </div>

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:border-purple-200 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md">
                  Campus Guide
                </span>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Demo Mentor
                </span>
              </div>

              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={c.avatarUrl}
                  alt={c.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-purple-100 shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{c.name}</h3>
                  <p className="text-xs text-purple-700 font-medium line-clamp-1">{c.designation}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{c.experience}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {c.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="mt-3 flex flex-wrap gap-1">
                {c.languages.map((l) => (
                  <span key={l} className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                    {l}
                  </span>
                ))}
              </div>

              {/* Specialty */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Focus Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.specialty.map((s) => (
                    <span key={s} className="text-[11px] text-slate-700 bg-purple-50/70 px-2 py-0.5 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timing */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.availability}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{c.contactEmail}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setBookingModal(c)}
              className="mt-6 w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition"
            >
              Request Support Slot
            </button>
          </div>
        ))}
      </div>

      {/* User's Booked Requests Section */}
      {userBookings.length > 0 && (
        <div className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-base">Your Active Slot Requests ({userBookings.length})</h3>
          <div className="space-y-3">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{b.counselorName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      {b.status} (Demo)
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Slot: <strong>{b.preferredSlot}</strong> · Student: {b.studentName} ({b.department})
                  </p>
                </div>
                <span className="text-[11px] text-slate-400">
                  Requested on {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Dialog Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-purple-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setBookingModal(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookedSuccess ? (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={bookingModal.avatarUrl}
                    alt={bookingModal.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Request Appointment</h3>
                    <p className="text-xs text-purple-700 font-medium">{bookingModal.name}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Your request is saved to local storage as a test booking for academic review.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">College Email Address *</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student.rollno@college.ac.in"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preferred Slot</label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="Tomorrow 2:00 PM">Tomorrow 2:00 PM</option>
                      <option value="Tomorrow 4:00 PM">Tomorrow 4:00 PM</option>
                      <option value="Thursday 11:30 AM">Thursday 11:30 AM</option>
                      <option value="Friday 3:30 PM">Friday 3:30 PM</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Urgency Level</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="Low">Low (General Check)</option>
                      <option value="Medium">Medium (Exam Pressure)</option>
                      <option value="High">High (Deep Burnout)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Brief Note (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Struggling with project presentation anxiety"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    Confirm Booking Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingModal(null)}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-slate-900 text-lg">Support Slot Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your appointment request has been logged successfully into your local records.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
