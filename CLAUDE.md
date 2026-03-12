# Kevin AI — Migrante Global

## Stack
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Prisma
- PostgreSQL

## Entorno
- VS Code
- Continue Extension
- Ollama (modelos locales)
- Claude (arquitecto)

## Modelos disponibles
- qwen3:8b → chat
- qwen2.5-coder:7b → programación

## Reglas de trabajo

1. Trabajar siempre en pasos pequeños
2. No modificar más de 3 archivos por iteración
3. Explicar el plan antes de aplicar cambios
4. No mover archivos críticos del App Router
5. Evitar romper imports
6. Confirmar siempre antes de ejecutar comandos peligrosos

## Objetivo del proyecto

Construir un sistema tipo **Jarvis** que combine:

- Claude → Arquitecto del sistema
- Qwen Coder (Ollama) → Programador
- VS Code → Entorno de desarrollo
- Continue → Orquestador de agentes

El sistema debe ayudar a:
- mejorar el código
- crear features
- refactorizar
- mantener la arquitectura del proyecto