# GastoTrack — Guía de instalación (v3)

## Archivos incluidos
- `index.html` — La app completa
- `manifest.json` — Configuración PWA
- `sw.js` — Service Worker (funciona sin internet)
- `INSTRUCCIONES.md` — Esta guía

---

## Paso 1: Crear tabla en Supabase

1. Ve a https://supabase.com → crea cuenta y proyecto gratis
2. Anota la **URL** y la **anon key** del proyecto
3. Ve a **SQL Editor** y ejecuta este SQL completo:

```sql
create table gastos (
  id            bigint primary key generated always as identity,
  concepto      text not null,
  descripcion   text default '',
  lugar         text default '',
  categoria     text not null,
  monto         numeric(10,2) not null,
  monto_pen     numeric(10,2),
  moneda        text default 'PEN',
  tc_usado      numeric(6,4),
  fecha         date not null,
  metodo        text default '',
  comprobante   text default '',
  secret_check  text,
  created_at    timestamptz default now()
);

-- Activar seguridad por filas
alter table gastos enable row level security;

create policy "Solo con clave secreta" on gastos
  for all
  using (secret_check = '2199')
  with check (secret_check = '2199');

create policy "Update con clave secreta" on gastos
  for update
  using (secret_check = '2199')
  with check (secret_check = '2199');

create policy "Delete con clave secreta" on gastos
  for delete
  using (secret_check = '2199');
```

**Si ya tienes la tabla creada**, solo ejecuta esto para agregar las columnas nuevas y la tabla de recurrentes:

```sql
alter table gastos add column if not exists monto_pen numeric(10,2);
alter table gastos add column if not exists tc_usado  numeric(6,4);
alter table gastos add column if not exists recurrente_id bigint;

create table if not exists recurrentes (
  id           bigint primary key generated always as identity,
  concepto     text not null,
  categoria    text not null,
  tipo         text default 'fijo',
  monto        numeric(10,2) not null,
  dia          int not null,
  metodo       text default 'Tarjeta',
  secret_check text,
  created_at   timestamptz default now()
);

alter table recurrentes enable row level security;

create policy "Solo con clave secreta rec" on recurrentes
  for all using (secret_check = '2199') with check (secret_check = '2199');

create policy "Update recurrentes" on recurrentes
  for update using (secret_check = '2199') with check (secret_check = '2199');

create policy "Delete recurrentes" on recurrentes
  for delete using (secret_check = '2199');
```

Esto significa: cualquiera que intente leer o escribir sin la clave `2199`
en cada fila recibirá un resultado vacío o un error. La app la manda
automáticamente — tú nunca la escribes.

---

## Paso 2: Subir la app a Netlify

1. Ve a https://netlify.com → crea cuenta gratis
2. Descomprime el ZIP
3. Arrastra la **carpeta** `gastotrack-pwa` al área de deploy
4. Copia la URL que te da Netlify

---

## Paso 3: Configurar la app

1. Abre la URL en Safari (iPhone) o Chrome (Android)
2. Toca el engranaje ⚙️ y configura:
   - **Supabase URL**: `https://xxx.supabase.co`
   - **Supabase Anon Key**: la clave pública
   - **Gemini API Key**: obtén una gratis en https://aistudio.google.com
   - **Presupuesto mensual**: tu monto en soles
   - **Tipo de cambio USD**: cuántos soles vale 1 dólar (ej: 3.70)

---

## Paso 4: Instalar en pantalla de inicio

**iPhone (Safari):**
Toca compartir 📤 → "Añadir a pantalla de inicio"

**Android (Chrome):**
Toca ⋮ → "Instalar app" o "Añadir a pantalla de inicio"

---

## Novedades v3

### Sin PIN de acceso
La app abre directo al dashboard. La seguridad está en Supabase —
nadie puede leer ni escribir tus datos sin la clave secreta interna.

### ✏️ Editar gastos
En el Historial cada gasto tiene un botón **Editar** que abre un panel
con todos los campos modificables.

### 🗑 Eliminar gastos
Botón **Eliminar** en cada gasto del historial, con confirmación.

### 📷 Cámara simplificada
Al registrar un gasto solo aparecen dos botones: **Cámara** y **Galería**.
Al subir una foto, Gemini analiza la imagen y autocompleta todos los campos.

### Orden del formulario optimizado
Categoría → Monto/Moneda → Fecha/Método de pago → Concepto → Lugar

---

## Seguridad de tus datos

La privacidad está garantizada del lado del servidor (Supabase).
Aunque alguien conozca tu URL y tu anon key, sin la clave secreta `2199`
interna no puede leer ni modificar ningún registro.
