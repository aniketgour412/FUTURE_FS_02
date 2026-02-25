import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('crm_token');

    const handleLogout = () => {
        localStorage.removeItem('crm_token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar fade-in">
            <div className="navbar-inner">
                {/* Logo */}
                <Link to="/" className="logo flex items-center gap-3" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'var(--info-bg)',
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
                    }}>
                        <Activity size={22} color="var(--neon-cyan)" />
                    </div>
                    <div className="flex items-baseline">
                        <span className="logo-main">Lead</span>
                        <span className="logo-sub">CRM</span>
                    </div>
                </Link>

                {/* Nav Actions */}
                <div className="nav-actions">
                    <Link
                        to="/"
                        className={isActive('/') ? 'nav-btn nav-btn-active' : 'nav-btn'}
                        title="Add Lead"
                    >
                        <PlusCircle size={17} />
                        <span className="nav-btn-label">Add Lead</span>
                    </Link>

                    {token ? (
                        <>
                            <Link
                                to="/admin"
                                className={isActive('/admin') ? 'nav-btn nav-btn-primary nav-btn-active' : 'nav-btn nav-btn-primary'}
                                title="Dashboard"
                            >
                                <LayoutDashboard size={17} />
                                <span className="nav-btn-label">Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="nav-btn nav-btn-danger"
                                title="Logout"
                            >
                                <LogOut size={17} />
                                <span className="nav-btn-label">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-btn nav-btn-primary" title="Admin Login">
                            <span className="nav-btn-label">Admin Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
