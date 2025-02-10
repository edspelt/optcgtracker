import { User as PrismaUser, TournamentStatus as PrismaTournamentStatus, TournamentDuration as PrismaTournamentDuration } from "@prisma/client"

// Extender el tipo User de Prisma
export interface User extends PrismaUser {
  preferredLeader?: string;  // Hacemos la propiedad opcional
}

export interface MatchWithPlayers {
  player1: User;
  player2: User;
  tournament: {
    id: string;
    name: string;
    // ... otros campos
  } | null | undefined;
  // ... otros campos
}

export interface TournamentWithDetails {
  id: string;
  name: string;
  status: PrismaTournamentStatus;
  startDate: Date;
  endDate: Date;
  duration: PrismaTournamentDuration;
  description: string | null;
  maxPlayers: number | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    participants: number;
    matches: number;
  };
  participants: User[];
  createdBy: {
    name: string | null;
  };
}

export type MatchResult = 'WIN' | 'LOSS';

export interface MatchDetails {
  opponentId: string;
  result: MatchResult;
  tournamentId?: string;
  player1Leader?: string;  // Agregamos este campo también
  player2Leader?: string;  // Y este si es necesario
} 