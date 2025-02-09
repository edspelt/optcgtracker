-- Primero creamos el nuevo tipo de enum
CREATE TYPE "Role_new" AS ENUM ('PLAYER', 'JUDGE', 'ADMIN');

-- Actualizamos los usuarios existentes
UPDATE "User" SET role = 'PLAYER' WHERE role = 'USER';

-- Convertimos la columna al nuevo tipo
ALTER TABLE "User" 
  ALTER COLUMN role TYPE "Role_new" 
  USING (
    CASE role::text
      WHEN 'USER' THEN 'PLAYER'
      ELSE role::text
    END
  )::"Role_new";

-- Eliminamos el viejo tipo
DROP TYPE "Role";

-- Renombramos el nuevo tipo al nombre original
ALTER TYPE "Role_new" RENAME TO "Role"; 