# Steps to build
1. Get API keys from tmdb
2. setup .env file as :
    ```
        DATABASE_URL="file:./db.sqlite"
        TMDB_KEY=YOUR_KEY
        TMDB_READ_TOKEN=YOUR_TOKEN
    ```
3. run `npm install`
4. run `npx prisma db push`
5. run `npm run build`
6. run `npm start`
7. goto `localhost:3000`