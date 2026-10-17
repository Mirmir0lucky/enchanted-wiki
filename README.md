## Basic Wiki Project

```bash
npm install
npm run setup
npm run dev
```

- `npm run setup` prompts you for an admin username and password, then creates the `.env` file.
- If you prefer not to be prompted, copy `.env.example` to `.env`. Default login credentials: `admin` / `1234`. Change them before deploying to production.

**URLs:**

- Wiki: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)