const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Simple UUID-like ID generator (avoids ESM-only uuid v13 issue)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Vercel serverless has read-only filesystem except /tmp
const DATA_FILE = process.env.VERCEL
    ? '/tmp/leads.json'
    : path.join(__dirname, 'data', 'leads.json');

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        // Allow localhost in dev and the production frontend URL set in env
        const allowed = [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.ALLOWED_ORIGIN,
        ].filter(Boolean);
        if (allowed.some(o => origin.startsWith(o)) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());

// Helper functions for data
const ensureDataDirExists = () => {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const readLeads = () => {
    ensureDataDirExists();
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading leads file:', err);
        return [];
    }
};

const writeLeads = (leads) => {
    ensureDataDirExists();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
    } catch (err) {
        console.error('Error writing leads file:', err);
        throw new Error('Failed to save data');
    }
};

// Middleware for Auth
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No authentication token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- API Routes ---

// 1. Admin Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// 2. Lead Capture (Public)
app.post('/api/leads', (req, res) => {
    const { name, email, phone, source } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    const leads = readLeads();
    const newLead = {
        id: generateId(),
        name,
        email,
        phone,
        source,
        status: 'New',
        notes: '',
        createdAt: new Date().toISOString()
    };

    leads.push(newLead);
    writeLeads(leads);
    res.status(201).json(newLead);
});

// 3. Get All Leads (Protected)
app.get('/api/leads', authenticateToken, (req, res) => {
    const leads = readLeads();
    res.json(leads);
});

// 4. Update Lead Status/Notes (Protected)
app.patch('/api/leads/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    let leads = readLeads();
    const leadIndex = leads.findIndex(l => l.id === id);

    if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found' });
    }

    if (status) leads[leadIndex].status = status;
    if (notes !== undefined) leads[leadIndex].notes = notes;

    writeLeads(leads);
    res.json(leads[leadIndex]);
});

// 5. Delete Lead (Protected)
app.delete('/api/leads/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    let leads = readLeads();

    const initialLength = leads.length;
    leads = leads.filter(l => l.id !== id);

    if (leads.length === initialLength) {
        return res.status(404).json({ message: 'Lead not found' });
    }

    writeLeads(leads);
    res.json({ message: 'Lead deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
