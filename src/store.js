const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

let databaseCache = null;
let pendingSave = null;

async function ensureDatabase() {
  if (databaseCache) return databaseCache;
  try {
    await fsp.mkdir(DB_DIR, { recursive: true });
    const raw = await fsp.readFile(DB_FILE, 'utf8');
    databaseCache = JSON.parse(raw);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // Initialize with a default Team/Channel
    const teamId = uuidv4();
    const channelId = uuidv4();
    databaseCache = {
      teams: {
        [teamId]: { id: teamId, name: 'General', createdAt: new Date().toISOString() }
      },
      channels: {
        [channelId]: { id: channelId, teamId, name: 'general', createdAt: new Date().toISOString() }
      },
      messagesByChannelId: {
        [channelId]: []
      }
    };
    await persist();
  }
  return databaseCache;
}

async function persist() {
  // Debounce writes to avoid excessive disk I/O under burst traffic
  if (pendingSave) return pendingSave;
  pendingSave = (async () => {
    try {
      const json = JSON.stringify(databaseCache, null, 2);
      // Write atomically via a temp file then rename
      const tempPath = DB_FILE + '.tmp';
      await fsp.writeFile(tempPath, json, 'utf8');
      await fsp.rename(tempPath, DB_FILE);
    } finally {
      pendingSave = null;
    }
  })();
  return pendingSave;
}

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    const error = new Error(`${name} is required`);
    error.statusCode = 400;
    throw error;
  }
}

async function getTeams() {
  const db = await ensureDatabase();
  return Object.values(db.teams);
}

async function createTeam(name) {
  assertNonEmptyString(name, 'name');
  const db = await ensureDatabase();
  const id = uuidv4();
  const team = { id, name: name.trim(), createdAt: new Date().toISOString() };
  db.teams[id] = team;
  await persist();
  return team;
}

async function getChannels(teamId) {
  assertNonEmptyString(teamId, 'teamId');
  const db = await ensureDatabase();
  return Object.values(db.channels).filter((c) => c.teamId === teamId);
}

async function createChannel(teamId, name) {
  assertNonEmptyString(teamId, 'teamId');
  assertNonEmptyString(name, 'name');
  const db = await ensureDatabase();
  if (!db.teams[teamId]) {
    const error = new Error('team not found');
    error.statusCode = 404;
    throw error;
  }
  const id = uuidv4();
  const channel = { id, teamId, name: name.trim(), createdAt: new Date().toISOString() };
  db.channels[id] = channel;
  if (!db.messagesByChannelId[id]) db.messagesByChannelId[id] = [];
  await persist();
  return channel;
}

async function getMessages(channelId, limit = 50) {
  assertNonEmptyString(channelId, 'channelId');
  const db = await ensureDatabase();
  const all = db.messagesByChannelId[channelId] || [];
  const safeLimit = Math.max(1, Math.min(200, Number(limit) || 50));
  return all.slice(-safeLimit);
}

async function addMessage(channelId, { userName, text }) {
  assertNonEmptyString(channelId, 'channelId');
  assertNonEmptyString(text, 'text');
  const db = await ensureDatabase();
  if (!db.messagesByChannelId[channelId]) db.messagesByChannelId[channelId] = [];
  const message = {
    id: uuidv4(),
    channelId,
    userName: typeof userName === 'string' && userName.trim() ? userName.trim() : 'Unknown',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  db.messagesByChannelId[channelId].push(message);
  await persist();
  return message;
}

module.exports = {
  getTeams,
  createTeam,
  getChannels,
  createChannel,
  getMessages,
  addMessage
};
