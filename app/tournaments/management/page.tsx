import { updateTournamentStatuses } from '@/middleware/tournament-status'

export default async function TournamentManagementPage() {
  // Actualizar estados antes de obtener la lista
  await updateTournamentStatuses()

  // ... resto del código ...
} 