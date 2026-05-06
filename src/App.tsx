/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Briefcase, 
  Users, 
  Lightbulb, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronRight, 
  Plus, 
  X,
  Lock,
  ArrowRight,
  Calendar,
  Trash2
} from 'lucide-react';

// --- Types ---
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  date: string;
  closingDate: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  cvName: string;
  cvData: string;
  date: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

interface EventApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  date: string;
}

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  date: string;
}

// --- Mock Data ---
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Youth Program Coordinator',
    company: 'Ibandla NGO',
    location: 'Soweto, GP',
    description: 'Lead our youth mentorship programs and coordinate community workshops.',
    date: '2024-05-15',
    closingDate: '2026-12-31'
  },
  {
    id: '2',
    title: 'Social Media Manager',
    company: 'Creative Hub',
    location: 'Remote / Johannesburg',
    description: 'Drive awareness for our youth success stories through vibrant digital campaigns.',
    date: '2024-05-10',
    closingDate: '2026-06-30'
  }
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('ibandla_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('ibandla_events');
    return saved ? JSON.parse(saved) : [
      { id: 'e1', title: 'Launch Event', date: '2024-05-14', time: '14:00', location: 'Soweto Community Hall', description: 'Be part of the new chapter in youth empowerment.' }
    ];
  });
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('ibandla_apps');
    return saved ? JSON.parse(saved) : [];
  });
  const [eventApplications, setEventApplications] = useState<EventApplication[]>(() => {
    const saved = localStorage.getItem('ibandla_event_apps');
    return saved ? JSON.parse(saved) : [];
  });
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('ibandla_regs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('ibandla_admin') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState<Job | null>(null);
  const [showEventApplyModal, setShowEventApplyModal] = useState<Event | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'ngo' | 'events'>('jobs');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCVName, setSelectedCVName] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Persist data
  useEffect(() => {
    localStorage.setItem('ibandla_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ibandla_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ibandla_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ibandla_event_apps', JSON.stringify(eventApplications));
  }, [eventApplications]);

  useEffect(() => {
    localStorage.setItem('ibandla_regs', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('ibandla_admin', isAdmin.toString());
  }, [isAdmin]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Auto-remove expired jobs
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeJobs = jobs.filter(job => job.closingDate >= today);
    if (activeJobs.length !== jobs.length) {
      setJobs(activeJobs);
    }
  }, [jobs]);

  // Theme management
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string || '').trim();
    const password = (formData.get('password') as string || '').trim();

    if (email === 'ibandlapictures@gmail.com' && password === 'Ibandla@20') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setToast({ message: 'Welcome back, Ibandla Admin!', type: 'success' });
    } else {
      setToast({ message: 'Invalid credentials. Access Denied.', type: 'error' });
    }
  };

  const handleAddJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      closingDate: formData.get('closingDate') as string,
      date: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
    setShowAdminForm(false);
    setToast({ message: 'New Job Position Published!', type: 'success' });
  };

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
    };
    setEvents(prev => [newEvent, ...prev]);
    setShowEventForm(false);
    setToast({ message: 'Event Created Successfully!', type: 'success' });
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(prev => prev.filter(j => j.id !== id));
      setToast({ message: 'Job posting deleted.', type: 'success' });
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
      setToast({ message: 'Event deleted.', type: 'success' });
    }
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm('Delete this application record?')) {
      setApplications(prev => prev.filter(a => a.id !== id));
      setToast({ message: 'Application record removed.', type: 'success' });
    }
  };

  const handleDeleteEventApp = (id: string) => {
    if (window.confirm('Delete this event application?')) {
      setEventApplications(prev => prev.filter(a => a.id !== id));
      setToast({ message: 'Event application removed.', type: 'success' });
    }
  };

  const handleDeleteReg = (id: string) => {
    if (window.confirm('Delete this registration record?')) {
      setRegistrations(prev => prev.filter(r => r.id !== id));
      setToast({ message: 'Registration record removed.', type: 'success' });
    }
  };

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showApplyModal) return;

    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const cvFile = formData.get('cv') as File;

    if (!cvFile || cvFile.size === 0) {
      setToast({ message: 'Please attach a CV in PDF format.', type: 'error' });
      setIsUploading(false);
      return;
    }

    try {
      const reader = new FileReader();
      const cvData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(cvFile);
      });

      const newApp: Application = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: showApplyModal.id,
        jobTitle: showApplyModal.title,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        cvName: cvFile.name,
        cvData: cvData,
        date: new Date().toISOString().split('T')[0]
      };

      setApplications(prev => [newApp, ...prev]);
      setToast({ message: `Application for "${showApplyModal.title}" sent!`, type: 'success' });
      setShowApplyModal(null);
      setSelectedCVName(null);
    } catch (error) {
      setToast({ message: 'Error uploading CV. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEventApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showEventApplyModal) return;

    const formData = new FormData(e.currentTarget);
    const newApp: EventApplication = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: showEventApplyModal.id,
      eventTitle: showEventApplyModal.title,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      date: new Date().toISOString().split('T')[0]
    };

    setEventApplications(prev => [newApp, ...prev]);
    setToast({ message: `You've registered for "${showEventApplyModal.title}"!`, type: 'success' });
    setShowEventApplyModal(null);
  };

  const downloadCV = (app: Application) => {
    const link = document.createElement('a');
    link.href = app.cvData;
    link.download = app.cvName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleJoinNGO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      type: formData.get('type') as string,
      date: new Date().toISOString().split('T')[0]
    };
    setRegistrations(prev => [newReg, ...prev]);
    setToast({ message: "Welcome to the movement! We'll contact you soon.", type: 'success' });
    setShowJoinModal(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-neon-orange selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-white border backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-green-500/20 border-green-500 shadow-green-500/20' : 'bg-red-500/20 border-red-500 shadow-red-500/20'
            }`}
          >
            {toast.type === 'success' ? <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">✓</div> : <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">!</div>}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl mt-0 shadow-xl">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img 
              src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/logos/ibandla-logo.png" 
              alt="Ibandla Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to the sun icon if the image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-10 h-10 bg-gradient-to-br from-neon-orange to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Sun className="text-white w-6 h-6 animate-pulse-glow" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter dark:neon-glow-orange text-foreground uppercase">
            IBANDLA <span className="text-neon-orange">SUCCESS</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 font-medium">
            <a href="#home" className="hover:text-neon-orange transition-colors">Home</a>
            <a href="#programs" className="hover:text-neon-orange transition-colors">Programs</a>
            <a href="#jobs" className="hover:text-neon-orange transition-colors">Recruitment</a>
            <a href="#contact" className="hover:text-neon-orange transition-colors">Contact</a>
          </div>

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-neon-orange" /> : <Moon className="w-5 h-5 text-neon-purple" />}
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setShowAppsModal(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-muted border border-border text-xs hover:neon-border-purple transition-all"
            >
              <Users className="w-4 h-4" /> Inbox ({applications.length + registrations.length})
            </button>
          )}

          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowLoginModal(true)}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isAdmin ? 'bg-neon-blue text-black' : 'bg-muted border border-border'}`}
          >
            <Lock className="w-4 h-4" /> {isAdmin ? "Logout" : "Admin"}
          </button>
          
          <button 
            onClick={() => setShowJoinModal(true)}
            className="bg-neon-orange hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(255,140,0,0.4)] hover:shadow-neon-orange transition-all active:scale-95"
          >
            Join NGO
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/20 blur-[100px] rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
            EMPOWERING <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange via-neon-purple to-neon-blue dark:neon-glow-purple">
              YOUTH SUCCESS
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed italic">
            "Inspiring, Educating & Uplifting the Next Generation for a Brighter Future!"
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-foreground text-background px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform">
              Our Vision <ChevronRight className="w-5 h-5" />
            </button>
            <div 
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-muted p-4 rounded-2xl border border-border flex flex-col items-start px-6 cursor-pointer hover:neon-border-orange transition-all"
            >
              <span className="text-xs uppercase tracking-widest font-bold text-neon-orange">Upcoming Event</span>
              <span className="text-lg font-bold">{events[0]?.title || "Stay Tuned"} | {events[0]?.time || "TBA"}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mt-20 opacity-30"
        >
          <ArrowRight className="w-10 h-10 rotate-90" />
        </motion.div>
      </section>

      {/* Core Programs */}
      <section id="programs" className="py-24 px-6 max-w-7xl mx-auto bg-muted/30 rounded-[3rem] my-12 border border-border">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-4 dark:neon-glow-blue">Core Initiatives</h2>
          <p className="text-foreground/60 max-w-xl mx-auto font-medium text-lg">We provide the tools and networks necessary for youth to thrive in a modern economy.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Users className="text-neon-blue" />, title: "Mentorship", desc: "Connecting ambitious youth with industry veterans for one-on-one guidance." },
            { icon: <Lightbulb className="text-neon-orange" />, title: "Creative Hub", desc: "A space to innovate, express, and build digital masterpieces." },
            { icon: <Briefcase className="text-neon-green" />, title: "Skill Dev", desc: "Intensive training in coding, leadership, and professional etiquette." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:neon-border-blue transition-all group"
            >
              <div className="mb-6 p-4 bg-muted rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievement Gallery */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <h2 className="text-4xl md:text-5xl font-black dark:neon-glow-purple">Success in Motion</h2>
          <p className="text-foreground/60 max-w-md font-medium">A glimpse into our workshops, graduations, and community impact events.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
          <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-[2rem] border border-border">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Youth Collaboration"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <span className="text-neon-orange font-bold text-xs uppercase tracking-widest">Tech Workshop</span>
              <h3 className="text-white text-2xl font-black">Digital Skills 2024</h3>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[2rem] border border-border">
            <img 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Mentorship"
            />
          </div>
          <div className="relative group overflow-hidden rounded-[2rem] border border-border">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Innovation"
            />
          </div>
          <div className="col-span-2 relative group overflow-hidden rounded-[2rem] border border-border">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Success Celebration"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <span className="text-neon-blue font-bold text-xs uppercase tracking-widest">Graduation</span>
              <h3 className="text-white text-2xl font-black">Empowering 500+ Youth</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 dark:neon-glow-purple">Launch Events</h2>
            <p className="text-foreground/60 font-medium text-lg">Be part of our workshops and community empowerment sessions.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowEventForm(true)}
              className="bg-neon-purple text-white p-4 rounded-2xl shadow-neon-purple flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" /> ADD EVENT
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div key={ev.id} className="p-8 rounded-[2rem] bg-card border border-border hover:neon-border-purple transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Calendar className="w-12 h-12" />
              </div>
              <div>
                <span className="bg-muted px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">{ev.date}</span>
                <h3 className="text-2xl font-black mb-2">{ev.title}</h3>
                <p className="text-sm opacity-60 mb-6 line-clamp-2">{ev.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold opacity-40 mb-8 uppercase">
                  <MapPin className="w-4 h-4 text-neon-purple" /> {ev.location} • {ev.time}
                </div>
              </div>
              <div className="flex gap-4">
                {isAdmin && (
                  <button onClick={() => handleDeleteEvent(ev.id)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => setShowEventApplyModal(ev)}
                  className="flex-1 bg-foreground text-background py-3 rounded-xl font-bold hover:bg-neon-purple hover:text-white transition-all shadow-lg"
                >
                  Join Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recruitment Portal */}
      <section id="jobs" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 dark:neon-glow-orange">Recruiting Portal</h2>
            <p className="text-foreground/60 font-medium text-lg">Opportunities curated for our community by Ibandla partners.</p>
          </div>
          
          <div className="flex gap-4">
            {isAdmin && (
              <button 
                onClick={() => setShowAppsModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-muted border border-border hover:bg-neon-blue hover:text-black transition-all"
              >
                Applications ({applications.length})
              </button>
            )}
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowLoginModal(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isAdmin ? 'bg-neon-blue text-black' : 'bg-muted border border-border'}`}
            >
              <Lock className="w-4 h-4" /> {isAdmin ? "Logout" : "Admin Login"}
            </button>
            {isAdmin && (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowAdminForm(true)}
                className="bg-neon-orange text-white p-3 rounded-2xl shadow-neon-orange"
              >
                <Plus className="w-6 h-6" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="p-8 rounded-3xl bg-card border border-border hover:neon-border-purple transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-neon-orange mb-1 group-hover:neon-glow-orange transition-all">{job.title}</h3>
                    <p className="font-bold opacity-80">{job.company}</p>
                  </div>
                  <span className="bg-muted px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{job.location}</span>
                </div>
                <p className="text-foreground/70 mb-8 line-clamp-3 leading-relaxed">{job.description}</p>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold opacity-40 uppercase">Posted: {job.date}</span>
                  <span className="text-xs font-bold text-neon-orange uppercase mt-1">Closes: {job.closingDate}</span>
                </div>
                <div className="flex gap-3">
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-transparent border border-red-500/50 text-red-500/80 hover:bg-red-500 hover:text-white p-2 rounded-xl transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => setShowApplyModal(job)}
                    className="bg-foreground text-background px-6 py-2 rounded-xl font-bold hover:bg-neon-blue hover:text-black transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="mt-24 border-t border-border pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/logos/ibandla-logo.png" 
                  alt="Ibandla Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-8 h-8 bg-neon-orange rounded-full flex items-center justify-center">
                  <Sun className="text-white w-5 h-5" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tighter">IBANDLA</span>
            </div>
            <p className="text-foreground/60 leading-relaxed italic">
              "We believe every young person has the seed of success. We are here to water it."
            </p>
          </div>
          
          <div>
            <h4 className="font-black mb-6 uppercase tracking-widest text-xs opacity-40">Contact Us</h4>
            <ul className="space-y-4 font-bold">
              <li className="flex items-center gap-3 justify-center md:justify-start hover:text-neon-blue transition-colors">
                <Phone className="w-4 h-4 text-neon-orange" /> 078 123 4567
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start hover:text-neon-blue transition-colors">
                <Mail className="w-4 h-4 text-neon-orange" /> info@ibandlasuccess.org
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start hover:text-neon-blue transition-colors">
                <MapPin className="w-4 h-4 text-neon-orange" /> Soweto, South Africa
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col items-center md:items-end justify-center">
            <div className="text-center md:text-right">
              <h3 className="text-5xl font-black mb-4 dark:neon-glow-purple">JOIN THE MOVEMENT</h3>
              <p className="text-lg opacity-60 mb-8">Donate or volunteer today.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowJoinModal(true)}
                  className="px-8 py-3 border-2 border-foreground rounded-2xl font-bold hover:bg-foreground hover:text-background transition-all"
                >
                  Support Us
                </button>
                <button 
                  onClick={() => setShowJoinModal(true)}
                  className="px-8 py-3 bg-neon-blue text-black rounded-2xl font-bold hover:opacity-80 transition-all"
                >
                  Volunteer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border opacity-50 text-xs font-bold uppercase tracking-[0.2em]">
          <span>© 2024 IBANDLA YOUTH SUCCESS (NGO)</span>
          <span className="flex items-center gap-2">
            POWERED BY <span className="text-neon-orange font-black text-sm">TECHINOP</span>
          </span>
        </div>
      </footer>

      {/* --- Modals & Overlays --- */}
      <AnimatePresence>
        {/* Admin Login Modal */}
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-md rounded-[2rem] p-10 border border-neon-blue/30 shadow-neon-blue relative"
            >
              <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted"><X/></button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-neon-blue w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-foreground">ADMIN LOGIN</h2>
                <p className="text-foreground/60">Ibandla Pictures Access</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="email" placeholder="Username / Email" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                <input name="password" type="password" placeholder="Password" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                <button type="submit" className="w-full bg-neon-blue text-black p-5 rounded-2xl font-black text-lg hover:shadow-neon-blue transition-all">VERIFY IDENTITY</button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Admin Applications View Modal */}
        {showAppsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-[2rem] p-10 border border-neon-purple/30 shadow-neon-purple relative flex flex-col"
            >
              <button 
                onClick={() => setShowAppsModal(false)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted"
              >
                <X/>
              </button>
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-neon-purple text-white shadow-neon-purple' : 'bg-muted opacity-50'}`}
                >
                  Jobs ({applications.length})
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-neon-blue text-white shadow-neon-blue' : 'bg-muted opacity-50'}`}
                >
                  Events ({eventApplications.length})
                </button>
                <button 
                  onClick={() => setActiveTab('ngo')}
                  className={`flex-1 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'ngo' ? 'bg-neon-orange text-white shadow-neon-orange' : 'bg-muted opacity-50'}`}
                >
                  NGO Joins ({registrations.length})
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar text-left">
                {activeTab === 'jobs' ? (
                  applications.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <Briefcase className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-bold">No job applications yet.</p>
                    </div>
                  ) : (
                    applications.map(app => (
                      <div key={app.id} className="p-6 rounded-2xl bg-muted border border-border hover:border-neon-purple transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-neon-purple">{app.name}</h4>
                          <p className="font-medium opacity-60 text-sm">{app.email}</p>
                          <p className="text-[10px] uppercase font-bold opacity-30 mt-1">CV: {app.cvName}</p>
                        </div>
                        <div className="flex flex-col md:items-end gap-3">
                          <div className="flex gap-2">
                             <button 
                              onClick={() => downloadCV(app)}
                              className="bg-neon-blue/20 text-neon-blue text-[10px] font-black px-3 py-1 rounded-full hover:bg-neon-blue hover:text-black transition-all"
                            >
                              DOWNLOAD CV
                            </button>
                            <button 
                              onClick={() => handleDeleteApp(app.id)}
                              className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all"
                            >
                              DELETE
                            </button>
                          </div>
                          <div className="md:text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-foreground/10 px-3 py-1 rounded-full mb-1 inline-block">
                              {app.jobTitle}
                            </span>
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Received: {app.date}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : activeTab === 'events' ? (
                   eventApplications.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <Calendar className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-bold">No event registrations yet.</p>
                    </div>
                  ) : (
                    eventApplications.map(app => (
                      <div key={app.id} className="p-6 rounded-2xl bg-muted border border-border hover:border-neon-blue transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-neon-blue">{app.name}</h4>
                          <p className="font-medium opacity-60 text-sm">{app.email}</p>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <button 
                            onClick={() => handleDeleteEventApp(app.id)}
                            className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all w-fit"
                          >
                            DELETE
                          </button>
                          <div className="md:text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-foreground/10 px-3 py-1 rounded-full mb-1 inline-block">
                              {app.eventTitle}
                            </span>
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Registred: {app.date}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  registrations.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <Users className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-bold">No NGO registrations yet.</p>
                    </div>
                  ) : (
                    registrations.map(reg => (
                      <div key={reg.id} className="p-6 rounded-2xl bg-muted border border-border hover:border-neon-orange transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="text-xl font-bold text-neon-orange">{reg.name}</h4>
                          <p className="font-medium opacity-60">{reg.email} • {reg.phone}</p>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <button 
                            onClick={() => handleDeleteReg(reg.id)}
                            className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all w-fit self-end"
                          >
                            DELETE
                          </button>
                          <div className="md:text-right">
                            <span className="text-xs font-black uppercase tracking-widest bg-foreground/10 px-3 py-1 rounded-full mb-1 inline-block">
                              {reg.type}
                            </span>
                            <p className="text-xs font-bold opacity-40">Joined: {reg.date}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Admin Post Modal */}
        {showAdminForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-xl rounded-[2rem] p-10 border border-neon-blue/30 shadow-neon-blue relative"
            >
              <button onClick={() => setShowAdminForm(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted"><X/></button>
              <h2 className="text-3xl font-black mb-8 text-neon-blue">POST NEW VACANCY</h2>
              <form onSubmit={handleAddJob} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input name="title" placeholder="Job Title" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                  <input name="company" placeholder="Company" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="location" placeholder="Location" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                  <div className="relative">
                    <input type="date" name="closingDate" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                    <span className="absolute -top-2 left-4 bg-card px-2 text-[10px] font-bold text-neon-blue uppercase">Closing Date</span>
                  </div>
                </div>
                <textarea name="description" placeholder="Position requirements and details..." rows={4} required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors resize-none" />
                <button type="submit" className="w-full bg-neon-blue text-black p-5 rounded-2xl font-black text-lg hover:shadow-neon-blue transition-all">PUBLISH POSITION</button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Apply Modal */}
        {showApplyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-xl rounded-[2rem] p-10 border border-neon-orange/30 shadow-neon-orange relative"
            >
              <button onClick={() => {
                setShowApplyModal(null);
                setSelectedCVName(null);
              }} className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted"><X/></button>
              <div className="mb-8">
                <span className="text-xs uppercase font-black text-neon-orange tracking-widest">Applying for:</span>
                <h2 className="text-3xl font-black">{showApplyModal.title}</h2>
                <p className="opacity-60">{showApplyModal.company}</p>
              </div>
              <form onSubmit={handleApply} className="space-y-6">
                <input name="name" placeholder="Full Name" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-orange transition-colors" />
                <input name="email" type="email" placeholder="Email Address" required className="bg-muted p-4 rounded-2xl border border-border w-full outline-none focus:border-neon-orange transition-colors" />
                
                <div className="relative group">
                  <input 
                    type="file" 
                    name="cv" 
                    accept=".pdf" 
                    required 
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      setSelectedCVName(file ? file.name : null);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="border-2 border-dashed border-border p-8 rounded-[2rem] text-center group-hover:border-neon-orange transition-colors bg-muted/50">
                    {selectedCVName ? (
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-neon-orange font-black text-xs uppercase tracking-widest">File Attached</span>
                         <p className="font-bold text-foreground truncate max-w-xs">{selectedCVName}</p>
                         <p className="text-[10px] opacity-40 uppercase">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold opacity-60">Click to attach CV (PDF ONLY)</p>
                        <p className="text-xs mt-2 italic opacity-40">Requirement: Must be a search-ready PDF file</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="flex-1 bg-neon-orange text-white p-5 rounded-2xl font-black text-lg hover:shadow-neon-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "PROCESSING APPLICATION..." : "SUBMIT APPLICATION"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Event Registration Modal */}
        {showEventApplyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-xl rounded-[2.5rem] p-10 border border-neon-blue/30 shadow-neon-blue relative"
            >
              <button onClick={() => setShowEventApplyModal(null)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-muted transition-colors"><X/></button>
              <div className="mb-8">
                <span className="text-xs uppercase font-black text-neon-blue tracking-widest">Registering for:</span>
                <h2 className="text-3xl font-black mt-1">{showEventApplyModal.title}</h2>
              </div>

              <form onSubmit={handleEventApply} className="space-y-6">
                <input name="name" placeholder="Full Name" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                <input name="email" type="email" placeholder="Email Address" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-blue transition-colors" />
                
                <div className="bg-muted/50 p-6 rounded-2xl border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-neon-blue" />
                    <span className="font-bold text-sm tracking-tight">{new Date(showEventApplyModal.date).toLocaleDateString('en-ZA', { dateStyle: 'full' })} at {showEventApplyModal.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-neon-blue" />
                    <span className="font-bold text-sm tracking-tight">{showEventApplyModal.location}</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-neon-blue text-black p-5 rounded-2xl font-black text-lg hover:shadow-neon-blue transition-all">
                  CONFIRM REGISTRATION
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Add Event Modal */}
        {showEventForm && isAdmin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-2xl rounded-[3rem] p-12 border border-neon-purple shadow-neon-purple relative"
            >
              <button onClick={() => setShowEventForm(false)} className="absolute top-10 right-10 p-2 rounded-full hover:bg-muted transition-colors"><X/></button>
              <h2 className="text-4xl font-black mb-10 dark:neon-glow-purple">NEW EVENT</h2>
              <form onSubmit={handleAddEvent} className="space-y-6">
                <input name="title" placeholder="Event Title" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-purple transition-all" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="date" type="date" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-purple transition-all" />
                  <input name="time" type="time" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-purple transition-all" />
                </div>
                <input name="location" placeholder="Location/Venue" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-purple transition-all" />
                <textarea name="description" placeholder="Event Details..." required className="bg-muted p-5 rounded-2xl border border-border w-full h-32 resize-none outline-none focus:border-neon-purple transition-all" />
                <button type="submit" className="w-full bg-neon-purple text-white p-6 rounded-2xl font-black text-xl hover:shadow-neon-purple transition-all">
                  PUBLISH EVENT
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showJoinModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-xl rounded-[3rem] p-12 border border-neon-orange/40 shadow-neon-orange relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-orange via-neon-purple to-neon-blue" />
              <button 
                onClick={() => setShowJoinModal(false)} 
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-4xl font-black mb-4 dark:neon-glow-orange">BE THE CHANGE</h2>
                <p className="text-foreground/60 font-medium italic">"Join Ibandla Youth Success and help us shape the future leaders of South Africa."</p>
              </div>

              <form 
                onSubmit={handleJoinNGO} 
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <input name="name" placeholder="Full Name" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-orange transition-all" />
                  <input name="phone" placeholder="Contact Number" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-orange transition-all" />
                </div>
                <input name="email" type="email" placeholder="Email Address" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-orange transition-all" />
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-2">Choose your path</label>
                  <select name="type" required className="bg-muted p-5 rounded-2xl border border-border w-full outline-none focus:border-neon-orange transition-all appearance-none">
                    <option value="">Select Involvement...</option>
                    <option value="volunteer">Volunteer Member</option>
                    <option value="mentor">Professional Mentor</option>
                    <option value="partner">Corporate Partner</option>
                    <option value="donor">Individual Supporter</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-foreground text-background p-6 rounded-2xl font-black text-xl hover:bg-neon-orange hover:text-white transition-all shadow-xl">
                    REGISTER NOW
                  </button>
                  <p className="text-center text-[10px] uppercase font-bold opacity-30 mt-6 tracking-widest">
                    Powered by Techinop Community Engine
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
