# tomi.science

## Running

### Frontend

Next.js + socket.io.

- Install packages: `npm ci`
- In development: `npm run dev`
- In production: `npm run build && npm start`

### Backend

Express + socket.io + slonik. You need a Postgres db (you can use docker compose).

- Install packages: `npm ci`
- Run migrations `npm run migrate -- up`
- In development: `npm run dev`
- In production `NODE_ENV=production npm start`

## Author

Jan Tuomi <<jans.tuomi@gmail.com>>
