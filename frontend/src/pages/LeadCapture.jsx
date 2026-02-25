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
    const [status, setStatus] = useState('idle');
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
            <div className="capture-page">
                <div className="card fade-in capture-success">
                    <div className="capture-success-icon">
                        <CheckCircle size={44} color="var(--neon-green)" />
                    </div>
                    <h2>Lead Submitted!</h2>
                    <p>Your information has been received. We'll be in touch shortly.</p>
                    <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '1.5rem' }}>
                        Submit Another Lead
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="capture-page">
            <div className="card fade-in capture-card">
                <div className="capture-header">
                    <div className="capture-icon">
                        <Activity size={28} color="var(--neon-cyan)" />
                    </div>
                    <h1 className="capture-title">Contact Us</h1>
                    <p className="capture-subtitle">Fill in your details below and we'll get back to you.</p>
                </div>

                <form onSubmit={handleSubmit} className="capture-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-icon-wrap">
                            <span className="input-icon"><User size={17} /></span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name..."
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-icon-wrap">
                            <span className="input-icon"><Mail size={17} /></span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="yourname@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Phone <span className="label-optional">(Optional)</span></label>
                        <div className="input-icon-wrap">
                            <span className="input-icon"><Phone size={17} /></span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Your phone number..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Lead Source</label>
                        <div style={{ position: 'relative' }}>
                            <select name="source" value={formData.source} onChange={handleChange}>
                                <option value="Website">Website</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Referral">Referral</option>
                                <option value="Other">Other</option>
                            </select>
                            <span className="select-arrow"><ChevronDown size={18} /></span>
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="form-error">{message}</div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary w-full capture-submit"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <><Activity size={17} /> Submitting...</>
                        ) : (
                            <><Send size={17} /> Submit Lead</>
                        )}
                    </button>

                    <p className="capture-note">Your information is safe and secure with us.</p>
                </form>
            </div>
        </div>
    );
};

export default LeadCapture;
