import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('crm_token', response.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Authentication failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '420px', marginTop: '6rem' }}>
            <div className="card fade-in" style={{ padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden', borderTop: '4px solid var(--neon-purple)' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(142,45,226,0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        background: 'var(--bg-darken)',
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 0 20px rgba(142, 45, 226, 0.2)'
                    }}>
                        <Lock size={32} color="var(--neon-purple)" />
                    </div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Secure Access</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Authenticate to enter the command center.</p>
                </div>

                <form onSubmit={handleLogin} className="flex gap-4" style={{ flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                    <div>
                        <label>Admin Designation</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. admin"
                            required
                        />
                    </div>

                    <div>
                        <label>Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', border: '1px solid rgba(244, 106, 106, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <ShieldAlert size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-accent"
                        disabled={loading}
                        style={{ marginTop: '1rem', padding: '0.9rem', fontSize: '1rem', border: 'none' }}
                    >
                        {loading ? 'Authenticating...' : 'Initialize Session'}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Demo Access:</span> admin / admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
