# Adonis fullstack application

Aplicação para cidades inteligentes que usa dados de incidência criminal da cidade de Chicago no EUA. A aplicação se comunica com a Plataforma Interscity para carregar os dados.

Esta é uma aplicação Adonis fullstack.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the intercrimes

```bash
https://github.com/alfredocoj/intercrime.git 
```

e então execute

```bash
npm install 
```

### Migrations

Execute o seguinte comando para iniciar os migrations.

```js
adonis migration:run
```

### Iniciar a aplicação:

Execute o seguinte comando para iniciar a aplicação.
```js
adonis serve --dev
```
