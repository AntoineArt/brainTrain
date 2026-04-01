import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';
import { internal } from './_generated/api';

const LOBBY_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1
const LOBBY_CODE_LENGTH = 6;
const MAX_PLAYERS = 6;

function generateLobbyCode(): string {
  let code = '';
  for (let i = 0; i < LOBBY_CODE_LENGTH; i++) {
    code += LOBBY_CODE_CHARS[Math.floor(Math.random() * LOBBY_CODE_CHARS.length)];
  }
  return code;
}

// ─── Queries ───

export const getLobby = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const lobby = await ctx.db
      .query('lobbies')
      .withIndex('by_code', (q) => q.eq('code', code.toUpperCase()))
      .unique();
    if (!lobby) return null;

    const players = await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobby._id))
      .take(MAX_PLAYERS);

    return { ...lobby, players };
  },
});

export const getPlayers = query({
  args: { lobbyId: v.id('lobbies') },
  handler: async (ctx, { lobbyId }) => {
    return await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobbyId))
      .take(MAX_PLAYERS);
  },
});

// ─── Mutations ───

export const createLobby = mutation({
  args: { name: v.string(), clientId: v.string() },
  handler: async (ctx, { name, clientId }) => {
    // Generate unique code
    let code: string;
    let existing;
    do {
      code = generateLobbyCode();
      existing = await ctx.db
        .query('lobbies')
        .withIndex('by_code', (q) => q.eq('code', code))
        .unique();
    } while (existing);

    const lobbyId = await ctx.db.insert('lobbies', {
      code,
      status: 'waiting',
      hostClientId: clientId,
      difficulty: 1,
      duration: 45,
      createdAt: Date.now(),
    });

    await ctx.db.insert('players', {
      lobbyId,
      clientId,
      name,
      isHost: true,
      connected: true,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastActivityAt: 0,
      finished: false,
    });

    return { lobbyId, code };
  },
});

export const joinLobby = mutation({
  args: { code: v.string(), name: v.string(), clientId: v.string() },
  handler: async (ctx, { code, name, clientId }) => {
    const lobby = await ctx.db
      .query('lobbies')
      .withIndex('by_code', (q) => q.eq('code', code.toUpperCase()))
      .unique();

    if (!lobby) throw new Error('Lobby not found');
    if (lobby.status !== 'waiting') throw new Error('Game already started');

    const players = await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobby._id))
      .take(MAX_PLAYERS);

    if (players.length >= MAX_PLAYERS) throw new Error('Lobby is full');

    // Check if player is already in lobby (reconnect)
    const existingPlayer = players.find((p) => p.clientId === clientId);
    if (existingPlayer) {
      await ctx.db.patch(existingPlayer._id, { connected: true, name });
      return { lobbyId: lobby._id, code: lobby.code };
    }

    await ctx.db.insert('players', {
      lobbyId: lobby._id,
      clientId,
      name,
      isHost: false,
      connected: true,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastActivityAt: 0,
      finished: false,
    });

    return { lobbyId: lobby._id, code: lobby.code };
  },
});

export const configureLobby = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    clientId: v.string(),
    gameId: v.string(),
    difficulty: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, { lobbyId, clientId, gameId, difficulty, duration }) => {
    const lobby = await ctx.db.get(lobbyId);
    if (!lobby) throw new Error('Lobby not found');
    if (lobby.hostClientId !== clientId) throw new Error('Only host can configure');
    if (lobby.status !== 'waiting') throw new Error('Cannot configure after start');

    await ctx.db.patch(lobbyId, { gameId, difficulty, duration });
  },
});

export const startGame = mutation({
  args: { lobbyId: v.id('lobbies'), clientId: v.string() },
  handler: async (ctx, { lobbyId, clientId }) => {
    const lobby = await ctx.db.get(lobbyId);
    if (!lobby) throw new Error('Lobby not found');
    if (lobby.hostClientId !== clientId) throw new Error('Only host can start');
    if (lobby.status !== 'waiting') throw new Error('Game already started');
    if (!lobby.gameId) throw new Error('No game selected');

    const players = await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobbyId))
      .take(MAX_PLAYERS);

    if (players.length < 2) throw new Error('Need at least 2 players');

    const countdownMs = 3000;
    const gameStartsAt = Date.now() + countdownMs;

    await ctx.db.patch(lobbyId, {
      status: 'countdown' as const,
      gameStartsAt,
    });

    // Schedule game end as server-side backstop
    await ctx.scheduler.runAfter(
      countdownMs + lobby.duration * 1000 + 2000, // +2s grace
      internal.lobbies.endGame,
      { lobbyId },
    );
  },
});

export const markPlaying = mutation({
  args: { lobbyId: v.id('lobbies') },
  handler: async (ctx, { lobbyId }) => {
    const lobby = await ctx.db.get(lobbyId);
    if (!lobby) return;
    if (lobby.status === 'countdown') {
      await ctx.db.patch(lobbyId, { status: 'playing' as const });
    }
  },
});

export const updateActivity = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    clientId: v.string(),
    score: v.number(),
    correctAnswers: v.number(),
    totalAnswers: v.number(),
    currentStreak: v.number(),
    bestStreak: v.number(),
  },
  handler: async (ctx, { lobbyId, clientId, ...stats }) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_lobbyId_and_clientId', (q) =>
        q.eq('lobbyId', lobbyId).eq('clientId', clientId),
      )
      .unique();

    if (!player) return;

    await ctx.db.patch(player._id, {
      ...stats,
      lastActivityAt: Date.now(),
    });
  },
});

export const playerFinished = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    clientId: v.string(),
    score: v.number(),
    correctAnswers: v.number(),
    totalAnswers: v.number(),
    bestStreak: v.number(),
  },
  handler: async (ctx, { lobbyId, clientId, ...finalStats }) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_lobbyId_and_clientId', (q) =>
        q.eq('lobbyId', lobbyId).eq('clientId', clientId),
      )
      .unique();

    if (!player) return;

    await ctx.db.patch(player._id, {
      ...finalStats,
      finished: true,
      lastActivityAt: Date.now(),
    });

    // Check if all players finished
    const allPlayers = await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobbyId))
      .take(MAX_PLAYERS);

    const allFinished = allPlayers.every(
      (p) => p._id === player._id ? true : p.finished,
    );

    if (allFinished) {
      await ctx.db.patch(lobbyId, { status: 'finished' as const });
    }
  },
});

export const leaveLobby = mutation({
  args: { lobbyId: v.id('lobbies'), clientId: v.string() },
  handler: async (ctx, { lobbyId, clientId }) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_lobbyId_and_clientId', (q) =>
        q.eq('lobbyId', lobbyId).eq('clientId', clientId),
      )
      .unique();

    if (!player) return;

    await ctx.db.delete(player._id);

    const remaining = await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobbyId))
      .take(MAX_PLAYERS);

    if (remaining.length === 0) {
      await ctx.db.delete(lobbyId);
      return;
    }

    // If host left, promote the first remaining player
    if (player.isHost) {
      await ctx.db.patch(remaining[0]._id, { isHost: true });
      await ctx.db.patch(lobbyId, { hostClientId: remaining[0].clientId });
    }
  },
});

export const kickPlayer = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    hostClientId: v.string(),
    targetClientId: v.string(),
  },
  handler: async (ctx, { lobbyId, hostClientId, targetClientId }) => {
    const lobby = await ctx.db.get(lobbyId);
    if (!lobby) throw new Error('Lobby not found');
    if (lobby.hostClientId !== hostClientId) throw new Error('Only host can kick');

    const target = await ctx.db
      .query('players')
      .withIndex('by_lobbyId_and_clientId', (q) =>
        q.eq('lobbyId', lobbyId).eq('clientId', targetClientId),
      )
      .unique();

    if (target) {
      await ctx.db.delete(target._id);
    }
  },
});

export const playAgain = mutation({
  args: { lobbyId: v.id('lobbies'), clientId: v.string() },
  handler: async (ctx, { lobbyId, clientId }) => {
    const lobby = await ctx.db.get(lobbyId);
    if (!lobby) throw new Error('Lobby not found');
    if (lobby.hostClientId !== clientId) throw new Error('Only host can restart');

    // Reset lobby — use replace to clear optional fields
    await ctx.db.replace(lobbyId, {
      code: lobby.code,
      status: 'waiting',
      hostClientId: lobby.hostClientId,
      gameId: lobby.gameId,
      difficulty: lobby.difficulty,
      duration: lobby.duration,
      createdAt: lobby.createdAt,
    });

    // Reset all player game fields
    const players = await ctx.db
      .query('players')
      .withIndex('by_lobbyId', (q) => q.eq('lobbyId', lobbyId))
      .take(MAX_PLAYERS);

    for (const player of players) {
      await ctx.db.patch(player._id, {
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActivityAt: 0,
        finished: false,
      });
    }
  },
});

// ─── Internal (scheduled) ───

export const endGame = internalMutation({
  args: { lobbyId: v.id('lobbies') },
  handler: async (ctx, { lobbyId }) => {
    const lobby = await ctx.db.get(lobbyId);
    if (!lobby) return;
    if (lobby.status === 'playing' || lobby.status === 'countdown') {
      await ctx.db.patch(lobbyId, { status: 'finished' as const });
    }
  },
});
