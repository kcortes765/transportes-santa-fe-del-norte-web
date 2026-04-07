# Sitio web listo para publicar

La carpeta publicable es esta misma: `site/`.

## Despliegue

Sube el contenido completo de `site/` a tu hosting estático o tradicional. No requiere build.

## Reemplazos obligatorios antes de publicar

Busca y reemplaza estos placeholders:

- `{{PHONE}}`
- `{{WHATSAPP}}`
- `{{EMAIL}}`
- `{{ADDRESS}}`
- `{{DOMAIN}}`
- `{{FORM_ENDPOINT}}`

## Dónde cambiar cada cosa

- Contacto directo y endpoint del formulario: `assets/js/main.js`
- SEO principal del home: `index.html`
- Canonical y metadatos de páginas auxiliares: `index.html`, `privacidad.html`
- Dominio del sitemap y robots: `sitemap.xml`, `robots.txt`
- Iconos y preview social: `assets/img/brand/`
- Logo horizontal: `assets/img/brand/logo.jpeg`

## Notas

- Mientras `{{FORM_ENDPOINT}}` siga sin reemplazo, el formulario mostrará una advertencia y no enviará datos.
- La sección de experiencia está resuelta de forma conservadora. Solo agrega logos o nombres de clientes si existe autorización explícita.
- Si el dominio final no cuelga del root, ajusta `start_url` y `scope` en `site.webmanifest`.
