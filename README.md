# COTEMAR - PRONTOS PAGOS

## Detalles
Éste proyecto contiene dos aplicativos distintos: un **approuter** para exponer y disponibilizar documentación y el **backend** para crear el servidor.

Ambos aplicativos están protegidos con seguridad (XSUAA, OAuth 2), por lo tanto para acceder a ellos es necesario contar con ciertas credenciales.

Además de la anterior, se bindea al **backend** con determinadas **instancias** de **BTP**
- **application-logs**: para guardar logs históricos de la app.
- **destination**: para consumir destinations definidas en BTP.
- **connectivity**: para leer configuraciones asociadas a la autenticación y al servidor proxy que manejará las peticiones HTTP. 

## Arquitectura Hexagonal
El **backend** sigue tal estructura para que el desarrollo sea prolijo y ordenado. Se detalla brevemente con el fin de facilitar la comprensión a los demás desarrolladores (o quien visite éste repositorio).

Se divide el proyecto en **capas**. Las superiores dependen directamente de las inferiores. Idealmente, las partes no deberían comunicarse con elementos de capas superiores, sólo con las de su nivel o las que estén por debajo. Ésta arquitectura busca desacoplar el desarrollo de tecnologías, servicios y/o plataformas.

- Capa de infraestuctura: entrada y salida de datos (controladores, rutas, validaciones).
- Capa de aplicación: lógica de negocio, casos de uso específicos del aplicativo.
- Capa de dominio: núcleo de la aplicación, desacoplado por puertos y adaptadores, forma el modelo de datos (entidades, servicios, repositorios).
- Puertos (interfaces): definen el comportamiento (métodos) de los distintos repositorios.
- Adaptadores (repositorios): implementación de un puerto, se adaptan al comportamiento del mismo.

## Documentación
La **API REST** desarrollada dentro del servidor está documentada con **Swagger**, definiendo endpoints, respuestas y schemas.
Como el **backend** cuenta con seguridad, se ha creado el **approuter** mencionado previamente con el único fin de brindar acceso a la misma. Seguir [éste link](https://prontospagosapprouter.cfapps.us10.hana.ondemand.com/) para visualizarlo en detalle.

## Requisitos
- Configurar a nivel entorno las variables de usuario **DESTINATION_WORKFLOW**, **WORKFLOW_DEFINITION_ID** y **DESTINATION_310_ID** con sus valores correspondientes.

## NOMENCLATURA PARA COMMITS
Se utilizan palabras clave como prefijos para nombrar los commits de forma tal que represente lo más fiel posible los cambios.
- feature/{...}: para nuevas funcionalidades o comportamiento.
- update/{...}: para registrar una actualización de cierto código.
- modify/{...}: ídem anterior.
- refactor/{...}: para cambios relativos a mejoras y optimización de código.
- bugfix/{...}: para resolver pequeños errores que no afectan de forma crítica el ciclo de vida del programa.
- hotfix/{...}: para resolver pequeños errores que afectan de forma crítica el ciclo de vida del programa.