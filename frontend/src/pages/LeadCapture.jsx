import { useState } from 'react';
import api from '../api';
import { Send, CheckCircle, Activity, ChevronDown, User, Mail, Phone } from 'lucide-react';

const LeadCapture = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/leads', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', source: 'Website' });
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="container lead-capture-form" style={{ textAlign: 'center' }}>
                <div className="card fade-in flex-col items-center gap-2" style={{ borderTop: '4px solid var(--neon-green)' }}>
                    <div style={{ background: 'var(--success-bg)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--neon-green)', boxShadow: '0 0 20px rgba(0, 176, 155, 0.2)' }}>
                        <CheckCircle size={48} />
                    </div>
                    <h2 style={{ color: 'var(--text-primary)' }}>Lead Submitted!</h2>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>Your information has been received. We'll be in touch shortly.</p>
                    <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '2.5rem' }}>
                        Submit Another Lead
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container lead-capture-form" style={{ maxWidth: '650px', marginTop: '6vh', marginBottom: '8vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="card fade-in" style={{ padding: '3.5rem 3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(0, 240, 255, 0.1)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--gradient-blue)' }}></div>

                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <div className="flex justify-center" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--info-bg)', padding: '1rem', borderRadius: '50%', color: 'var(--neon-cyan)', boxShadow: '0 0 20px rgba(0, 210, 255, 0.2)' }}>
                            <Activity size={32} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Contact Us</h1>
                    <p className="m-0">Fill in your details below and we'll get back to you.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div style={{ position: 'relative' }}>
                        <label>Full Name</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name..."
                                required
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label>Email Address</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="yourname@email.com"
                                required
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label>Phone Number <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'none', letterSpacing: 'normal' }}>(Optional)</span></label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }}>
                                <Phone size={18} />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Your phone number..."
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label>Lead Source</label>
                        <select
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            style={{
                                appearance: 'none',
                                color: 'var(--neon-cyan)',
                                fontWeight: '500',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <option value="Website">Website</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Referral">Referral</option>
                            <option value="Other">Other</option>
                        </select>
                        <div style={{ position: 'absolute', right: '1rem', top: '42px', pointerEvents: 'none', color: 'var(--neon-cyan)' }}>
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {status === 'error' && (
                        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', border: '1px solid rgba(244, 106, 106, 0.3)', boxShadow: '0 0 10px rgba(244, 106, 106, 0.1)' }}>
                            {message}
                        </div>
                    )}

                    <div style={{ marginTop: '1.5rem' }}>
                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={status === 'loading'}
                            style={{ padding: '0.9rem', fontSize: '1rem', background: 'var(--gradient-blue)', border: 'none' }}
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-pulse flex items-center gap-2">
                                        <Activity size={18} /> Submitting...
                                    </span>
                                </span>
                            ) : (
                                <>
                                    <span>Submit Lead</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                            Your information is safe and secure with us.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadCapture;
