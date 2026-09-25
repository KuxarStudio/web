export interface Solution {
  title: string;
  description: string;
  examples: string[];
}

export const solutions: Solution[] = [
  {
    title: 'Automatización de procesos internos',
    description:
      'Agentes y conectores que eliminan tareas repetitivas entre tus sistemas, sin que nadie tenga que copiar y pegar datos a mano.',
    examples: [
      'Conectores entre herramientas existentes (ERP, CRM, hojas de cálculo)',
      'Agentes que ejecutan tareas repetitivas sin supervisión humana',
    ],
  },
  {
    title: 'Datos y análisis',
    description:
      'Preguntas en español directo, convertidas en consultas SQL y dashboards — sin depender de un analista para cada informe.',
    examples: [
      'Analista de datos interno (texto → SQL, texto → dashboard)',
      'Informes automáticos sobre tus propias bases de datos',
    ],
  },
  {
    title: 'Ventas y propuestas',
    description:
      'IA especializada en tu sector que redacta presupuestos, propuestas y licitaciones a partir de los datos del cliente.',
    examples: [
      'Generador de presupuestos sector-específico (ej. fontanería, reformas)',
      'Redacción asistida de licitaciones y propuestas comerciales',
    ],
  },
  {
    title: 'Atención al cliente',
    description:
      'Agentes de soporte y preventa que responden con el contexto real de tu negocio, antes, durante y después de la venta.',
    examples: [
      'Agente de soporte entrenado con tu documentación',
      'Preventa automatizada que cualifica leads 24/7',
    ],
  },
  {
    title: 'Software a medida sobre IA',
    description:
      'Cuando ninguna herramienta genérica encaja: una capa de software con lógica de negocio, UX y almacenamiento propios sobre modelos de IA.',
    examples: [
      'Plataformas internas con lógica y datos propios',
      'Digitalización de accesos y procesos en fábricas o empresas',
      'Automatización de onboarding de clientes',
      'Auditoría de cumplimiento y calidad asistida por IA',
    ],
  },
];
