## 🌊 Pacífico --- Equipo 5️⃣
Sistema web para la administración de ventas, inventario, usuarios y sucursales.

## 📑 Contenido
- [Vista Previa📷](#-vista-previa)
- [Descripción🧾](#-descripción)
- [Funciones⚙️](#-funciones)
- [Tecnologías Utilizada💻](#-tecnologías-utilizadas)
- [Instalación🛠](#-instalación)
- [Variables de entorno🔑](#-variables-de-entorno)
- [Ejecución▶️ ](#-ejecución)
- [Estructura del Proyecto📁](#-estructura-del-proyecto)
- [Mejoras🧭](#-mejoras)


## 📖 Descripción
Pacífico POS es un sistema de punto de venta desarrollado para mejorar la organización y el control de un negocio para la ventas de productos.

La plataforma busca reunir en un solo lugar los procesos más importantes: ventas, productos, inventario, usuarios y sucursales. Esto permite consultar la información de manera más clara y facilita las actividades diarias del personal.

El proyecto utiliza una interfaz moderna y adaptable, por lo que puede visualizarse desde computadoras, tabletas y teléfonos para utilidad mas rapida y facil.


## ✨ Funciones del sistema
| Módulo | Función | Estado |
|:---|:---|:---:|
| 🔐 **Autenticación** | Registro e inicio de sesión de usuarios. | 🟡 En proceso |
| 👤 **Usuarios** | Asociación de usuarios con roles y sucursales. | 🟡 En proceso |
| 🛒 **Punto de venta** | Espacio destinado al registro y cobro de productos. | 🟡 En proceso |
| 💰 **Ventas** | Consulta y control de las ventas realizadas. | 🟡 En proceso |
| 📦 **Inventario** | Administración de productos y existencias. | 🟡 En proceso |
| 📊 **Panel principal** | Resumen general de la información del negocio. | 🟡 En proceso |
| 🏪 **Sucursales** | Organización de la información por establecimiento. | 🟡 En proceso |
| 📱 **Diseño adaptable** | Visualización en computadora local. | 🟢 Disponible |





## 🛠️ Tecnología
- Next.js 16:Creación de páginas, rutas y servicios del sistema.  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="55" title="Next.js">
- React 19:Desarrollo de la interfaz y sus componentes.   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="55" title="React">
- TypeScript:Organización y validación del código.    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="55" title="TypeScript">
- Tailwind CSS 4:Diseño visual y adaptación a diferentes pantallas.    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="55" title="Tailwind CSS">
- Supabase:Autenticación y conexión con la base de datos.    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" width="55" title="Supabase">
- PostgreSQL:Almacenamiento de la información.    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="55" title="PostgreSQL">
- Framer Motion:Animaciones y transiciones visuales.  <img src="https://cdn.simpleicons.org/framer/0055FF" alt="Framer Motion" width="45" height="45">


## 🚀 Instalación
- 1️⃣. Clona el repositorio: git clone URL-DE-TU-REPOSITORIO
- 2️⃣. Entra a la carpeta del proyecto: cd pacifico-PI
- 3️⃣. Abre el proyecto en Visual Studio Code: code .
- 4️⃣.  Instala las dependencias: npm install


## 🔑 Variables de entorno
Crea un archivo llamado .env.local en la carpeta principal del proyecto:
--------------------------------------------------------------------
-    DATABASE_URL=tu_cadena_de_conexion_postgresql                 -
-   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase                    -
-   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase     - 
-------------------------------------------------------------------

## ▶️ Ejecución
- 🟢 Inicia el servidor de desarrollo: npm run dev
- 🟡 Después abre la siguiente dirección: http://localhost:3000
- 🔴 Para detener el servidor, presiona Ctrl + C en la terminal.

## 📁 Estructura del proyecto
pacifico-PI/

|── app/

|   |── (auth)/              # Inicio de sesión y registro

|   |── (dashboard)/         # Panel principal y punto de venta

|   |── api/auth/            # Servicios de autenticación

|   └── page.tsx             # Página principal

|── components/              # Componentes reutilizables

|── config/                  # Configuración de navegación

|── hooks/                   # Hooks personalizados

|── lib/                     # Conexiones con Supabase y PostgreSQL

|── public/                  # Imágenes, logotipos y archivos públicos

|── types/                   # Tipos e interfaces de TypeScript

|── package.json             # Dependencias y comandos

└── README.md                # Documentación del proyecto


## 🧭 Próximas mejoras
- ⏳ Terminar la conexión de los formularios de acceso y registro.
- ⏳ Proteger las rutas privadas del sistema.
- ⏳ Completar el proceso de cobro en el punto de venta.
- ⏳ Registrar y consultar las ventas.
- ⏳ Agregar, editar y eliminar productos.
- ⏳ Controlar entradas y salidas del inventario.
- ⏳ Generar cortes de caja.
- ⏳ Mostrar estadísticas en el panel principal.
- ⏳ Administrar usuarios, roles y permisos.
- ⏳ Sincronizar la información entre sucursales.


## 👥 Equipo de trabajo
- Valentin Vaca Cipres
- Brian Sebastián Silvestre
- Greco Alejandro Serna Diaz
- Nelvin Antonio Frías Rodríguez
- Manuel Isahit Martínez Contreras
- Angel Emanuel Arres Naranjo

## 📬 Contacto
- 📧 aarres@ucol.mx
- 📧 nfrias0@ucol.mx
- 📧 mmartinez134@ucol.mx
- 📧 bsebastian0@ucol.mx
- 📧 gserna@ucol.mx
- 📧 vvaca2@ucol.mx

## 📄 Licencia y uso
- Este proyecto fue creado con fines académicos y educativos en la Universidad de Colima, en la facultad de ingeniería electromecánica, en la carrera de ingeniería en software campus El Naranjo en Manzanillo, Colima.
