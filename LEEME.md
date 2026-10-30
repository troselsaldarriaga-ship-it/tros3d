# Tienda tros3d — guía (todo gratis)

## 1. Base de datos (Supabase)
1. Entra a https://supabase.com, crea cuenta y un proyecto nuevo (plan Free).
2. Menú **SQL Editor** → pega todo el contenido de `setup.sql` → **Run**.
3. Menú **Authentication → Users → Add user**: pon TU correo y una contraseña (marca "Auto confirm"). Es tu acceso al panel.
4. **Authentication → Sign In / Providers → Email**: desactiva "Allow new users to sign up" (así nadie más puede crear cuentas).
5. **Project Settings → API**: copia *Project URL* y la clave *anon public*. Pégalas en `config.js`.

## 2. Publicar en GitHub Pages
1. Crea cuenta en https://github.com y un repositorio público nuevo (ej. `tros3d`).
2. **Add file → Upload files**: sube TODOS los archivos de esta carpeta (no el .zip) → Commit.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / root → Save.
4. En 1-2 minutos tu tienda queda en `https://TU-USUARIO.github.io/tros3d/`

## 3. Usar el panel
Entra a `https://TU-USUARIO.github.io/tros3d/admin.html`, inicia sesión y sube productos (nombre, precio, descuento, categoría, descripción, fotos). Se guardan en Supabase y se ven al instante en la tienda.
