<div align="center">

<img src="./public/pacifico-logo-horizontal.svg" alt="Logotipo oficial de Pacífico POS" width="380" />

**Sistema web de punto de venta para gestionar ventas, inventario, usuarios y sucursales.**

🎓 **Proyecto Integrador · Equipo 5 · Universidad de Colima**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Base_de_datos-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

[📸 Capturas](#capturas) · [✨ Funciones](#funciones) · [👥 Roles](#roles) · [🚀 Instalación](#instalacion) · [📚 API](#api) · [🤝 Equipo](#equipo)

</div>

---

## 🌊 Acerca del proyecto

**Pacífico POS** reúne el punto de venta y la administración de un negocio con varias sucursales. El cajero puede buscar productos, cobrar y descargar el ticket. El personal autorizado puede consultar ventas, revisar existencias y administrar usuarios según su rol.

La interfaz está disponible en **español e inglés** e incluye **modo claro y oscuro**.

<a name="capturas"></a>

## 📸 Capturas del sistema

| 🔐 Inicio de sesión | 📝 Registro |
| :---: | :---: |
| ![Pantalla de inicio de sesión](https://github.com/user-attachments/assets/5df01788-e316-4e05-99ce-9b9fecd38b9a) | ![Formulario de registro](https://github.com/user-attachments/assets/a8f3ee2b-ab0f-4e92-89be-113509ddc74f) |

| 🛒 Ventas | 🧾 Historial de ventas |
| :---: | :---: |
| ![Catálogo y carrito del punto de venta](https://github.com/user-attachments/assets/3edd92d9-c433-4b00-a8e8-2ae5518b4fc8) | ![Pantalla de consulta de ventas](https://github.com/user-attachments/assets/333dbbf4-2d31-4c9e-a52e-19d4e5645b72) |

| 📦 Inventario | 📊 Panel de indicadores |
| :---: | :---: |
| ![Pantalla de inventario y existencias](https://github.com/user-attachments/assets/0da3088c-40d6-4662-8464-1c5c26218b7c) | ![Panel con métricas y gráficas de ventas](https://github.com/user-attachments/assets/c68e2ea5-e7d8-418a-8050-4e8739e76484) |

| 🧑‍💻 Usuarios | ⚙️ Ajustes de empresa |
| :---: | :---: |
| ![Pantalla de gestión de usuarios](https://github.com/user-attachments/assets/8e987763-9165-405e-936a-5d6e848386de) | ![Pantalla de ajustes de empresa](https://github.com/user-attachments/assets/ee8f9130-f654-4f07-a07b-5f75f097d6ea) |

<a name="funciones"></a>

## ✨ Funciones del sistema

| Módulo | Qué puedes hacer |
| :--- | :--- |
| 🔐 **Autenticación** | Iniciar sesión con correo y contraseña y solicitar la recuperación de la cuenta. |
| 🛒 **Punto de venta** | Buscar productos, revisar precios y existencias, editar cantidades y quitar productos del carrito. |
| 💳 **Cobro** | Consultar el subtotal, el IVA y el total, y registrar el pago en efectivo, con tarjeta o por transferencia. |
| 🧾 **Ventas y tickets** | Consultar ventas, revisar el detalle de cada operación y descargar su ticket en PDF. |
| 📦 **Inventario y catálogo** | Consultar existencias por sucursal y administrar productos y categorías según el rol. |
| 🏪 **Sucursales** | Crear, consultar y editar sucursales, y revisar el personal asignado. |
| 👤 **Usuarios** | Registrar gerentes y cajeros, consultar perfiles y editar o dar de baja cuentas según el rol. |
| 📊 **Panel de control** | Consultar indicadores de ventas y gráficas por sucursal y producto. |
| 🎨 **Preferencias** | Cambiar el idioma, alternar entre modo claro y oscuro y cerrar sesión desde el perfil. |

### 🛍️ Cómo se registra una venta

1. Entra a **Vender** y agrega los productos al carrito.
2. Ajusta las cantidades y revisa el **subtotal**, el **IVA** y el **total**.
3. Pulsa **Confirmar orden** y selecciona el método de pago.
4. Pulsa **Confirmar venta**. El sistema registra la operación, actualiza el inventario, inicia la descarga del ticket en PDF y deja el carrito listo para la siguiente venta.

<a name="roles"></a>

## 👥 Roles de usuario

| ID | Rol | Acceso principal |
| :---: | :--- | :--- |
| `1` | 🛠️ **Administrador** | Administra usuarios y sucursales de su empresa. Puede consultar el panel, las ventas, el inventario y la configuración. |
| `2` | 🏪 **Gerente** | Gestiona a los cajeros de su sucursal y puede consultar ventas, inventario y el punto de venta. |
| `3` | 🛒 **Cajero** | Entra directamente a `/sell` para buscar productos, registrar ventas y generar tickets. |

## 🧰 Tecnologías

| Tecnología | Uso en el proyecto |
| :--- | :--- |
| **Next.js 16 · React 19 · TypeScript** | Interfaz, navegación y rutas de la API. |
| **Tailwind CSS 4 · Framer Motion** | Estilos, temas y animaciones. |
| **Supabase Auth · PostgreSQL · `pg`** | Autenticación y almacenamiento de datos. |
| **TanStack Query · Zustand** | Consultas, caché y estado del carrito. |
| **Next Intl · Recharts** | Traducciones y gráficas del panel. |
| **Cloudinary · Resend · PDFKit** | Imágenes, envío de correos y generación de tickets. |
| **Swagger UI · Postman** | Documentación y pruebas de las rutas de la API. |

<a name="instalacion"></a>

## 🚀 Instalación

Necesitas **Node.js 22 o superior**, **npm** y un proyecto de **Supabase** con acceso a PostgreSQL.

```bash
git clone https://github.com/Gasdcoder07/pacifico-PI.git
cd pacifico-PI
npm ci
```

### 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto y reemplaza los valores de ejemplo por los de tus servicios.

```env
DATABASE_URL=postgresql://usuario:contrasena@host:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_anon
SUPABASE_SERVICE_ROLE_KEY=tu_clave_privada_de_servicio

# Cloudinary · Carga de imágenes
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key

# Resend · Envío de correos
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM_EMAIL=correo@tu-dominio-verificado.com
```
```

Mantén `.env` fuera de Git y guarda las claves privadas únicamente en el servidor. El carrito muestra IVA del **16 %** y el servidor usa ese mismo valor por defecto.

### ▶️ Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) o busca como "pacificopos.com" en tu navegador.

| Comando | Función |
| :--- | :--- |
| `npm run dev` | Inicia el entorno de desarrollo. |
| `npm run build` | Compila la aplicación para producción. |
| `npm run start` | Ejecuta la compilación de producción. |
| `npm run lint` | Revisa el código con ESLint. |

<a name="api"></a>

## 📚 Documentación de la API

Con el proyecto en ejecución, puedes abrir [Swagger UI](http://localhost:3000/api/api-docs) o consultar la [especificación OpenAPI](http://localhost:3000/api/swagger). Las rutas que requieren sesión reciben el encabezado `Authorization: Bearer <token>`.

| Método | Ruta | Función |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Iniciar sesión. |
| `POST` | `/api/auth/register/admin`, `/api/auth/register/manager`, `/api/auth/register/cashier` | Registrar usuarios por rol. |
| `POST` | `/api/auth/forgot-password`, `/api/auth/verify-recovery` | Solicitar y verificar la recuperación de la cuenta. |
| `GET` | `/api/dashboard` | Consultar los datos del panel. |
| `GET`, `POST` | `/api/ventas` | Listar y registrar ventas. |
| `GET` | `/api/ventas/{id}` | Consultar el detalle de una venta. |
| `GET` | `/api/ventas/{id}/ticket` | Obtener el ticket en PDF. |
| `GET`, `POST` | `/api/inventory` | Consultar y registrar información de inventario. |
| `GET` | `/api/inventory/{id}` | Consultar el inventario de una sucursal. |
| `GET` | `/api/products/{input}` | Buscar productos. |
| `POST`, `PUT`, `DELETE` | `/api/products` | Crear, editar y eliminar productos. |
| `GET`, `POST`, `PUT` | `/api/category` | Listar, crear y editar categorías. |
| `GET`, `POST` | `/api/sucursales` | Listar y crear sucursales. |
| `GET`, `PUT`, `DELETE` | `/api/sucursales/{id}` | Consultar, editar y eliminar una sucursal. |
| `GET` | `/api/usuarios` | Listar usuarios según el rol. |
| `GET`, `PUT`, `DELETE` | `/api/usuarios/{id}` | Consultar, editar o dar de baja a un usuario. |

## 📁 Estructura del proyecto

| Ruta | Contenido |
| :--- | :--- |
| `app/(auth)/` | Pantallas de inicio de sesión, registro y recuperación de contraseña. |
| `app/(dashboard)/` | Punto de venta, historial, inventario, panel, sucursales, usuarios y configuración. |
| `app/api/` | Rutas del servidor y documentación Swagger. |
| `features/` | Componentes, servicios y tipos organizados por módulo. |
| `shared/` | Componentes reutilizables, conexiones y utilidades. |
| `i18n/` y `messages/` | Configuración de idioma y traducciones. |
| `public/` | Logotipos, imágenes y aviso de privacidad. |
| `postman/` | Archivos de apoyo para trabajar con la API. |
| `proxy.ts` | Control de acceso y redirecciones. |
| `respaldo.sql` | Referencia del esquema de PostgreSQL. |

<a name="equipo"></a>

## 🤝 Equipo de trabajo

| Integrante | Correo institucional | GitHub |
| :--- | :--- | :--- |
| Valentin Vaca Cipres | `vvaca2@ucol.mx` | [@valent-x7](https://github.com/valent-x7) |
| Brian Sebastián Silvestre | `bsebastian0@ucol.mx` | [@BSebastian-IS](https://github.com/BSebastian-IS) |
| Greco Alejandro Serna Diaz | `gserna@ucol.mx` | [@Gasdcoder07](https://github.com/Gasdcoder07) |
| Nelvin Antonio Frías Rodríguez | `nfrias0@ucol.mx` | [@nelvinfrias](https://github.com/nelvinfrias) |
| Manuel Isahit Martínez Contreras | `mmartinez134@ucol.mx` | [@IsahitMartinez](https://github.com/IsahitMartinez) |
| Angel Emanuel Arres Naranjo | `aarres@ucol.mx` | [@4NGEL3MANUEL](https://github.com/4NGEL3MANUEL) |

## 🎓 Proyecto académico

Desarrollado por el **Equipo 5** de Ingeniería en Software de la **Facultad de Ingeniería Electromecánica**, Universidad de Colima, campus El Naranjo, Manzanillo, Colima.

📄 [Consultar el aviso de privacidad de Pacífico POS](./public/AVISOS_DE_PRIVACIDAD_PACIFICO.pdf)
