# Requirements — Country Quiz App

## Introduction

Aplicación de quiz sobre países construida con React, React Router y Tailwind CSS. El objetivo académico es demostrar manejo de APIs externas, enrutamiento SPA, diseño responsivo y buenas prácticas de calidad de código. El docente evalúa: funcionalidad completa del reto base, cuatro características extra, historial de commits de ambos integrantes, tests unitarios, y despliegue continuo en Netlify.

## Glosario

| Término | Definición |
|---------|-----------|
| Pregunta | Un país objetivo con 4 opciones de respuesta generadas aleatoriamente |
| Opción correcta | El nombre oficial del país objetivo |
| Opciones distractoras | Tres países distintos elegidos aleatoriamente del pool de datos |
| Racha / High Score | Cantidad máxima de respuestas correctas en una sola sesión, persistida en localStorage |
| Round | Una sesión completa de 10 preguntas |
| Timer | Cuenta regresiva de 15 segundos por pregunta |

---

## Requirement 1: Carga y generación de preguntas

**User Story:** Como jugador, quiero que la app cargue 10 preguntas sobre países al iniciar, para poder comenzar el quiz de inmediato sin configuración manual.

### Acceptance Criteria

1. WHEN la app inicia, THEN debe realizar un GET a `https://restcountries.com/v3.1/all` y seleccionar 10 países aleatoriamente del resultado.
2. WHEN se seleccionan los 10 países objetivo, THEN para cada uno se generan 3 opciones distractoras elegidas aleatoriamente del mismo pool, sin repetir el país objetivo.
3. WHILE la data se está cargando, THEN la UI debe mostrar un estado de carga visible (spinner o skeleton).
4. IF la petición falla (error de red o HTTP ≥ 400), THEN se muestra un mensaje de error con un botón "Reintentar" que vuelve a ejecutar el fetch.
5. WHEN la data carga exitosamente, THEN se navega automáticamente a la primera pregunta.
6. WHEN se genera cada pregunta, THEN el orden de las 4 opciones debe estar aleatorizado (la respuesta correcta no siempre en la misma posición).

---

## Requirement 2: Visualización de cada pregunta

**User Story:** Como jugador, quiero ver claramente la pregunta y sus cuatro opciones, para poder elegir una respuesta de forma intuitiva.

### Acceptance Criteria

1. WHEN se muestra una pregunta, THEN debe aparecer la bandera del país como imagen principal usando el campo `flags.svg` o `flags.png` de la API.
2. WHEN se muestra una pregunta, THEN deben aparecer exactamente 4 opciones de respuesta como botones seleccionables.
3. WHEN se muestra una pregunta, THEN debe indicarse el número de pregunta actual y el total (ej. "Question 1 of 10").
4. WHEN una pregunta no ha sido respondida aún, THEN todas las opciones deben verse en su estado neutral (sin indicadores de correcto/incorrecto).
5. WHEN una pregunta ya fue respondida (en sesión), THEN al volver a ella debe mostrarse el estado con los indicadores aplicados.

---

## Requirement 3: Selección de respuesta y feedback inmediato

**User Story:** Como jugador, quiero saber de inmediato si respondí bien o mal, para aprender mientras juego.

### Acceptance Criteria

1. WHEN el jugador selecciona una opción, THEN la opción correcta se marca con un indicador visual de éxito (color verde o ícono de check).
2. WHEN el jugador selecciona una opción incorrecta, THEN esa opción se marca con un indicador visual de error (color rojo o ícono de X), y la opción correcta también se resalta en verde.
3. WHEN se muestra el feedback, THEN las demás opciones (ni seleccionadas ni correctas) deben quedar visualmente neutrales o deshabilitadas.
4. WHEN el jugador selecciona cualquier opción, THEN todas las opciones quedan deshabilitadas para esa pregunta (no se puede cambiar la respuesta).
5. WHEN la respuesta es correcta, THEN se reproduce un sonido corto de éxito (audio feedback).
6. WHEN la respuesta es incorrecta, THEN se reproduce un sonido corto de error (audio feedback).

---

## Requirement 4: Timer por pregunta (Modo Contrarreloj)

**User Story:** Como jugador, quiero tener un límite de tiempo por pregunta, para que el quiz sea más desafiante.

### Acceptance Criteria

1. WHEN se muestra una nueva pregunta sin responder, THEN comienza una cuenta regresiva visible de 15 segundos.
2. WHILE el timer corre, THEN debe mostrarse el tiempo restante de forma visible (número o barra de progreso).
3. IF el timer llega a 0 antes de que el jugador responda, THEN la pregunta se cuenta como incorrecta automáticamente y se aplica el feedback visual como si el jugador hubiera seleccionado mal.
4. WHEN el jugador selecciona una respuesta antes de que expire el timer, THEN el timer se detiene inmediatamente.
5. WHEN se navega a una pregunta ya respondida, THEN el timer NO corre (está bloqueada).
6. WHEN se inicia un nuevo round (play again), THEN el timer se reinicia para la primera pregunta.

---

## Requirement 5: Navegación entre preguntas

**User Story:** Como jugador, quiero poder navegar libremente entre preguntas, para revisar o responder en cualquier orden.

### Acceptance Criteria

1. WHEN el jugador está en cualquier pregunta, THEN debe haber controles de navegación (botón "Next" y/o indicadores de pregunta clicables).
2. WHEN el jugador hace clic en el indicador de una pregunta específica (ej. punto o número), THEN la app navega a esa pregunta.
3. WHEN el jugador navega a una pregunta ya respondida, THEN se muestra el estado de esa pregunta con el feedback aplicado y sin timer activo.
4. WHEN el jugador navega a una pregunta no respondida, THEN el timer se reinicia para esa pregunta.
5. WHEN el jugador está en la última pregunta y todas están respondidas, THEN aparece un botón "Ver Resultados" o se navega automáticamente a la pantalla de resultados.

---

## Requirement 6: Pantalla de resultados (Congratulations)

**User Story:** Como jugador, quiero ver mi resultado final al completar el quiz, para saber cuántas preguntas respondí correctamente.

### Acceptance Criteria

1. WHEN el jugador responde la última pregunta (o navega a resultados con todas respondidas), THEN se muestra una pantalla de resultados/felicitaciones.
2. WHEN se muestra la pantalla de resultados, THEN debe indicar el número de respuestas correctas sobre el total (ej. "8 / 10").
3. WHEN se muestra la pantalla de resultados, THEN debe mostrar el High Score actual guardado en localStorage.
4. IF el puntaje actual supera el High Score previo, THEN el High Score se actualiza en localStorage y se indica visualmente que es un nuevo récord.
5. WHEN el jugador hace clic en "Play Again", THEN se reinicia el quiz completo: nuevo fetch de datos, nuevas 10 preguntas, timer reiniciado, puntaje actual en 0 (el High Score persiste).

---

## Requirement 7: Persistencia de High Score

**User Story:** Como jugador, quiero que mi mejor puntaje se guarde aunque recargue la página, para tener un objetivo al que superar.

### Acceptance Criteria

1. WHEN el jugador completa un round, THEN la app lee el valor `countryQuiz_highScore` de localStorage.
2. IF el puntaje actual es mayor al valor almacenado (o si no existe), THEN se escribe el nuevo valor en `countryQuiz_highScore`.
3. WHEN la app carga por primera vez sin valor previo en localStorage, THEN el High Score se muestra como 0.
4. WHEN el jugador hace "Play Again", THEN el High Score persiste en localStorage (no se borra).

---

## Requirement 8: Dark Mode / Light Mode

**User Story:** Como usuario, quiero poder cambiar entre modo oscuro y claro, para usar la app cómodamente en cualquier condición de luz.

### Acceptance Criteria

1. WHEN la app carga, THEN debe detectar la preferencia del sistema (`prefers-color-scheme`) y aplicar el tema correspondiente por defecto.
2. WHEN el usuario hace clic en el switch de tema, THEN la app alterna entre modo claro y oscuro de forma inmediata sin recargar.
3. WHEN se aplica dark mode, THEN todos los colores de fondo, texto, botones y cards deben cambiar usando las clases `dark:` de Tailwind CSS.
4. WHEN el usuario cambia el tema, THEN la preferencia se guarda en localStorage bajo la clave `countryQuiz_theme` para persistir entre sesiones.
5. WHEN la app recarga con una preferencia guardada, THEN aplica el tema guardado (tiene prioridad sobre la preferencia del sistema).

---

## Requirement 9: Enrutamiento con React Router

**User Story:** Como desarrollador, quiero que la navegación de la app use React Router, para cumplir con el stack obligatorio y tener URLs significativas.

### Acceptance Criteria

1. WHEN la app inicia, THEN la ruta `/` debe mostrar una pantalla de inicio o redirigir al quiz.
2. WHEN el quiz está activo, THEN la ruta debe reflejar la pregunta actual (ej. `/quiz/1` hasta `/quiz/10`).
3. WHEN el quiz termina, THEN la ruta debe cambiar a `/results`.
4. IF el usuario accede directamente a `/quiz/:n` sin datos cargados, THEN debe redirigirse a `/` para iniciar correctamente.
5. WHEN el usuario hace clic en "Play Again" en `/results`, THEN la app navega a `/` y reinicia el flujo.

---

## Requirement 10: Calidad de código y testing

**User Story:** Como equipo de desarrollo, queremos que el código esté lintado y testeado, para cumplir con los criterios de calidad del docente.

### Acceptance Criteria

1. WHEN el proyecto está configurado, THEN ESLint debe estar instalado con reglas para React (eslint-plugin-react) y Hooks (eslint-plugin-react-hooks).
2. WHEN se corre `npm run lint`, THEN no deben existir errores de ESLint en los archivos fuente.
3. WHEN se corren los tests (`npm test` o `npm run test`), THEN deben ejecutarse exactamente 4 pruebas unitarias que pasen exitosamente.
4. WHEN se escriben los tests, THEN deben cubrir al menos los siguientes escenarios:
   - Estado de carga (loading state) mientras se fetcha la API.
   - Estado de error con el botón "Reintentar".
   - Interactividad: seleccionar una opción aplica el feedback correcto.
   - Timer: que el componente renderiza el tiempo inicial correctamente.
5. WHEN se hace push a la rama `main`, THEN Netlify debe disparar un nuevo build automáticamente (CI/CD configurado).
