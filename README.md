# Gestor de Tareas y Proyectos – Frontend

## 1. Descripción del proyecto

**Gestor** es una aplicación web diseñada para facilitar la planificación, organización y seguimiento de proyectos y tareas dentro de un equipo de trabajo.

La plataforma permite administrar proyectos, asignar responsables, organizar actividades, consultar avances, establecer prioridades y supervisar el cumplimiento de objetivos mediante un Dashboard interactivo.

El Frontend corresponde a la primera entrega del proyecto y proporciona una interfaz moderna, intuitiva y funcional, con un diseño visual basado en un tema oscuro, combinaciones de negro y rojo, indicadores gráficos y componentes reutilizables.

Actualmente, la aplicación funciona con datos de demostración y operaciones simuladas, sin conexión a un servidor ni a una base de datos.

## 2. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Vue 3 | Framework principal para construir la interfaz. |
| JavaScript | Implementación de la lógica y funcionalidades. |
| Vue Router | Gestión de rutas y navegación entre páginas. |
| Vite | Servidor de desarrollo y herramienta de compilación. |
| CSS3 | Diseño visual, estilos, animaciones y adaptación de la interfaz. |

## 3. Funcionalidades implementadas

### Dashboard
- Indicadores generales de proyectos y tareas.
- Distribución de tareas según su estado.
- Visualización de proyectos recientes.
- Listado de próximas tareas.
- Actividad reciente del equipo.
- Indicador circular de cumplimiento de la meta mensual.
- Actualización dinámica de los indicadores.

### Gestión de proyectos
- Visualización de proyectos registrados.
- Creación y edición de proyectos.
- Consulta de detalles de cada proyecto.
- Asignación de integrantes y responsables.
- Clasificación por categorías, estados y prioridades.
- Seguimiento del progreso mediante indicadores porcentuales.
- Sincronización automática del estado del proyecto según sus tareas.

### Gestión de tareas
- Creación y edición de tareas.
- Asignación de responsables.
- Asociación de tareas con proyectos.
- Clasificación por prioridad y estado.
- Actualización del estado de las actividades.
- Consulta de detalles y fechas de entrega.
- Identificación de tareas vencidas.

### Búsquedas y filtros
- Búsqueda de proyectos y tareas.
- Filtrado por estado y prioridad.
- Filtrado por proyecto y responsable.
- Filtrado por fechas de entrega.
- Aplicación simultánea de varios filtros.
- Limpieza de filtros para recuperar los resultados completos.

### Perfiles y roles simulados

La aplicación cuenta con tres roles:

| Rol | Permisos principales |
|---|---|
| Administrador | Consulta y administración general de proyectos, tareas y equipo. |
| Líder de proyecto | Administración de sus proyectos, asignación de integrantes y supervisión de tareas. |
| Integrante del equipo | Consulta de sus proyectos y tareas asignadas, y actualización de sus estados. |

Se incluyen seis usuarios de demostración para comprobar el funcionamiento de los permisos y la visibilidad de la información.

### Validaciones y estados de interfaz
- Validación de formularios.
- Mensajes de éxito, advertencia y error.
- Ventanas de confirmación para acciones importantes.
- Indicadores visuales de carga.
- Estados vacíos cuando no existen registros.
- Manejo de accesos restringidos.
- Página de error 404.
- Control de acciones según los permisos del usuario.

## 4. Arquitectura y organización del proyecto

El Frontend utiliza una arquitectura modular basada en componentes y separación de responsabilidades. Cada carpeta agrupa elementos que cumplen funciones específicas, facilitando el mantenimiento, la reutilización y la ampliación de la aplicación.

### Estructura de carpetas

```text
gestor-tareas/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── ui/
│   │
│   ├── data/
│   │
│   ├── router/
│   │
│   ├── styles/
│   │
│   ├── views/
│   │
│   ├── App.vue
│   └── main.js
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

### Responsabilidad de cada carpeta

**components/**

Contiene los componentes reutilizables que conforman la interfaz. Se divide en:

- `dashboard/`: tarjetas de indicadores, distribución de tareas, actividad y proyectos recientes.
- `layout/`: menú lateral, barra superior y estructura general de navegación.
- `projects/`: tarjetas, formularios, estados y paneles de proyectos.
- `tasks/`: tarjetas, formularios y etiquetas de tareas.
- `ui/`: elementos generales como iconos, buscadores, notificaciones, confirmaciones e indicadores circulares.

**data/**

Contiene los datos de demostración y la lógica principal de funcionamiento:

- `projects.js`: información, creación, edición y validaciones de proyectos.
- `tasks.js`: información, creación, edición, asignaciones, estados y cálculos de tareas.
- `auth.js`: perfiles, roles, permisos y control de visibilidad.
- `dashboard.js`: cálculos de indicadores y estadísticas.
- `uiFeedback.js`: notificaciones y confirmaciones de acciones.

**router/**

Define las rutas de navegación de la aplicación y controla el acceso a las diferentes vistas según el perfil activo.

**styles/**

Centraliza los estilos visuales:

- `tokens.css`: colores, tipografías, espacios, bordes y variables del diseño.
- `global.css`: estilos generales y distribución de la interfaz.
- `effects.css`: efectos visuales, sombras, brillos y animaciones.

**views/**

Contiene las páginas completas de la aplicación:

- `DashboardView.vue`: panel principal.
- `ProjectsView.vue`: listado y gestión de proyectos.
- `ProjectDetailView.vue`: información detallada de cada proyecto.
- `TasksView.vue`: listado y gestión de tareas.
- `TaskDetailView.vue`: información detallada de cada tarea.
- `TeamView.vue`: integrantes del equipo.
- `ProfileView.vue`: perfil del usuario activo.
- `AccessDeniedView.vue`: pantalla de acceso restringido.
- `NotFoundView.vue`: página de error 404.
- `PlaceholderView.vue`: vista provisional para módulos pendientes de desarrollo.

**App.vue**

Es el componente raíz de la aplicación y conecta la estructura general de la interfaz.

**main.js**

Es el punto de entrada. Inicializa Vue, configura el enrutamiento y carga los estilos generales.

## 5. Reglas de funcionamiento

### Cálculo automático del progreso

El avance de cada proyecto se calcula a partir de sus tareas completadas:

`Progreso = (Tareas completadas / Total de tareas) × 100`

Ejemplos:

- Sin tareas: 0 %.
- Una de cuatro tareas completada: 25 %.
- Dos de cuatro tareas completadas: 50 %.
- Todas las tareas completadas: 100 %.

El resultado se refleja en las tarjetas de proyectos, el detalle del proyecto y los indicadores del Dashboard.

### Sincronización de estados

- Cuando todas las tareas están completadas, el proyecto pasa automáticamente a estado Completado.
- Cuando se reabre una tarea, el proyecto vuelve a En progreso.
- No se permite completar un proyecto sin tareas o con actividades pendientes.
- No se permite agregar nuevas tareas a proyectos completados.

### Validaciones de tareas

- Toda tarea debe estar asociada a un proyecto existente.
- El responsable debe pertenecer al equipo del proyecto.
- La fecha límite no puede ser anterior a la fecha de creación.
- La fecha límite debe estar dentro del periodo establecido para el proyecto.

### Control de visibilidad

Los proyectos, tareas, búsquedas, filtros e indicadores consideran el perfil activo. Cada usuario visualiza la información de acuerdo con su rol y sus asignaciones.

## 6. Instalación y ejecución

### Requisitos previos

- Node.js.
- npm.
- Visual Studio Code (recomendado).

### Pasos de instalación

**1.** Abrir una terminal en la carpeta raíz del proyecto.

**2.** Instalar las dependencias:

```bash
npm install
```

**3.** Iniciar el servidor de desarrollo:

```bash
npm run dev
```

**4.** Abrir en el navegador la dirección local proporcionada por Vite. Generalmente:

```text
http://localhost:5173/
```

### Otros comandos

```bash
# Compilar la aplicación para producción
npm run build

# Previsualizar la compilación
npm run preview
```

## 7. Alcance y limitaciones de la primera entrega

La primera entrega se concentra exclusivamente en el desarrollo del Frontend.

Actualmente:

- Los datos de proyectos, tareas y usuarios son de demostración.
- Las operaciones de creación, edición y actualización funcionan en memoria.
- Los cambios se restablecen al recargar la aplicación.
- Los roles y permisos son simulados en el navegador.
- No existe autenticación real.
- No se realizan solicitudes a una API REST.
- No existe conexión con PostgreSQL.

Estas características corresponden al alcance del Frontend y serán ampliadas mediante la implementación del Backend.

## 8. Desarrollo previsto del Backend

En la siguiente etapa se desarrollará un Backend que expondrá una API REST para conectar el Frontend con una base de datos PostgreSQL. Se implementarán el registro y autenticación de usuarios, la administración de proyectos y tareas, el almacenamiento permanente de la información, las asignaciones y los permisos reales según los roles. De esta manera, la aplicación dejará de utilizar datos simulados y comenzará a trabajar con información persistente y centralizada.

## 9. Estado del proyecto

**Primera entrega: Frontend desarrollado.**

La aplicación cuenta con una interfaz funcional para la gestión de proyectos y tareas, navegación entre módulos, formularios, búsquedas, filtros, indicadores dinámicos, perfiles simulados, validaciones y control de permisos en el cliente.

**Próxima fase: desarrollo e integración del Backend.**

---

*Proyecto académico – Gestor de Tareas y Proyectos.*