const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const store = require('./store');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Same-origin client served automatically

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// REST API
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await store.getTeams();
    res.json(teams);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'internal error' });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const name = req.body && req.body.name ? String(req.body.name) : '';
    const team = await store.createTeam(name);
    io.emit('team:created', team);
    res.status(201).json(team);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'internal error' });
  }
});

app.get('/api/teams/:teamId/channels', async (req, res) => {
  try {
    const channels = await store.getChannels(req.params.teamId);
    res.json(channels);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'internal error' });
  }
});

app.post('/api/teams/:teamId/channels', async (req, res) => {
  try {
    const name = req.body && req.body.name ? String(req.body.name) : '';
    const channel = await store.createChannel(req.params.teamId, name);
    io.to(`team:${req.params.teamId}`).emit('channel:created', channel);
    res.status(201).json(channel);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'internal error' });
  }
});

app.get('/api/channels/:channelId/messages', async (req, res) => {
  try {
    const { limit } = req.query;
    const messages = await store.getMessages(req.params.channelId, limit);
    res.json(messages);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'internal error' });
  }
});

// Socket.IO
function emitTeamPresence(teamId) {
  const room = io.sockets.adapter.rooms.get(`team:${teamId}`);
  const count = room ? room.size : 0;
  io.to(`team:${teamId}`).emit('presence:update', { teamId, count });
}

io.on('connection', (socket) => {
  socket.data.name = `Guest-${socket.id.slice(0, 4)}`;
  socket.data.teamId = null;
  socket.data.channelId = null;

  socket.on('register', ({ name } = {}) => {
    if (typeof name === 'string' && name.trim()) {
      socket.data.name = name.trim();
    }
  });

  socket.on('joinTeam', ({ teamId } = {}) => {
    if (!teamId) return;
    if (socket.data.teamId) socket.leave(`team:${socket.data.teamId}`);
    socket.data.teamId = teamId;
    socket.join(`team:${teamId}`);
    emitTeamPresence(teamId);
  });

  socket.on('joinChannel', ({ channelId } = {}) => {
    if (!channelId) return;
    if (socket.data.channelId) socket.leave(`channel:${socket.data.channelId}`);
    socket.data.channelId = channelId;
    socket.join(`channel:${channelId}`);
  });

  socket.on('message:send', async ({ channelId, text } = {}) => {
    try {
      if (!channelId || typeof text !== 'string' || !text.trim()) return;
      const message = await store.addMessage(channelId, { userName: socket.data.name, text });
      io.to(`channel:${channelId}`).emit('message:new', message);
    } catch (err) {
      // No-op: keep the socket alive and let client handle misses
    }
  });

  socket.on('typing:start', ({ channelId } = {}) => {
    if (!channelId) return;
    socket.to(`channel:${channelId}`).emit('typing', { channelId, name: socket.data.name, isTyping: true });
  });

  socket.on('typing:stop', ({ channelId } = {}) => {
    if (!channelId) return;
    socket.to(`channel:${channelId}`).emit('typing', { channelId, name: socket.data.name, isTyping: false });
  });

  socket.on('disconnect', () => {
    if (socket.data.teamId) emitTeamPresence(socket.data.teamId);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
