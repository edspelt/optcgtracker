import { Metadata } from 'next'
import HomeClient from "@/components/home/HomeClient"

export const metadata: Metadata = {
  title: 'OP TCG Tracker - Inicio',
  description: 'Gestiona tus partidas de One Piece TCG, participa en torneos y sigue tu progreso.',
}

export default function Home() {
  return (
    <main className="flex-1">
      <HomeClient />
    </main>
  )
}
