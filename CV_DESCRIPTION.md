# PaLeva – Full-Stack Restaurant Management System
**Capstone Project** | React + TypeScript Specialization | IT Academy Barcelona | 2026

Desarrollé una plataforma full-stack completa para gestión de restaurantes con arquitectura escalable, TypeScript estricto, testing automatizado y despliegue en producción.

## 🚀 Stack Tecnológico

**Frontend:** React 19 + TypeScript, Vite, React Router v7, Custom Hooks Pattern, Service Layer Architecture, CSS Modules (tema dark moderno), UI completamente responsive, WebSocket para actualizaciones en tiempo real

**Backend:** Ruby on Rails 7.2, API REST versionada (v1), Devise + JWT authentication, Active Storage, Service Objects, Strong Parameters, Action Cable (WebSockets), Serializers personalizados

**DevOps & Infraestructura:** Docker & Docker Compose (containerización completa), CI/CD con GitHub Actions, Deploy automatizado en Render (backend) y Vercel (frontend), PostgreSQL en producción

**Testing & Calidad:** RSpec + Capybara (test coverage completo), TypeScript strict mode, ESLint, validaciones client/server-side, manejo centralizado de errores

## 💼 Funcionalidades Principales

- **Sistema de autenticación dual** (Proprietarios/Clientes) con redirección inteligente y validación de roles
- **Dashboard analítico** con gráficos, estadísticas en tiempo real y métricas de negócio
- **Gestión completa de pedidos** con workflow automatizado (draft → confirmed → preparing → ready → delivery/cancelled)
- **CRUD multi-porción** para platos y bebidas con gestión inline
- **Menús dinámicos** con sistema de tags, filtros por categoría y horarios de funcionamiento
- **Notificaciones en tiempo real** via WebSocket con reconexión automática y fallback graceful
- **Carrinho de compras** persistente con gestión de estado compleja
- **Sistema de ratings y reviews** para feedback de clientes

## 🎯 Logros Técnicos

✅ **Arquitectura modular** con separación clara entre áreas de cliente y propietario, facilitando mantenimiento y escalabilidad

✅ **Integración WebSocket robusta** con manejo de errores, reconexión automática y optimización para entornos de producción (Render free tier)

✅ **Automatización completa de procesos de negocio** transferible a flujos operativos en SaaS HR (time-off, approvals, payroll)

✅ **Containerización completa** con Docker Compose para desarrollo local y despliegue consistente

✅ **API RESTful bien estructurada** con versionado, serializers customizados y documentación implícita

✅ **TypeScript estricto** con tipado completo, interfaces bien definidas y zero `any` types

## 📊 Impacto

- Sistema completo end-to-end desde desarrollo hasta producción
- Arquitectura escalable lista para crecimiento
- Código mantenible con testing automatizado
- Experiencia de usuario fluida con actualizaciones en tiempo real

**Repository:** https://github.com/laisrod/PaLeva  
**Demo:** https://pa-leva.vercel.app/login

---

## Versión en Español (más concisa para CV)

**PaLeva – Sistema Full-Stack de Gestión para Restaurantes**  
*Capstone Project | React + TypeScript Specialization | IT Academy Barcelona | 2026*

Plataforma completa full-stack desarrollada con **React 19 + TypeScript**, **Ruby on Rails 7.2**, **Docker**, y **WebSockets** para actualizaciones en tiempo real. Incluye sistema de autenticación dual (proprietarios/clientes), dashboard analítico, gestión automatizada de pedidos con workflow completo, CRUD multi-porción, menús dinámicos, y notificaciones en tiempo real. Arquitectura modular y escalable con testing automatizado (RSpec), containerización completa con Docker Compose, y despliegue automatizado en Render/Vercel. Código type-safe con TypeScript estricto, API REST versionada, y manejo robusto de errores.

**Repo:** github.com/laisrod/PaLeva | **Demo:** pa-leva.vercel.app
