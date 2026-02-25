import { useState, useEffect } from 'react';
import api from '../api';
import { Filter, Search, User, Mail, Calendar, MessageSquare, ChevronRight, LayoutDashboard, Inbox, TrendingUp, Users, CheckCircle, Clock, Trash2, ChevronDown } from 'lucide-react';

const AdminDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            setLeads(response.data);
        } catch (err) {
            console.error('Failed to fetch leads', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/leads/${id}`, { status: newStatus });
            fetchLeads();
            if (selectedLead && selectedLead.id === id) {
                setSelectedLead(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleSaveNote = async () => {
        if (!selectedLead) return;
        try {
            await api.patch(`/leads/${selectedLead.id}`, { notes: noteText });
            fetchLeads();
            setSelectedLead({ ...selectedLead, notes: noteText });
        } catch (err) {
            alert('Failed to save note');
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
        try {
            await api.delete(`/leads/${id}`);
            if (selectedLead && selectedLead.id === id) {
                setSelectedLead(null);
                setNoteText('');
            }
            fetchLeads();
        } catch (err) {
            alert('Failed to delete lead');
        }
    };

    const filteredLeads = leads.filter(l => {
        const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = l.name.toLowerCase().includes(searchLower) || l.email.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
    });

    // Calculate Stats
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;

    return (
        <div className="container">
            <div className="flex justify-between items-end fade-in stagger-1" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LayoutDashboard size={28} color="var(--neon-cyan)" />
                        Admin Dashboard
                    </h1>
                    <p className="m-0">Real-time overview of your lead pipeline.</p>
                </div>
            </div>

            {/* Top Stats Grid -> Mimics reference image */}
            <div className="stats-grid fade-in stagger-2">
                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, var(--neon-purple) 0%, rgba(176,38,255,0.2) 100%)' }}></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Total Volume</p>
                            <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0 0 0', color: 'var(--neon-purple)', textShadow: '0 0 30px rgba(176, 38, 255, 0.4)' }}>{totalLeads}</h2>
                        </div>
                        <div style={{ background: 'rgba(176, 38, 255, 0.15)', padding: '0.85rem', borderRadius: 'var(--radius)', boxShadow: 'inset 0 0 10px rgba(176,38,255,0.2)' }}>
                            <TrendingUp size={28} color="var(--neon-purple)" />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, var(--neon-cyan) 0%, rgba(0,240,255,0.2) 100%)' }}></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Inbound (New)</p>
                            <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0 0 0', color: 'var(--neon-cyan)', textShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}>{newLeads}</h2>
                        </div>
                        <div style={{ background: 'rgba(0, 240, 255, 0.15)', padding: '0.85rem', borderRadius: 'var(--radius)', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.2)' }}>
                            <Inbox size={28} color="var(--neon-cyan)" />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, var(--neon-yellow) 0%, rgba(255,234,0,0.2) 100%)' }}></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Active (Contacted)</p>
                            <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0 0 0', color: 'var(--neon-yellow)', textShadow: '0 0 30px rgba(255, 234, 0, 0.4)' }}>{contactedLeads}</h2>
                        </div>
                        <div style={{ background: 'rgba(255, 234, 0, 0.15)', padding: '0.85rem', borderRadius: 'var(--radius)', boxShadow: 'inset 0 0 10px rgba(255,234,0,0.2)' }}>
                            <Clock size={28} color="var(--neon-yellow)" />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, var(--neon-green) 0%, rgba(0,255,136,0.2) 100%)' }}></div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', margin: 0, fontWeight: '700', color: 'var(--text-secondary)' }}>Won (Converted)</p>
                            <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0 0 0', color: 'var(--neon-green)', textShadow: '0 0 30px rgba(0, 255, 136, 0.4)' }}>{convertedLeads}</h2>
                        </div>
                        <div style={{ background: 'rgba(0, 255, 136, 0.15)', padding: '0.85rem', borderRadius: 'var(--radius)', boxShadow: 'inset 0 0 10px rgba(0,255,136,0.2)' }}>
                            <CheckCircle size={28} color="var(--neon-green)" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-layout">
                {/* Main Table Area */}
                <div className="card fade-in stagger-3" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {/* Header Section */}
                    <div className="admin-header flex justify-between items-center" style={{ padding: '1.25rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', background: 'var(--info-bg)', borderRadius: 'var(--radius)', color: 'var(--neon-cyan)', boxShadow: '0 0 15px rgba(0, 210, 255, 0.15)' }}>
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="m-0" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>Recent Leads</h3>
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All incoming leads and their current status.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2" style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}>
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '2.5rem', width: '220px', fontSize: '0.85rem' }}
                                />
                            </div>
                            <div className="flex items-center gap-2" style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', color: 'var(--neon-cyan)', pointerEvents: 'none', zIndex: 2 }}>
                                    <Filter size={16} />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ paddingLeft: '2.5rem', width: '180px' }}
                                >
                                    <option value="All">All Pipelines</option>
                                    <option value="New">Status: New</option>
                                    <option value="Contacted">Status: Contacted</option>
                                    <option value="Converted">Status: Converted</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="table-desktop">
                        <div className="table-container" style={{ padding: '0 0.5rem 1rem 0.5rem' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Contact Info</th>
                                        <th>Source</th>
                                        <th>Status</th>
                                        <th>Date Added</th>
                                        <th>Update Status</th>
                                        <th style={{ width: '40px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem 2rem' }}>
                                                <div className="flex flex-col gap-4">
                                                    <div className="animate-pulse w-full" style={{ height: '56px', borderRadius: 'var(--radius-sm)' }}></div>
                                                    <div className="animate-pulse w-full" style={{ height: '56px', borderRadius: 'var(--radius-sm)' }}></div>
                                                    <div className="animate-pulse w-full" style={{ height: '56px', borderRadius: 'var(--radius-sm)' }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                                                <div className="flex flex-col items-center gap-4 fade-in">
                                                    <div style={{ background: 'var(--bg-darken)', padding: '1.5rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
                                                        <Inbox size={40} />
                                                    </div>
                                                    <div>
                                                        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>No leads found</h3>
                                                        <p style={{ margin: '0.5rem 0 0 0' }}>No leads match your current filter criteria.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeads.map(lead => (
                                            <tr
                                                key={lead.id}
                                                style={{
                                                    cursor: 'pointer',
                                                    transform: selectedLead?.id === lead.id ? 'translateX(5px)' : 'none',
                                                    boxShadow: selectedLead?.id === lead.id ? 'var(--glow-primary)' : 'none'
                                                }}
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setNoteText(lead.notes || '');
                                                }}
                                            >
                                                <td>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{lead.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginTop: '0.25rem' }}>{lead.email}</div>
                                                </td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{lead.source}</td>
                                                <td>
                                                    <span className={`badge badge-${lead.status.toLowerCase()}`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-3">
                                                        <div style={{ position: 'relative' }}>
                                                            <select
                                                                value={lead.status}
                                                                onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                                                            >
                                                                <option value="New">Set: New</option>
                                                                <option value="Contacted">Set: Contacted</option>
                                                                <option value="Converted">Set: Converted</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right', paddingRight: '1rem' }}>
                                                    <div className="flex items-center gap-4 justify-end">
                                                        <button
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            style={{ background: 'transparent', border: 'none', color: 'var(--danger-text)', padding: '0.5rem', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }}
                                                            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                                            onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                                                            title="Delete Lead"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        <ChevronRight size={20} color={selectedLead?.id === lead.id ? 'var(--neon-cyan)' : 'var(--text-muted)'} style={{ pointerEvents: 'none' }} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>{/* end table-desktop */}

                    {/* ── Mobile Lead Cards (shown only on small screens) ── */}
                    <div className="lead-cards-mobile">
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading leads...</div>
                        ) : filteredLeads.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                                <Inbox size={36} color="var(--text-muted)" />
                                <p style={{ marginTop: '1rem' }}>No leads found</p>
                            </div>
                        ) : (
                            filteredLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    className="lead-card-mobile"
                                    onClick={() => { setSelectedLead(lead); setNoteText(lead.notes || ''); }}
                                    style={{ borderLeft: selectedLead?.id === lead.id ? '3px solid var(--neon-cyan)' : '3px solid transparent' }}
                                >
                                    <div className="lead-card-mobile-header">
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-primary)' }}>{lead.name}</div>
                                            <div style={{ fontSize: '0.82rem', color: 'var(--neon-cyan)', marginTop: '0.15rem' }}>{lead.email}</div>
                                        </div>
                                        <span className={`badge badge-${lead.status.toLowerCase()}`}>{lead.status}</span>
                                    </div>
                                    <div className="lead-card-mobile-meta">
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{lead.source}</span>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="lead-card-mobile-actions" onClick={e => e.stopPropagation()}>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Converted">Converted</option>
                                        </select>
                                        <button
                                            onClick={() => handleDeleteLead(lead.id)}
                                            style={{ background: 'rgba(255,0,120,0.1)', border: '1px solid rgba(255,0,120,0.3)', color: 'var(--danger-text)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', minHeight: '40px', display: 'flex', alignItems: 'center' }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>{/* end main table card */}

                {selectedLead ? (
                    <div className="card fade-in stagger-4" style={{ position: 'sticky', top: '6rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-cyan)' }}>
                                Lead Details
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDeleteLead(selectedLead.id)}
                                    style={{ background: 'var(--danger-bg)', border: '1px solid rgba(255,0,120,0.3)', width: '36px', height: '36px', borderRadius: '50%', padding: 0, color: 'var(--danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    title="Delete Lead"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    style={{ background: 'var(--bg-darken)', border: '1px solid var(--border-color)', width: '36px', height: '36px', borderRadius: '50%', padding: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                    title="Close Profile"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4 items-center">
                                <div style={{ background: 'var(--bg-darken)', padding: '1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                                    <User size={24} color="var(--neon-purple)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Identity</div>
                                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{selectedLead.name}</div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div style={{ background: 'var(--bg-darken)', padding: '1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                                    <Mail size={24} color="var(--neon-cyan)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Email Address</div>
                                    <a href={`mailto:${selectedLead.email}`} style={{ display: 'block', fontSize: '1rem' }}>{selectedLead.email}</a>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div style={{ background: 'var(--bg-darken)', padding: '1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                                    <Calendar size={24} color="var(--neon-orange)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Submitted On</div>
                                    <div style={{ color: 'var(--text-primary)' }}>{new Date(selectedLead.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                                    <MessageSquare size={18} color="var(--text-secondary)" />
                                    <label style={{ margin: 0 }}>Notes & Follow-ups</label>
                                </div>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add follow-up notes for this lead..."
                                    style={{ height: '160px', resize: 'vertical' }}
                                ></textarea>
                                <button
                                    onClick={handleSaveNote}
                                    className="btn-accent w-full"
                                    style={{ marginTop: '1.5rem', padding: '0.8rem' }}
                                >
                                    Save Notes
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card fade-in stagger-4 flex flex-col items-center justify-center gap-4" style={{ height: '100%', minHeight: '400px', padding: '2rem', borderStyle: 'dashed', borderColor: 'var(--border-focus)' }}>
                        <div style={{ opacity: 0.3, animation: 'glowPulse 4s infinite' }}>
                            <Search size={64} color="var(--neon-cyan)" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--text-secondary)', margin: 0 }}>Select a Lead</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Click any lead from the list to view full details.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
