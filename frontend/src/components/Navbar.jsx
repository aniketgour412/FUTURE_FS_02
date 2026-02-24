import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, LayoutDashboard, PlusCircle, MonitorDot } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('crm_token');

    const handleLogout = () => {
        localStorage.removeItem('crm_token');
        navigate('/login');
    };

    return (
        <nav className="navbar fade-in" style={{ padding: '1rem 0', background: 'rgba(5, 5, 8, 0.6)' }}>
            <div className="container flex justify-between items-center" style={{ padding: '0.5rem 2.5rem' }}>
                <Link to="/" className="logo flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--info-bg)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.3), 0 0 20px rgba(0, 240, 255, 0.4)' }}>
                        <Activity size={26} color="var(--neon-cyan)" />
                    </div>
                    <div className="flex items-baseline" style={{ whiteSpace: 'nowrap' }}>
                        <span className="logo-main" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}>Lead</span>
                        <span className="logo-sub">CRM</span>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="btn-accent"
                        style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-full)' }}
                    >
                        <PlusCircle size={18} />
                        Add Lead
                    </Link>
                    {token ? (
                        <>
                            <Link
                                to="/admin"
                                className="btn-primary"
                                style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-full)', boxShadow: '0 0 25px rgba(176, 38, 255, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)' }}
                            >
                                <MonitorDot size={18} />
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem', borderColor: 'rgba(244, 106, 106, 0.3)', color: 'var(--danger-text)', borderRadius: 'var(--radius-full)' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', background: 'var(--gradient-purple)', border: 'none', borderRadius: 'var(--radius-full)' }}>Admin Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
