import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  lobbies: defineTable({
    code: v.string(),
    status: v.union(
      v.literal('waiting'),
      v.literal('countdown'),
      v.literal('playing'),
      v.literal('finished'),
    ),
    hostClientId: v.string(),
    gameId: v.optional(v.string()),
    difficulty: v.number(),
    duration: v.number(),
    gameStartsAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_code', ['code']),

  players: defineTable({
    lobbyId: v.id('lobbies'),
    clientId: v.string(),
    name: v.string(),
    isHost: v.boolean(),
    connected: v.boolean(),
    score: v.number(),
    correctAnswers: v.number(),
    totalAnswers: v.number(),
    currentStreak: v.number(),
    bestStreak: v.number(),
    lastActivityAt: v.number(),
    finished: v.boolean(),
  })
    .index('by_lobbyId', ['lobbyId'])
    .index('by_clientId', ['clientId'])
    .index('by_lobbyId_and_clientId', ['lobbyId', 'clientId']),
});
