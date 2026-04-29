import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fetchUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return null
  try {
    const params = new URLSearchParams({
      query: `Switzerland ${query}`,
      per_page: '1',
      orientation: 'landscape',
    })
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.results?.[0]?.urls?.regular ?? null
  } catch {
    return null
  }
}

function makeSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) +
    '-' +
    Date.now()
  )
}

const ARTICLES = [
  {
    category: 'Visas y permisos',
    imageQuery: 'Bern government parliament',
    title: 'Permiso B, C o L en Suiza: cuál necesitas y cómo no confundirte',
    excerpt:
      'El sistema de permisos suizo confunde a casi todos los recién llegados. Lo explico sin rodeos para que sepas exactamente dónde estás parado.',
    content: `Cuando llegué a Suiza por primera vez, el funcionario de migración me preguntó qué tipo de permiso tenía. Yo sabía que era "el permiso de trabajo" — nada más. Ese nivel de desconocimiento me costó semanas de confusión innecesaria.

No te pase lo mismo.

## Los tres permisos que te importan como latino en Suiza

**Permiso L — Corta duración**

Es temporal, se emite para contratos de menos de un año. Si vienes con un contrato de 6 meses, probablemente empieces con este. El problema: no da estabilidad, no te permite traer familia fácilmente y hay que renovarlo constantemente.

Lo que muchos no saben: si tu empleador renueva el contrato y superas los 12 meses continuos, tienes derecho a pedir el cambio a permiso B automáticamente.

**Permiso B — Residencia temporal**

Este es el objetivo inicial para la mayoría. Se emite por 1 año renovable. Te permite buscar trabajo entre empleadores, vivir con tu familia (con reagrupación aprobada) y moverte dentro del espacio Schengen con más libertad.

La clave: se renueva siempre que tengas contrato vigente o puedas demostrar independencia económica. Perderlo por cambio de trabajo sin notificar a la oficina de migración es uno de los errores más comunes que veo.

**Permiso C — Establecimiento**

Este es el que cambia todo. Después de 5 años con permiso B (o 10 en algunos casos según tu nacionalidad), puedes pedir el C. Con él puedes trabajar sin restricciones de empleador, acceder a prestaciones sociales en igualdad de condiciones con los suizos y, eventualmente, pedir la naturalización.

## El error que más veo

Cambiar de trabajo sin informar a la oficina cantonal de migración. Esto no cancela el permiso automáticamente, pero crea un historial administrativo que complica las renovaciones futuras.

Cada vez que cambies de empleador, notifícalo. Es un trámite simple pero crítico.

## ¿Cuál es el siguiente paso para ti?

Si estás antes de llegar: negocia un contrato de al menos 12 meses para poder pedir el B directamente.

Si ya estás aquí con un L: cuenta los meses y prepara la solicitud de cambio con antelación.

Si tienes el B: protégelo. Paga tu AHV, no acumules deudas, mantén el contrato activo o justifica tu situación económica.

Parece mucho. Pero con la información correcta, es manejable. Si quieres revisar tu situación específica, en una sesión de orientación te digo exactamente qué tienes que hacer y en qué orden.`,
  },
  {
    category: 'Mercado laboral',
    imageQuery: 'Zurich office business district',
    title: 'Trabajo en Suiza sin hablar alemán: dónde sí es posible y cómo entrar',
    excerpt:
      'No hablar alemán no es una sentencia de muerte laboral en Suiza. Pero necesitas saber exactamente en qué sectores buscar y cómo presentarte.',
    content: `Esto me lo preguntan casi todos los días: "Kevin, ¿puedo conseguir trabajo en Suiza sin hablar alemán?"

La respuesta honesta: depende de dónde busques.

## Sectores donde el inglés es suficiente para empezar

**Tecnología e IT**

Zurich es el segundo hub tecnológico de Europa después de Londres. Google, Meta, LinkedIn, Spotify tienen oficinas allí. El idioma de trabajo en estas empresas es inglés. Si tienes perfil tech (desarrollo, data, diseño UX, product), el alemán es deseable pero raramente excluyente en la primera etapa.

**Organizaciones internacionales**

Ginebra es otra historia. ONU, OMS, CICR, OMC — todas operan en inglés y/o francés. Si tienes experiencia en organizaciones internacionales o perfiles relacionados (relaciones internacionales, salud global, derechos humanos), Ginebra puede ser tu puerta.

**Hostelería y turismo**

Suiza recibe más de 40 millones de turistas al año. En zonas turísticas como Interlaken, Lucerna, Zermatt o los Alpes, el inglés es el idioma operativo. No es el trabajo mejor pagado del país, pero es un punto de entrada con permiso de trabajo relativamente accesible.

**Healthcare internacional**

Clínicas privadas en Zurich y Ginebra contratan personal médico y de enfermería con inglés. La homologación del título es el obstáculo principal, no el idioma.

## Cómo presentar tu candidatura desde fuera de Suiza

El error más común que veo: enviar el mismo CV latinoamericano de 3 páginas a empresas suizas.

Aquí va el formato que funciona:

- CV de máximo 2 páginas, estilo europeo, con foto profesional (sí, en Suiza se incluye foto)
- Carta de motivación específica por empresa — no genérica
- LinkedIn actualizado en inglés con foto profesional, summary claro y recomendaciones de ex-jefes

Los portales donde más encuentro ofertas para perfiles internacionales: jobs.ch, LinkedIn, Indeed.ch y las páginas de carreras directas de las empresas.

## La realidad que nadie dice

Sin hablar al menos uno de los idiomas nacionales (alemán, francés, italiano), tu techo en Suiza es limitado. Las promociones, los puestos de gestión, el acceso a empresas locales medianas — todo eso requiere integración lingüística.

Mi recomendación: empieza a aprender alemán o francés desde hoy, aunque todavía estés en tu país. No necesitas ser fluido para llegar. Necesitas estar en proceso activo de aprendizaje para quedarte y crecer.

¿Quieres que revisemos tu perfil específico y te diga qué sector se adapta mejor a ti? Eso es exactamente lo que hacemos en la primera sesión de orientación.`,
  },
  {
    category: 'Homologación de títulos',
    imageQuery: 'university education diploma academic',
    title: 'Cómo homologar tu título universitario en Suiza: el proceso real, sin adornos',
    excerpt:
      'Swissuniversities, SERI, reconocimiento cantonal... hay más organismos de los que crees. Te explico cuál te corresponde según tu perfil.',
    content: `Una de las primeras preguntas que me hace casi toda persona con título universitario antes de migrar: "¿Sirve mi carrera en Suiza?"

La respuesta no es sí ni no. Depende del título, del cantón y del sector. Vamos por partes.

## El mapa de organismos de reconocimiento

Suiza no tiene un sistema único de homologación. Hay tres vías principales dependiendo de tu perfil:

**swissuniversities.ch — Para títulos académicos universitarios**

Si tienes licenciatura, máster o doctorado de una universidad convencional (medicina, derecho, ingeniería, ciencias sociales...), este es tu punto de entrada. Evalúan si tu institución de origen tiene equivalencia con el sistema universitario suizo.

El proceso puede tardar entre 3 y 6 meses. El coste ronda los 150-300 CHF según el nivel.

**SERI (Secretaría de Estado para la Formación, Investigación e Innovación) — Para formación profesional**

Si tienes un título técnico, FP superior, o formación profesional, el organismo es SERI. Esto incluye perfiles como técnicos, trabajadores sociales, enfermería de nivel medio, contabilidad.

**Reconocimiento cantonal — Para profesiones reguladas**

Médicos, dentistas, farmacéuticos, veterinarios, maestros — estas profesiones tienen un proceso cantonal adicional porque están reguladas a nivel local. No es suficiente con el reconocimiento federal: necesitas validación del cantón donde ejercerás.

## Lo que tarda y lo que cuesta realmente

Experiencia directa de clientes que he acompañado:

- Ingeniería: reconocimiento en 4 meses, sin coste adicional en algunos casos si la universidad está en la base de datos europea de Bolonia
- Medicina: 12 a 18 meses si hay pruebas de idioma requeridas + evaluación cantonal
- Derecho: generalmente no homologable directamente para ejercer como abogado — requiere formación adicional en Suiza

## El error más frecuente

Llegar a Suiza sin haber iniciado el proceso. Muchos piensan que se hace una vez aquí. Es posible, pero pierdes tiempo de trabajo cualificado que podrías estar ganando.

Puedes iniciar la solicitud de evaluación antes de llegar. El organismo correspondiente te pedirá los documentos apostillados — eso ya lo puedes gestionar desde tu país.

¿No sabes por qué vía te corresponde ir? En una consulta revisamos tu título, tu país de emisión y el sector donde quieres trabajar, y te doy el mapa exacto.`,
  },
  {
    category: 'Bienestar y salud',
    imageQuery: 'pharmacy health medical Switzerland',
    title: 'Seguro médico en Suiza: lo que me hubiera gustado saber antes de llegar',
    excerpt:
      'El KVG es obligatorio desde el primer día. Pero elegir la caja incorrecta puede costarte cientos de francos al año innecesariamente.',
    content: `El sistema de salud suizo es uno de los mejores del mundo. También es uno de los más caros si no lo entiendes.

Cuando llegué, elegí mi caja de salud (Krankenkasse) en 10 minutos porque un compañero de trabajo tenía la misma. Error que me costó 600 CHF al año más de lo necesario.

## Cómo funciona el seguro básico (KVG/LAMal)

El seguro básico es obligatorio para todo residente en Suiza desde el primer mes de llegada. No es negociable. Cubre hospitalización, médico de familia, urgencias, algunas medicaciones y partos.

Lo que varía entre cajas no es la cobertura básica (esa está fijada por ley y es idéntica en todas) — sino la **prima mensual** y la **calidad del servicio al cliente**.

## Franchise y Prämie: la combinación que más confunde

Tienes dos variables que controlas:

**Prämie (prima):** lo que pagas mensualmente. Varía según la caja, tu cantón, edad y modelo elegido.

**Franchise (franquicia):** lo que pagas de tu bolsillo antes de que el seguro empiece a cubrir. Va de 300 CHF (mínimo) a 2500 CHF (máximo) al año.

La lógica: si eliges franchise alta (2500 CHF), tu prima mensual baja significativamente. Si eres joven y sano y vas poco al médico, puede ser más económico pagar más franchise y menos prima. Si tienes problemas de salud recurrentes, conviene franchise baja.

## Cómo comparar sin perderte

La herramienta oficial del gobierno suizo: **priminfo.ch**

Introduces tu cantón, edad y franchise preferida y te muestra todas las cajas ordenadas por precio. Actualizado cada año para el período de cambio (noviembre, con efectos desde enero).

Modelos más económicos:
- **HMO:** siempre vas a un centro médico de la red de la caja. Precio más bajo.
- **Médico de familia:** eliges un médico de cabecera fijo. Intermedio.
- **Estándar:** máxima libertad, precio más alto.

## Lo que tienes que hacer al llegar

1. Antes del día 90 de tu llegada, escoge caja y firma contrato
2. Si llegas después del 1 de marzo sin seguro, pueden cobrarte retroactivamente desde tu fecha de entrada
3. Cada noviembre revisa si sigue siendo competitiva tu caja — tienes derecho a cambiar sin penalización

El seguro complementario (accidentes, dental, óptica) es opcional y varía mucho. Yo lo recomiendo solo cuando llevas más de 6 meses y sabes cuáles son tus necesidades reales.

¿Tienes dudas sobre qué modelo te conviene según tu situación específica? Lo revisamos en consulta.`,
  },
  {
    category: 'Educación y familia',
    imageQuery: 'Swiss family children park nature',
    title: 'Reagrupación familiar en Suiza: qué piden exactamente y cuánto tarda',
    excerpt:
      'La reagrupación familiar es posible, pero los requisitos son más estrictos de lo que imaginas. Aquí los detallo sin filtro para que vayas preparado.',
    content: `Uno de los momentos más emocionalmente complejos del proceso migratorio: ya estás establecido en Suiza, pero tu familia sigue en tu país. Quieres que vengan. ¿Cuándo y cómo?

Lo que nadie te dice: la reagrupación familiar en Suiza está condicionada a requisitos concretos que no son negociables.

## Quién puede pedir la reagrupación y cuándo

Si tienes **permiso B**, puedes pedir la reagrupación para tu cónyuge e hijos menores de 18 años. No inmediatamente — hay un plazo de espera implícito que varía por cantón pero suele ser de 6 a 12 meses tras obtener el B.

Si tienes **permiso C**, el proceso es más ágil y los plazos son más cortos.

Si tienes **permiso L** (corta duración), la reagrupación es prácticamente imposible. Esta es una de las razones por las que siempre recomiendo negociar contratos de mínimo 12 meses.

## Los tres requisitos reales que te van a pedir

**1. Ingresos suficientes**

La autoridad migratoria evalúa si tus ingresos cubren el sustento de toda la familia sin necesitar ayuda social. No hay un número fijo universal — depende del cantón y del número de miembros. Como referencia orientativa: para una familia de 3 personas en Zurich, se estima que necesitas demostrar ingresos de al menos 4.500–5.000 CHF netos mensuales.

**2. Vivienda adecuada**

No puedes tener tu familia en un estudio de 25m². La autoridad verificará que dispones de una vivienda de tamaño apropiado para el número de personas. Esto en la práctica significa que antes de pedir la reagrupación, ya debes tener el piso más grande alquilado.

**3. Sin deudas ni ayuda social**

Un historial limpio en el Betreibungsregister (registro de deudas) es casi obligatorio. Si has recibido asistencia social en los últimos meses, el proceso se complica enormemente.

## El caso de los hijos mayores de 12 años

Aquí la ley se pone más difícil. Para hijos entre 12 y 18 años, la autoridad evalúa la capacidad de integración. En la práctica, son más difíciles de aprobar que los menores de 12.

Para hijos mayores de 18 años, salvo excepciones muy específicas (discapacidad, dependencia demostrada), la reagrupación no es posible.

## El tiempo que tarda

En condiciones normales: entre 3 y 6 meses desde la presentación de la solicitud completa. En cantones con alta carga administrativa (Zurich, Ginebra) puede extenderse a 8 meses.

El error que retrasa todo: enviar la solicitud con documentos incompletos. Apostillas, traducciones, actas de nacimiento, certificado de matrimonio — todo tiene que estar en orden antes de enviar.

¿Quieres revisar si ya cumples los requisitos para iniciar la reagrupación? Lo vemos juntos en una sesión.`,
  },
  {
    category: 'Finanzas y vivienda',
    imageQuery: 'Zurich apartment residential building city',
    title: 'Alquilar piso en Suiza siendo extranjero: los errores que te dejan sin apartamento',
    excerpt:
      'El mercado de vivienda suizo es brutal. Sin historial crediticio local y con permiso reciente, las probabilidades bajan. Pero hay forma de entrar.',
    content: `La primera vez que intenté alquilar un piso en Zurich, apliqué a 11 apartamentos en tres semanas. Me aceptaron en 0.

No era porque no pudiera permitírmelo económicamente. Era porque no sabía cómo presentarme.

## Por qué es tan difícil para los recién llegados

Los arrendadores suizos reciben entre 30 y 150 solicitudes por apartamento en ciudades grandes. Seleccionan basándose en un criterio muy claro: riesgo cero.

Lo que evalúan, en orden de importancia:

- **Betreibungsregisterauszug (extracto del registro de deudas):** si tienes deudas ejecutadas en Suiza, estás prácticamente descartado. Si llegas nuevo, no tienes historial — lo que puede jugarte en contra o a favor dependiendo del propietario.
- **Solvencia:** el alquiler no debe superar el 30-33% de tu salario neto mensual. Si ganas 4.000 CHF y el piso cuesta 2.000 CHF, van a rechazarte aunque quieras pagarlo.
- **Estabilidad laboral:** contrato indefinido o lleva más de un año en la empresa. Contratos temporales generan desconfianza.
- **Permiso de residencia:** el C facilita mucho. El B es aceptado. El L es una bandera roja para muchos propietarios.

## El dossier que sí funciona

Esto es lo que aprendí a preparar y lo que recomiendo a todos mis clientes:

1. Carta de presentación personal (1 página, en alemán o francés si es posible): quién eres, dónde trabajas, por qué quieres ese piso, que eres un inquilino responsable.
2. Últimas 3 nóminas
3. Contrato de trabajo
4. Copia del permiso de residencia
5. Betreibungsregisterauszug (puedes pedirlo en la oficina cantonal, cuesta ~17 CHF)
6. Referencias del arrendador anterior (si las tienes de algún país)

Todo organizado, limpio, en PDF. No en carpeta de plástico. No en papel arrugado.

## Las alternativas cuando el mercado libre no funciona

**Wohnungsgenossenschaft (cooperativas de vivienda):** en ciudades como Zurich, hay cooperativas que ofrecen alquileres a precio por debajo del mercado. La espera puede ser larga (2-5 años en algunos casos), pero vale la pena inscribirse desde el principio.

**Plataformas de habitaciones:** para los primeros meses, WG-Zimmer.ch y Homegate te dan opciones de habitaciones compartidas. No es ideal, pero es la forma de llegar y luego buscar piso con solvencia local ya demostrada.

**Expatriados y comunidades latinas:** Grupos de Facebook y Telegram de latinos en Suiza frecuentemente tienen avisos de personas que dejan pisos y recomiendan a conocidos como sustitutos. Funciona más de lo que parece.

La vivienda en Suiza no es imposible. Es un juego de timing, presentación y red de contactos. ¿Quieres que te ayude a preparar tu dossier antes de llegar?`,
  },
  {
    category: 'Noticias Suiza',
    imageQuery: 'Switzerland politics parliament news',
    title: 'Lo que está cambiando para los inmigrantes en Suiza en 2025',
    excerpt:
      'Nuevas normativas de integración, cambios en el mercado laboral y actualizaciones que afectan directamente a quienes llegan o ya viven en Suiza.',
    content: `Suiza no es estática. Las leyes de migración, los requisitos de integración y el mercado laboral se actualizan constantemente. Y la mayoría de mis clientes se enteran tarde.

Aquí un resumen honesto de lo que está cambiando y cómo te afecta.

## Acuerdos de integración: cada vez más estrictos

En los últimos años, varios cantones han reforzado los llamados Integrationsvereinbarungen — acuerdos de integración que se firman al obtener el permiso de residencia.

En la práctica: si llegas con B, en muchos cantones tendrás que firmar un compromiso de aprender el idioma local y participar en programas de integración. El incumplimiento puede afectar la renovación del permiso.

Lo que esto significa para ti: si planeas llegar y "ya veré lo del alemán", la ventana de tolerancia se está cerrando. Llega con por lo menos A2 en proceso.

## Mercado laboral: demanda alta en sectores específicos

A pesar de la incertidumbre económica global, Suiza mantiene tasas de desempleo por debajo del 2.5%. La demanda es especialmente alta en:

- **Sanidad:** enfermería, cuidado de ancianos, fisioterapia. La escasez es crítica y los sueldos han subido.
- **Construcción e ingeniería:** proyectos de infraestructura masivos hasta 2030 (ampliaciones ferroviarias, renovación energética de edificios).
- **IT y ciberseguridad:** el hub tecnológico de Zurich sigue creciendo. Los perfiles de seguridad informática están especialmente demandados.

## Digitalización de trámites migratorios

Varios cantones han avanzado en digitalizar las solicitudes de permiso y renovación. Ya no es necesario ir en persona para todos los trámites. Esto es positivo, pero también significa que los errores en formularios online son más difíciles de corregir que en ventanilla.

Mi recomendación: antes de enviar cualquier formulario digital de migración, revísalo con alguien que conozca el proceso. Un campo incorrecto puede retrasar meses una renovación.

## Lo que no ha cambiado y no cambiará fácilmente

La neutralidad suiza, la estabilidad institucional, el franco como divisa fuerte, el sistema de salud, la calidad de vida. Suiza sigue siendo uno de los destinos de migración más seguros y estables del mundo.

Las reglas cambian, pero el destino sigue siendo válido. Lo que sí necesitas es información actualizada antes de tomar decisiones importantes.

¿Quieres revisar cómo los cambios actuales afectan tu situación específica? Cuéntame tu caso.`,
  },
  {
    category: 'Cultura y adaptación',
    imageQuery: 'Swiss village culture traditional Alps',
    title: 'Los 6 choques culturales reales que nadie te avisa antes de llegar a Suiza',
    excerpt:
      'Llegar a Suiza con expectativas de Europa mediterránea es la receta perfecta para el desencanto inicial. Te cuento lo que viví yo y lo que veo en mis clientes.',
    content: `Cuando llegué a Suiza pensé que Europa era Europa. Que la calidez latina me adaptaría rápido. Que sería fácil hacer amigos.

Tardé 8 meses en entender por qué me sentía tan solo a pesar de estar rodeado de gente amable.

Esto es lo que no te cuentan en los vlogs de lifestyle.

## 1. El silencio no es frialdad — es respeto

En el ascensor, en el tren, en la calle: los suizos no hablan con desconocidos. No porque sean antisociales. Porque tienen un concepto de espacio personal y silencio completamente distinto al latino.

Intentar romper el hielo con un desconocido en el tren de Zurich a las 8am te va a dar una mirada de confusión genuina. No es descortesía — es cultura.

## 2. La Ruhezeit existe y se respeta

De 22h a 6am (y los domingos todo el día en muchos edificios), el ruido es socialmente inaceptable. No se tiende ropa en balcones los domingos en algunos cantones. No se pasa la aspiradora después de las 10pm.

Esto no está escrito en ninguna ley federal única — varía por edificio y cantón. Pero romperlo te crea problemas inmediatos con los vecinos y, eventualmente, con el casero.

## 3. La puntualidad no es sugerencia

Si quedas a las 19:30, llegar a las 19:35 ya es tarde y lo notarán. En reuniones de trabajo, llegar 5 minutos antes es lo normal. Llegar a la hora exacta ya es casi tardanza.

Esta no es exageración. Es una diferencia cultural real que afecta tu reputación profesional y personal de forma silenciosa pero constante.

## 4. La amistad se construye lento, pero dura

Los suizos no son fáciles de amigos en el sentido latino. Pero cuando alguien te invita a su casa, significa algo real. La confianza se construye con años, no con cenas.

Lo que funciona: actividades regulares (clubs deportivos, asociaciones, grupos de idioma). El Verein (asociación) es la forma suiza de socializar. Únete a uno relacionado con algo que te guste — de ahí salen las amistades reales.

## 5. La separación de cuentas es literal

En una cena de grupo, cada quien paga lo suyo. Exacto. No hay "lo pago yo y la próxima vez pagas tú". No hay redondeos generosos. Es una expresión de independencia e igualdad, no de mezquindad.

Adaptarte a esto evita momentos incómodos y malentendidos con colegas y nuevos conocidos.

## 6. El alemán suizo no es el alemán que estudiaste

El Schweizerdeutsch es un dialecto oral que no tiene norma escrita estándar y varía por cantón. Lo que aprendes en clase (Hochdeutsch) te servirá para leer, escribir y hacerte entender. Pero en conversaciones cotidianas con suizos, vas a necesitar tiempo de exposición.

La buena noticia: los suizos cambian al Hochdeutsch cuando se dan cuenta de que eres extranjero. Son más pacientes con el idioma de lo que parece.

La adaptación cultural lleva tiempo. No te juzgues si al principio te sientes desorientado — es completamente normal. Si quieres hablar de cómo acelerar ese proceso de integración, estoy aquí.`,
  },
  {
    category: 'Emprendimiento',
    imageQuery: 'Zurich startup business office modern',
    title: 'Crear una empresa en Suiza como extranjero: lo que nadie te cuenta del papeleo',
    excerpt:
      'Suiza tiene una economía abierta y estable para emprender. Pero el proceso tiene más pasos de los que muestran los artículos optimistas de internet.',
    content: `"Suiza es perfecta para tener una empresa" — lo leo constantemente. Es verdad. Pero la versión que no te cuentan es que para llegar a tener esa empresa funcionando, hay que pasar por un proceso que requiere tiempo, dinero y burocracia cantonal.

Aquí lo que yo he visto de primera mano.

## Las tres formas jurídicas que te interesan

**Einzelfirma (empresa individual)**

La forma más simple. No requiere capital mínimo. Te registras en el Registro Cantonal del Comercio si tus ingresos superan 100.000 CHF al año (por debajo de ese umbral, no es obligatorio aunque sí recomendable). Tú y la empresa sois la misma entidad legal — responsabilidad ilimitada.

Ideal para: freelancers, consultores, servicios digitales.

**GmbH (Sociedad de Responsabilidad Limitada)**

Requiere un capital mínimo de 20.000 CHF depositado en cuenta bancaria al momento de la constitución. La responsabilidad está limitada al capital. Es la forma preferida para empresas con empleados y facturas B2B.

El proceso: notario, Registro del Comercio, apertura de cuenta comercial (que cada vez cuesta más conseguir en Suiza siendo extranjero sin historial).

Coste total de constitución: entre 1.500 y 3.000 CHF contando honorarios notariales y registro.

**AG (Sociedad Anónima)**

Para cuando ya vas en serio: capital mínimo de 100.000 CHF (50.000 desembolsados). Menos frecuente para primeras empresas.

## El obstáculo que más subestiman: la cuenta bancaria

Los bancos suizos tradicionales (UBS, Credit Suisse, Raiffeisen) se han vuelto muy restrictivos con la apertura de cuentas para empresas de extranjeros sin historial local. Pueden pedir años de extractos, planes de negocio detallados, y aún así rechazarte.

Alternativas que están funcionando: Neon Business, Wise Business, Revolut Business, Multitude Bank. No son bancos suizos tradicionales, pero son válidos y mucho más accesibles.

## El tema fiscal que nadie explica bien

En Suiza, los impuestos sobre sociedades varían por cantón. Zug es famoso por ser el cantón más bajo (algunos años bajo del 12%). Zurich está alrededor del 21%. Ginebra algo más alto.

Esto explica por qué tantas empresas internacionales tienen sede en Zug aunque operen desde Zurich.

Como extranjero con empresa, además de los impuestos societarios, gestionarás el IVA (si superas 100.000 CHF de facturación), las contribuciones AHV de empleados y el impuesto sobre tu salario personal.

## Lo que necesitas tener claro antes de empezar

- ¿Qué tipo jurídico encaja con tu actividad?
- ¿En qué cantón te conviene registrarte según tu sector y residencia?
- ¿Tienes ya una cuenta bancaria donde depositar el capital?
- ¿Necesitas un abogado o es suficiente con una fiduciaria (Treuhand)?

Si estás en fase de planificación, una consulta de orientación te puede ahorrar meses de errores y dinero innecesario.`,
  },
  {
    category: 'Impuestos',
    imageQuery: 'finance tax documents Swiss franc',
    title: 'Declaración de impuestos en Suiza: la guía clara para tu primer año',
    excerpt:
      'El sistema fiscal suizo parece laberíntico al principio. Pero una vez entiendes la lógica cantonal y qué sistema te aplica, todo se simplifica.',
    content: `Mi primer año en Suiza no hice la declaración de impuestos. Pensé que con el Quellensteuer (retención en origen) era suficiente.

Resultado: perdí deducciones por valor de varios cientos de francos que no recuperé.

No cometas ese error.

## Los dos sistemas que existen y cuál te aplica

**Quellensteuer (retención en la fuente)**

Si tienes permiso B y no estás casado con ciudadano suizo, tu empleador retiene automáticamente los impuestos de tu salario cada mes. No tienes que hacer nada adicional para cumplir con Hacienda — el sistema lo hace por ti.

Pero atención: esto no significa que no puedas presentar una declaración voluntaria para recuperar deducciones. Si tus gastos deducibles son significativos, puedes y debes hacerlo.

A partir de 120.000 CHF de salario bruto anual, la declaración pasa a ser obligatoria aunque tengas permiso B.

**Declaración ordinaria (ordentliche Veranlagung)**

Si tienes permiso C, si superas los 120.000 CHF, o si tienes ingresos fuera de la relación laboral (alquileres, inversiones, freelance), pasas al sistema de declaración ordinaria. Aquí sí tienes que presentar tu declaración anual.

El plazo habitual: 31 de marzo del año siguiente (con posibilidad de prórroga solicitada).

## Qué puedes deducir y que la mayoría no aprovecha

- **Gastos de desplazamiento al trabajo:** el coste real de tu abono de transporte público o la distancia en coche (con límite cantonal)
- **Comidas fuera de casa:** si tu empresa no tiene cantina o no da bono comida, hay una deducción por comidas
- **Gastos de formación profesional:** cursos, libros, certificaciones relacionadas con tu trabajo
- **Primas del seguro de salud:** parte de las primas KVG son deducibles
- **Contribuciones al 3er pilar (3a):** hasta el máximo legal anual (~7.000 CHF para empleados) — esta es la deducción más potente y más ignorada por los recién llegados
- **Gastos de mudanza** si cambiaste de domicilio por motivos laborales

## La herramienta que uso yo

Cada cantón tiene su propio software de declaración gratuito. En Zurich es ZHPersönlich. En Vaud es VaudTax. Búscalo por el nombre de tu cantón.

Existen también fiduciarias y aplicaciones como TaxMe o GetYourTax que hacen la declaración por ti por un precio razonable (80-200 CHF). Si tu situación no es compleja, el software cantonal es suficiente.

## El tercer pilar: lo que más arrepentimiento genera no haberlo abierto antes

El 3er pilar (Säule 3a) es un plan de ahorro privado para la jubilación. Cada franco que metes es deducible de la base imponible.

Si ganas 70.000 CHF al año y metes el máximo (~7.000 CHF), reduces tu base imponible en 7.000 CHF. En un cantón con tipo impositivo del 20%, eso son 1.400 CHF menos de impuestos ese año.

El dinero no lo ves hasta la jubilación (o en casos especiales: compra de vivienda propia, abandonar Suiza, inicio de actividad autónoma). Pero el ahorro fiscal anual es inmediato.

Ábrete una cuenta 3a en tu primer año. Ya. Aunque sean 100 CHF al mes.

¿Tienes dudas sobre tu situación fiscal específica? No soy asesor fiscal, pero en una consulta de orientación te ayudo a entender qué sistema te aplica y a quién deberías consultar según tu caso.`,
  },
]

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = []

  for (const article of ARTICLES) {
    try {
      const imageUrl = await fetchUnsplashImage(article.imageQuery)
      const slug = makeSlug(article.title)

      await prisma.blogPost.create({
        data: {
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          tags: [],
          imageUrl: imageUrl ?? null,
          published: true,
          aiGenerated: false,
          sourceUrl: null,
          sourceTitle: null,
        },
      })

      results.push({ category: article.category, title: article.title, hasImage: !!imageUrl })
    } catch (err) {
      results.push({
        category: article.category,
        title: article.title,
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  return NextResponse.json({
    success: true,
    created: results.filter((r) => !('error' in r)).length,
    failed: results.filter((r) => 'error' in r).length,
    results,
  })
}
