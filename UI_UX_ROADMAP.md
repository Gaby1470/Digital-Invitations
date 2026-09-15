# 🗺️ Roadmap de Mejoras de UI/UX y Arquitectura: Tap 2 Invite

Este documento detalla el plan de acción técnico y de diseño para elevar **Tap 2 Invite** a una plataforma SaaS de invitaciones digitales de nivel empresarial. Está organizado en fases incrementales que equilibran la complejidad técnica con el impacto inmediato en el usuario.

---

## 🚀 Resumen del Plan de Ruta

*   **Fase 1 (Impacto Inmediato y "Quick Wins"):** Optimización de previsualizaciones en redes sociales (WhatsApp/Instagram) y consistencia estética del diseño en dispositivos móviles.
*   **Fase 2 (Refinamiento del Editor):** Implementación de guardado automático en segundo plano y simplificación de formularios mediante un flujo guiado.
*   **Fase 3 (Características Premium):** Integración de música ambiental seleccionable, integración nativa de "Añadir al Calendario" y mapas interactivos.
*   **Fase 4 (Experiencia del Invitado - RSVP Conversacional):** Flujo de RSVP interactivo por pasos para aumentar las tasas de confirmación.

---

## 📍 Fase 1: Impacto Inmediato y Consistencia de Estilo

### 1.1 Metadatos Dinámicos para Compartir en Redes (OpenGraph)
*   **Objetivo:** Cuando un usuario comparta su enlace por WhatsApp, Messenger o Instagram, debe aparecer una previsualización hermosa con la foto del evento y los nombres de los anfitriones, no un logo genérico.
*   **Archivos a Modificar:** `src/app/(viewer)/[slug]/page.tsx`
*   **Estrategia Técnica:** Convertir la página del visor en un Server Component o usar un archivo de layout para extraer dinámicamente los datos de la invitación desde la base de datos de Supabase y generar los metadatos de Next.js antes de renderizar la página.

```typescript
// Implementación recomendada en Next.js (App Router)
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  // Realizar fetch directo en el servidor utilizando el endpoint de API o consulta directa a base de datos
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invitations/by-slug/${slug}`, {
    next: { revalidate: 3600 } // Caché por 1 hora
  });
  
  if (!res.ok) return { title: 'Invitación | Tap 2 Invite' };
  
  const invitation = await res.json();
  const invitationData = invitation.data || {};
  
  return {
    title: `${invitationData.heroNames || 'Te Invitamos'} | Tap 2 Invite`,
    description: invitationData.heroSubtitle || 'Acompáñanos a celebrar este gran día.',
    openGraph: {
      title: invitationData.heroNames || 'Nuestra Invitación',
      description: invitationData.heroSubtitle || 'Acompáñanos a celebrar este gran día.',
      images: [
        {
          url: invitationData.hero_image_url || '/branding/share-image.jpg',
          width: 1200,
          height: 630,
          alt: `Invitación de ${invitationData.heroNames}`,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: invitationData.heroNames,
      description: invitationData.heroSubtitle,
      images: [invitationData.hero_image_url || '/branding/share-image.jpg'],
    }
  };
}
```

### 1.2 Protección Contra Choques de Modo Oscuro (Dark Mode Force Disable)
*   **Objetivo:** Muchos invitados tienen activado el Modo Oscuro en sus sistemas operativos. Si un tema (p. ej., Minimalist Wedding) está configurado con fondo beige y textos oscuros por el diseñador, la interpolación automática de modo oscuro de Tailwind puede alterar los colores del fondo a negro, rompiendo la legibilidad y la estética.
*   **Archivos a Modificar:** Todos los archivos en `src/components/templates/*.tsx`
*   **Estrategia Técnica:** Forzar a que la envoltura principal del renderizador de plantillas ignore las clases de modo oscuro del sistema aplicando explícitamente la clase `light` o aislando la plantilla en un contenedor estático libre de la variable `dark:` de Tailwind.
```html
{/* Ejemplo de aislamiento de template */}
<div className="light w-full font-sans antialiased bg-white text-gray-900 forced-light-theme">
  {/* El contenido del template se renderizará siempre con sus estilos diseñados originalmente */}
</div>
```

---

## 🛠️ Fase 2: Optimización de la Experiencia del Editor

### 2.1 Guardado Automático en Segundo Plano (Debounced Autosave)
*   **Objetivo:** Eliminar la necesidad de que el usuario tenga que dar clic en "Guardar" y sea redirigido de regreso al dashboard constantemente, rompiendo su flujo de diseño. El guardado debe ocurrir de forma silenciosa mientras edita.
*   **Archivos a Modificar:** `src/app/(main-app)/editor/[id]/page.tsx`
*   **Estrategia Técnica:** 
    1.  Eliminar la redirección del método `handleSave`.
    2.  Introducir un mecanismo de de-bounce en React que detecte cambios en `invitationData` y envíe la petición `PUT` al servidor únicamente cuando el usuario deje de teclear durante 2 segundos.
    3.  Implementar un indicador visual discreto en la barra de navegación del editor.

```typescript
// Implementación de hook simple de guardado en el EditorPage:
import { useDebounce } from '@/hooks/use-debounce'; // O crear función local

// Dentro del componente EditorPage:
const [isSaving, setIsSaving] = useState(false);
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

useEffect(() => {
  if (!invitationData || loading) return;

  setSaveStatus('saving');
  const delayDebounceFn = setTimeout(async () => {
    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: invitationData, slug: invitationData.slug }),
      });

      if (!response.ok) throw new Error('Error al guardar');
      setSaveStatus('saved');
      
      // Regresa al estado inactivo después de 3 segundos
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    }
  }, 2000); // Guardado automático 2 segundos después del último cambio

  return () => clearTimeout(delayDebounceFn);
}, [invitationData, id]);
```

**Indicador de UI Recomendado (Esquina Superior Derecha):**
*   **Guardando:** Icono de spinner giratorio animado sutil + *"Guardando cambios..."* en tono gris.
*   **Guardado:** Icono de check verde sutil + *"Guardado en la nube"*.
*   **Error:** Icono de alerta rojo + *"Error de conexión, reintentando..."*.

### 2.2 Formulario Guiado por Pasos (Wizard Progress)
*   **Objetivo:** Reemplazar el largo scroll vertical de secciones colapsables en `EditorForm.tsx` por una navegación horizontal intuitiva por pestañas o asistente secuencial.
*   **Archivos a Modificar:** `src/components/editor/EditorForm.tsx`
*   **Estrategia Técnica:** Dividir las secciones del formulario por temáticas utilizando pestañas estilizadas en la parte superior:
    1.  **Información Clave:** (Nombres, fecha, horarios, locación).
    2.  **Visuales y Estilo:** (Foto de portada, paleta de colores, fuentes, galería).
    3.  **Detalles Extra:** (Código de vestimenta, mesa de regalos, notas importantes).
    4.  **Configuración Compartida:** (Personalización de enlace / slug, visualización del RSVP).

---

## 💎 Fase 3: Características Premium y Micro-Interacciones

### 3.1 Reproductor de Música de Fondo (Ambient Audio)
*   **Objetivo:** Permitir a los anfitriones agregar música romántica, festiva o solemne para reproducir cuando los invitados abran la invitación.
*   **Archivos a Modificar:**
    *   `src/lib/templateConfig.ts` (Añadir propiedad `audioUrl` por defecto o personalizada).
    *   `src/components/editor/form-sections/ColorsAndStyleSection.tsx` (Agregar cargador de archivo de audio o link de YouTube/Spotify optimizado).
    *   `src/components/TemplateRenderer.tsx` (Renderizar el componente global de música flotante).
*   **Especificación de UI:**
    *   Un pequeño botón circular flotante en una esquina de la pantalla del celular que muestre ondas de sonido animadas cuando se reproduce y se pause con un tap.
    *   **Importante:** Mantenerlo silenciado por defecto para cumplir con las políticas del navegador, activándolo tras la primera interacción física del usuario al presionar el botón "Abrir Invitación".

### 3.2 Botón Nativo "Añadir al Calendario"
*   **Objetivo:** Permitir que los invitados agreguen el evento a su Google Calendar, Apple iCal u Outlook con un solo clic para evitar olvidos.
*   **Archivos a Modificar:** `src/components/templates/shared/Countdown.tsx` o cerca de la fecha del evento.
*   **Estrategia Técnica:** Crear enlaces formateados para Google Calendar y descargar archivos `.ics` generados al vuelo para plataformas de Apple y Outlook.

```typescript
// Helper para generar el enlace de Google Calendar
export const generateGoogleCalendarLink = (event: {
  title: string;
  description: string;
  startDate: string; // Formato ISO
  location: string;
}) => {
  const start = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
  // Duración estimada por defecto: 5 horas
  const endDate = new Date(new Date(event.startDate).getTime() + 5 * 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
};
```

---

## 🎭 Fase 4: Experiencia del Invitado - RSVP Conversacional

El RSVP tradicional en modales puede percibirse frío o mecánico. Al transformarlo en un flujo de diálogo por pasos, la conversión de respuestas se incrementa notablemente.

### 4.1 Flujo Conversacional Animado con Framer Motion
*   **Objetivo:** Reemplazar el formulario largo en `RsvpForm` de `src/app/rsvp/[slug]/page.tsx` por una experiencia interactiva por pasos, usando transiciones suaves y elegantes.
*   **Estructura de Pasos:**

```
[Paso 1: Bienvenida]
"¡Hola Familia García! Tienen 4 pases reservados."
[ Botón: Sí, asistiremos con gusto ] [ Botón: Lo sentimos, no podremos ir ]
          │                                      │
          ▼ (Si responde que sí)                 ▼ (Si responde que no)
[Paso 2: Invitados Detallados]            [Paso 3: Mensaje de despedida]
"¿Cuántos de ustedes nos acompañarán?"    "¡Los extrañaremos! Dejen un mensaje sutil..."
[ Selector de Asientos: 1 - 4 ]            [ Campo de texto opcional ]
          │                                      │
          ▼                                      ▼
[Paso 2b: Captura de Nombres]             [Paso Final: Confirmado]
"Por favor ingresen los nombres de         "¡Gracias! Tu respuesta ha sido enviada"
quienes asistirán para el pase de entrada:"
[ Input Nombre 1 ] [ Input Nombre 2 ]
          │
          ▼
[Paso 3: Notas / Alergias]
"¿Tienen restricciones alimenticias o
algún comentario para los anfitriones?"
[ Campo de texto opcional ]
          │
          ▼
[Paso Final: Confirmado]
"¡Excelente! Nos vemos el 7 de Noviembre"
[ Botón de descarga de pase de entrada / QR ]
```

### 4.2 Efecto Confeti al Confirmar Asistencia
*   **Objetivo:** Celebrar visualmente la confirmación de la asistencia del invitado, generando una conexión emocional y gratificante.
*   **Archivos a Modificar:** `src/app/rsvp/[slug]/page.tsx`
*   **Estrategia Técnica:** Utilizar la librería `canvas-confetti` (que ya está listada en las dependencias de tu `package.json`!) para detonar una ráfaga de confeti elegante con tonos dorados o plateados al completar con éxito la petición de RSVP.

```typescript
import confetti from 'canvas-confetti';

const triggerSuccessConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Dispara confeti desde posiciones aleatorias superiores
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};
```

---

## 📈 Checklist de Calidad Técnica Post-Implementación

*   [ ] **Optimización LCP (Largest Contentful Paint):** Comprobar que la primera imagen visible en los teléfonos (Hero Image de la invitación) esté configurada con prioridad alta (`priority={true}`) para evitar tiempos de carga mayores a 2 segundos en conexiones móviles 4G.
*   [ ] **Cumplimiento de Accesibilidad (a11y):** Los textos dinámicos generados por los usuarios sobre los colores de fondo deben cumplir con la relación de contraste de color adecuada (WCAG AA ratio de al menos 4.5:1 para texto normal).
*   [ ] **Aislamiento de Navegación del Teclado:** Asegurar que el modal conversacional de confirmación mantenga el foco del teclado (Focus Trap) para que los usuarios con lectores de pantalla o navegación asistida puedan confirmar fácilmente.
*   [ ] **Prueba de Performance Lighthouse:** Mantener un score mínimo de **90+** en mobile Performance para todos los visores de invitaciones.
