# Exzly

- [Exzly](#exzly)
  - [Installation](#installation)
  - [Migration](#migration)

## Installation

```bash
npm install
```

## Migration

```bash
npx sequelize-cli db:migrate --name base-1.0.0.js
```

```bash
npx sequelize-cli db:seed --seed start
```

```bash
npx sequelize-cli db:seed --seed demo
```

| Hostname       | TTL   | Type | Value/Destination |
| -------------- | ----- | ---- | ----------------- |
| central.my.id. | 14400 | MX   | central.my.id     |

LICENSE [MIT](./LICENSE)
