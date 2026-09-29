<div align="center">

# 🌊 Pacífico POS

**Sistema web de punto de venta para administrar ventas, inventario, usuarios y sucursales.**

`Equipo 5️⃣` · Universidad de Colima

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql&logoColor=white)

</div>

---

## 📑 Contenido

- [Vista previa](#-vista-previa)
- [Descripción](#-descripción)
- [Funciones del sistema](#-funciones-del-sistema)
- [Roles de usuario](#-roles-de-usuario)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Ejecución](#-ejecución)
- [Documentación de la API](#-documentación-de-la-api)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Próximas mejoras](#-próximas-mejoras)
- [Equipo de trabajo](#-equipo-de-trabajo)
- [Licencia y uso](#-licencia-y-uso)

---

## 📷 Vista previa

<img width="1543" height="749" alt="Captura de pantalla 2026-09-05 162753" src="https://github.com/user-attachments/assets/4d9e5736-3e5b-4232-840d-8853c990df05" />

---

## 📖 Descripción

**Pacífico POS** es un sistema de punto de venta pensado para mejorar la organización y el control de un negocio que vende productos.

Reúne en un solo lugar los procesos más importantes: **ventas, productos, inventario, usuarios y sucursales**, para consultar la información con claridad y facilitar el trabajo diario del personal.

La interfaz es moderna y adaptable, por lo que puede usarse desde computadora, tableta o teléfono.

---

## ✨ Funciones del sistema

| Módulo | Función | Estado |
|:---|:---|:---:|
| 🔐 Autenticación | Inicio de sesión y registro con Supabase Auth. Rutas privadas protegidas por sesión. | 🟡 En proceso |
| 👤 Usuarios | Listado, edición y baja de usuarios, con roles y sucursal asignada. | 🟡 En proceso |
| 🛒 Punto de venta | Catálogo de productos con búsqueda y carrito de compra. Métodos de pago: efectivo, tarjeta y transferencia. | 🟡 En proceso |
| 💰 Ventas | Consulta y control de las ventas realizadas. | 🟡 En proceso |
| 📦 Inventario | Consulta de productos y existencias por sucursal. | 🟡 En proceso |
| 📊 Panel principal | Métricas y gráficas de ventas (por ahora con datos de ejemplo). | 🟡 En proceso |
| 🏪 Sucursales | Consulta y organización de la información por establecimiento. | 🟡 En proceso |
| 📖 Documentación API | Documentación interactiva con Swagger UI. | 🟢 Disponible |
| 📱 Diseño adaptable | Interfaz responsiva para computadora, tableta y teléfono. | 🟢 Disponible |

---

## 👥 Roles de usuario

| ID | Rol | Alcance |
|:---:|:---|:---|
| 1 | **Administrador** | Acceso completo; gestiona usuarios de todas las sucursales. |
| 2 | **Gerente** | Gestiona a los cajeros de su propia sucursal. |
| 3 | **Cajero** | Acceso únicamente al punto de venta (`/sell`). |

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|:---|:---|
| [Next.js 16](https://nextjs.org/) | Páginas, rutas y servicios (API Routes) del sistema. |
| [React 19](https://react.dev/) | Interfaz y componentes. |
| [TypeScript](https://www.typescriptlang.org/) | Organización y validación del código. |
| [Tailwind CSS 4](https://tailwindcss.com/) | Diseño visual y adaptación a diferentes pantallas. |
| [Supabase](https://supabase.com/) | Autenticación de usuarios. |
| [PostgreSQL](https://www.postgresql.org/) | Almacenamiento de la información (vía `pg`). |
| [Framer Motion](https://www.framer.com/motion/) | Animaciones y transiciones. |
| [Zustand](https://zustand-demo.pmnd.rs/) | Estado del carrito de compra. |
| [TanStack Query](https://tanstack.com/query) | Manejo de peticiones y caché. |
| [Recharts](https://recharts.org/) | Gráficas del panel principal. |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Documentación interactiva de la API. |

---

## 🚀 Instalación

**Requisitos:** [Node.js](https://nodejs.org/) 20 o superior, `npm` y un proyecto de [Supabase](https://supabase.com/) con su base de datos PostgreSQL.

1️⃣ Clona el repositorio:

```bash
git clone URL-DE-TU-REPOSITORIO
```

2️⃣ Entra a la carpeta del proyecto:

```bash
cd pacifico-PI
```

3️⃣ Abre el proyecto en Visual Studio Code:

```bash
code .
```

4️⃣ Instala las dependencias:

```bash
npm install
```

---

## 🔑 Variables de entorno

Crea un archivo llamado `.env.local` en la carpeta principal del proyecto:

```env
DATABASE_URL=tu_cadena_de_conexion_postgresql
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_de_supabase
```

| Variable | Descripción |
|:---|:---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio, usada solo en el servidor para crear usuarios. |


---

## ▶️ Ejecución

🟢 Inicia el servidor de desarrollo:

```bash
npm run dev
```

🟡 Después abre en tu navegador: [http://localhost:3000](http://localhost:3000)

🔴 Para detener el servidor, presiona `Ctrl + C` en la terminal.

**Otros comandos útiles**

| Comando | Descripción |
|:---|:---|
| `npm run build` | Genera la versión de producción. |
| `npm run start` | Inicia la versión de producción (requiere `build` previo). |
| `npm run lint` | Revisa el código con ESLint. |

---

## 📚 Documentación de la API

Las rutas protegidas esperan un token de sesión en el encabezado `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|:---:|:---|:---|
| `POST` | `/api/auth/login` | Inicia sesión y devuelve la sesión y el perfil del usuario. |
| `POST` | `/api/auth/register/admin` | Registra un administrador. |
| `POST` | `/api/auth/register/manager` | Registra un gerente. |
| `POST` | `/api/auth/register/cashier` | Registra un cajero. |
| `GET` | `/api/usuarios` | Lista usuarios según el rol de quien consulta. |
| `GET` `PUT` `DELETE` | `/api/usuarios/{id}` | Consulta, edita o da de baja a un usuario. |
| `GET` | `/api/sucursales` | Lista las sucursales. |
| `GET` | `/api/sucursales/{id}` | Consulta una sucursal. |
| `GET` | `/api/inventory` | Inventario agrupado por sucursal. |
| `GET` | `/api/inventory/{id}` | Inventario de una sucursal. |
| `GET` | `/api/categorias` | Lista las categorías de productos. |

---

## 📁 Estructura del proyecto

```
pacifico-PI/
├── app/
│   ├── (auth)/          # Inicio de sesión y registro
│   ├── (dashboard)/     # Dashboard, ventas (/sell), inventario, sucursales y usuarios
│   ├── api/             # API Routes: auth, usuarios, sucursales, inventory, categorias, swagger
│   ├── sales/           # Tipos relacionados con ventas (métodos de pago)
│   ├── fonts/           # Tipografía Inter
│   └── page.tsx         # Página principal
├── features/            # Módulos por funcionalidad (componentes, servicios, tipos)
│   ├── auth/
│   ├── branches/
│   ├── dashboard/
│   ├── inventory/
│   ├── sell/            # Catálogo, carrito y store de Zustand
│   └── users/
├── shared/              # Código compartido
│   ├── components/      # Sidebar, Navbar, modales, selects, etc.
│   ├── config/          # Navegación y notificaciones
│   ├── lib/             # Conexiones a Supabase, PostgreSQL, Axios y Swagger
│   ├── types/           # Tipos globales (variables de entorno)
│   └── utils/           # Utilidades y formateadores
├── public/              # Imágenes, logotipos y archivos públicos
├── proxy.ts             # Protección de rutas según sesión y rol
├── package.json         # Dependencias y comandos
└── README.md            # Documentación del proyecto
```

---

## 🧭 Próximas mejoras

- [ ] Completar el proceso de cobro en el punto de venta.
- [ ] Registrar y consultar las ventas.
- [ ] Agregar, editar y eliminar productos.
- [ ] Controlar entradas y salidas del inventario.
- [ ] Conectar el panel principal con datos reales.
- [ ] Generar cortes de caja.
- [ ] Completar la administración de usuarios, roles y permisos.
- [ ] Sincronizar la información entre sucursales.

---

## 👨‍💻 Equipo de trabajo

| Integrante | Contacto |
|:---|:---|
| Valentin Vaca Cipres | vvaca2@ucol.mx |
| Brian Sebastián Silvestre | bsebastian0@ucol.mx |
| Greco Alejandro Serna Diaz | gserna@ucol.mx |
| Nelvin Antonio Frías Rodríguez | nfrias0@ucol.mx |
| Manuel Isahit Martínez Contreras | mmartinez134@ucol.mx |
| Angel Emanuel Arres Naranjo | aarres@ucol.mx |

---

## 📄 Licencia y uso

Este proyecto fue creado con fines **académicos y educativos** en la **Universidad de Colima**, Facultad de Ingeniería Electromecánica, carrera de Ingeniería en Software, campus El Naranjo, Manzanillo, Colima.
