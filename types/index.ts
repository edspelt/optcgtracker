import { User as PrismaUser, TournamentStatus as PrismaTournamentStatus, TournamentDuration as PrismaTournamentDuration, Tournament, TournamentParticipant, ParticipantStatus } from "@prisma/client"

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

export type TournamentWithDetails = Tournament & {
  participants: {
    id: string
    userId: string
    status: ParticipantStatus
  }[]
  createdBy: {
    id: string
    name: string | null
  }
  _count: {
    participants: number
  }
}

export type MatchResult = 'WIN' | 'LOSS';

export interface MatchDetails {
  opponentId: string;
  result: MatchResult;
  tournamentId?: string;
  player1Leader?: string;  // Agregamos este campo también
  player2Leader?: string;  // Y este si es necesario
} 