# OP TCG Tracker

Una aplicación web para gestionar partidas y torneos de One Piece TCG.

## 🌟 Características

- 🎮 Registro de partidas
- 🏆 Gestión de torneos
- 📊 Estadísticas detalladas
- 👥 Sistema de roles (Usuario, Juez, Admin)
- 🌓 Modo oscuro/claro
- 📱 Diseño responsive

## 🛠️ Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Prisma (ORM)
- NextAuth.js
- Tailwind CSS
- PostgreSQL

## 🚀 Inicio Rápido

1. Clona el repositorio:

bash
git clone https://github.com/tu-usuario/op-tcg-tracker.git
cd op-tcg-tracker

2. Instala las dependencias:
npm install

3. Configura las variables de entorno:

bash
cp .env.example .env

4. Inic4. Configura la base de datos:ia el servidor:

bash
npx prisma migrate dev

5. Inicia el servidor:

bash
npm run dev


## 📝 Variables de Entorno

env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="tu-secreto"
NEXTAUTH_URL="http://localhost:3000"



## 👥 Roles de Usuario

- **Usuario**: Registrar partidas y participar en torneos
- **Juez**: Gestionar torneos y aprobar resultados
- **Admin**: Gestión completa del sistema

## 📱 Rutas Principales

- `/dashboard` - Panel principal
- `/matches` - Gestión de partidas
- `/tournaments` - Lista de torneos
- `/tournaments/manage` - Gestión de torneos (Jueces/Admin)
- `/matches/pending` - Aprobación de partidas (Jueces/Admin)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
