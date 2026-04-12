# 🧠 Plataforma de Evaluación de Conocimientos

Este proyecto es una plataforma web diseñada para evaluar conocimientos en diferentes áreas mediante exámenes dinámicos. Está orientado a entornos educativos o procesos de selección técnica.

---

## 🚀 Tecnologías Utilizadas

- **Backend:** Node.js  
- **Frontend:** HTML, CSS, JavaScript  
- **Base de Datos:** PostgreSQL  

---

## 👥 Tipos de Usuarios

### 👨‍🎓 Estudiante
El estudiante puede:

- Iniciar sesión en la plataforma.
- Visualizar si tiene un examen asignado.
- Realizar el examen asignado.
- Contar con una cantidad limitada de intentos para completar el examen.

---

### 👨‍💼 Administrador
El administrador tiene control total sobre la plataforma:

#### 🔹 Gestión de Usuarios
- Crear usuarios (administradores y estudiantes).
- Editar usuarios.
- Eliminar usuarios.

#### 🔹 Gestión de Temas (Áreas de Conocimiento)
- Crear temas.
- Editar temas.
- Eliminar temas.

#### 🔹 Gestión de Preguntas
- Crear preguntas asociadas a un tema.
- Editar preguntas.
- Eliminar preguntas.

#### 🔹 Gestión de Exámenes
- Crear exámenes.
- Editar exámenes.
- Eliminar exámenes.
- Asignar temas y preguntas a cada examen.

#### 🔹 Asignación de Exámenes
- Asignar un único examen activo a cada estudiante.
- Definir la cantidad de intentos permitidos.

#### 🔹 Resultados
- Visualizar el resultado del último intento de cada estudiante.
- Descargar un reporte en PDF que incluye:
  - Nota obtenida.
  - Respuestas correctas.
  - Respuestas incorrectas.

---

## 📌 Características Principales

- Sistema de autenticación por roles.
- Evaluaciones con intentos limitados.
- Administración completa de contenido (usuarios, temas, preguntas, exámenes).
- Generación de reportes en PDF.
- Escalable para múltiples áreas de conocimiento.

---

## ⚙️ Instalación y Ejecución

1. Clonar el repositorio:
```bash
git clone https://github.com/Bojtronic/AutoEvaluacion_SS.git
cd AutoEvaluacion_SS
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` con la configuración de la base de datos PostgreSQL.

Ejemplo:
```
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=nombre_db
DB_PORT=5432
```

4. Ejecutar el proyecto:
```bash
npm start
```

---

## 📂 Estructura General

```
/controlllers
/data
/database
/public
/queries
/routes
index.js
```

---

## 📝 Notas

- Cada estudiante solo puede tener un examen asignado a la vez.
- Los intentos se controlan automáticamente por el sistema.
- El PDF generado permite un análisis detallado del desempeño.

---

## 📧 Autor

Proyecto desarrollado como herramienta de evaluación de conocimientos técnicos para la empresa Security Software
