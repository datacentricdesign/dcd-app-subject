# dcd-data-subject

## production mode

- **src/index.html** => `<base href="/subject/">`
- **src/classes.ts** => `export const server_url = ""`
- `npm run prod`


## development mode

- **src/index.html** => `<base href="/">`
- **src/classes.ts** => `//export const server_url = "http://localhost:8080/subject/"`
- `npm run dev`