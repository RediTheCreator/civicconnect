const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../')));

// Database
const db = new Database('./civicconnect.db');
console.log('✅ Database u lidh me sukses!');

// Krijo tabelat
db.exec(`CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    institution TEXT NOT NULL,
    category TEXT NOT NULL,
    slaHours INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    photo TEXT,
    status TEXT DEFAULT 'pending',
    timestamp TEXT NOT NULL,
    response TEXT,
    responseTime INTEGER,
    feedback TEXT
)`);
console.log('✅ Tabelat u krijuan!');

// ==================
// ENDPOINT-ET
// ==================

// Merr të gjitha ankesat
app.get('/api/complaints', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM complaints ORDER BY timestamp DESC').all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dërgo ankesë të re
app.post('/api/complaints', (req, res) => {
    try {
        const { id, name, institution, category, slaHours, subject, message, photo, timestamp } = req.body;
        db.prepare(`INSERT INTO complaints (id, name, institution, category, slaHours, subject, message, photo, status, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`)
            .run(id, name, institution, category, slaHours, subject, message, photo || null, timestamp);
        res.json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Përgjigju ankesës
app.put('/api/complaints/:id/respond', (req, res) => {
    try {
        const { response, responseTime } = req.body;
        db.prepare(`UPDATE complaints SET status='answered', response=?, responseTime=? WHERE id=?`)
            .run(response, responseTime, req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Klasifiko si e pavlefshme
app.put('/api/complaints/:id/dismiss', (req, res) => {
    try {
        db.prepare(`UPDATE complaints SET status='dismissed' WHERE id=?`)
            .run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lër feedback
app.put('/api/complaints/:id/feedback', (req, res) => {
    try {
        const { feedback } = req.body;
        db.prepare(`UPDATE complaints SET feedback=? WHERE id=?`)
            .run(feedback, req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fshi të gjitha ankesat
app.delete('/api/complaints', (req, res) => {
    try {
        db.prepare('DELETE FROM complaints').run();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Starto serverin
app.listen(PORT, () => {
    console.log(`🚀 Serveri u startua në http://localhost:${PORT}`);
});
