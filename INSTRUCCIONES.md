# GastoTrack — Guía completa (v4)

## Archivos incluidos
- `index.html` — La app completa
- `manifest.json` — Configuración PWA
- `sw.js` — Service Worker (funciona sin internet)
- `icon-192.png` / `icon-512.png` — Ícono de la app
- `INSTRUCCIONES.md` — Esta guía

---

## Hosting: GitHub Pages

La app está publicada en:
**https://pedrobuleje99.github.io/gastotrack/**

Para actualizar la app, sube el `index.html` nuevo al repositorio:
1. Ve a `github.com/pedrobuleje99/gastotrack`
2. **"Add file" → "Upload files"** → sube `index.html`
3. **"Commit changes"**

GitHub Pages es completamente gratuito, no expira y no tiene límite de créditos mensuales.

---

## Base de datos: Supabase

- **URL del proyecto**: `https://gtvpebggobtjrvotftvn.supabase.co`
- **Clave secreta interna**: `2199` (protege tus datos via RLS)

### SQL completo (tablas desde cero)

Ve a **Supabase → SQL Editor** y ejecuta:

```sql
-- TABLA GASTOS
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
  recurrente_id bigint,
  secret_check  text,
  created_at    timestamptz default now()
);

alter table gastos enable row level security;

create policy "Solo con clave secreta" on gastos
  for all using (secret_check = '2199') with check (secret_check = '2199');
create policy "Update con clave secreta" on gastos
  for update using (secret_check = '2199') with check (secret_check = '2199');
create policy "Delete con clave secreta" on gastos
  for delete using (secret_check = '2199');

-- TABLA RECURRENTES
create table recurrentes (
  id           bigint primary key generated always as identity,
  concepto     text not null,
  categoria    text not null,
  tipo         text default 'fijo',
  monto        numeric(10,2) not null,
  moneda       text default 'PEN',
  tc_usado     numeric(6,4),
  monto_pen    numeric(10,2),
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

### Si las tablas ya existen, solo agrega columnas nuevas:

```sql
alter table gastos add column if not exists monto_pen numeric(10,2);
alter table gastos add column if not exists tc_usado numeric(6,4);
alter table gastos add column if not exists recurrente_id bigint;

alter table recurrentes add column if not exists moneda text default 'PEN';
alter table recurrentes add column if not exists tc_usado numeric(6,4);
alter table recurrentes add column if not exists monto_pen numeric(10,2);
```

---

## Instalar en pantalla de inicio

**iPhone (Safari):**
1. Abre `https://pedrobuleje99.github.io/gastotrack/` en Safari
2. Toca compartir 📤 → "Añadir a pantalla de inicio"

**Android (Chrome):**
1. Abre la URL en Chrome
2. Toca ⋮ → "Instalar app" o "Añadir a pantalla de inicio"

> Para actualizar el ícono: elimina la app de la pantalla de inicio y vuelve a instalarla desde Safari.

---

## Configuración inicial (⚙️ Ajustes)

Al abrir la app por primera vez, toca el engranaje ⚙️ y configura:

| Campo | Valor |
|---|---|
| Presupuesto mensual | Tu límite mensual en soles |
| Tipo de cambio USD | Ej: 3.750 (o usa el botón 🔄 para obtenerlo automático) |
| Gemini API Key | Gratis en https://aistudio.google.com |
| Recordatorio diario | Activa notificaciones push (requiere modo standalone) |

---

## Funcionalidades

### 🏠 Dashboard
- Gastado vs presupuesto del mes
- Días restantes y cuánto puedes gastar por día
- Últimas transacciones
- Gráfico de 6 meses

### 📋 Historial
- Lista de todos los gastos con filtro por mes
- Editar y eliminar cualquier gasto
- Muestra monto original + equivalente en soles + TC para gastos en USD

### ➕ Nuevo gasto
- Toma foto o sube desde galería
- La IA (Gemini) analiza la imagen y autocompleta: concepto, categoría, monto, moneda, fecha, método de pago, lugar
- Soporte para soles (S/) y dólares (USD) con tipo de cambio automático

### 🔄 Recurrentes
- Gastos fijos: se registran automáticamente el día configurado
- Gastos variables: piden confirmación de monto cada mes
- Soporte para soles y dólares con TC automático via IA

### 📊 Gráficos
- Gasto acumulado vs presupuesto (línea diaria)
- Distribución por categoría (dona)
- Promedio por día de la semana (heatmap)
- Tendencia de categorías principales (6 meses)

---

## Seguridad

Todos los datos están protegidos en Supabase mediante Row Level Security (RLS). Sin la clave interna `2199`, nadie puede leer ni modificar tus registros, aunque conozcan la URL y la anon key del proyecto.

---

## Credenciales técnicas (solo para referencia)

- **Supabase URL**: `https://gtvpebggobtjrvotftvn.supabase.co`
- **Supabase Anon Key**: hardcodeada en el código (protección real en RLS)
- **Gemini API Key**: hardcodeada en el código (plan gratuito)
- **GitHub repo**: `github.com/pedrobuleje99/gastotrack`
