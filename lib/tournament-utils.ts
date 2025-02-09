import { Tournament, TournamentStatus } from '@prisma/client'

export function isTournamentActive(tournament: Tournament): boolean {
  const now = new Date()
  return (
    tournament.status === 'ONGOING' &&
    now >= tournament.startDate &&
    now <= tournament.endDate
  )
}

export function getTournamentStatus(tournament: Tournament): TournamentStatus {
  const now = new Date()
  
  if (now < tournament.startDate) {
    return 'UPCOMING'
  }
  
  if (now > tournament.endDate) {
    return 'COMPLETED'
  }
  
  return tournament.status
}

export function formatTournamentDuration(tournament: Tournament): string {
  const start = new Date(tournament.startDate)
  const end = new Date(tournament.endDate)
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

export function getRemainingDays(tournament: Tournament): number {
  const now = new Date()
  const end = new Date(tournament.endDate)
  const diffTime = Math.abs(end.getTime() - now.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
} 