const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 🔐 Middleware to protect route and get user info from token
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// 📦 Fake list of projects for now
const allProjects = [
    { id: 1, name: 'Admin Project', assignedTo: 'admin' },
    { id: 2, name: 'Subcontractor Project', assignedTo: 'sub1' },
    { id: 3, name: 'User Project', assignedTo: 'user1' },
];

// ✅ GET /api/projects
router.get('/projects', authMiddleware, (req, res) => {
    const user = req.user;
    console.log('🧾 User making request:', user);

    if (user.role === 'admin') {
        return res.json(allProjects);
    }

    const filtered = allProjects.filter(project => project.assignedTo === user.id);
    return res.json(filtered);
});

module.exports = router;
