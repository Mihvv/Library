import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/auth/login', async (req, res) => {
  res.json({ id: 1, email: "test@test.com", token: "jwt.token.here" });
});

app.get('/books', async (_, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
});

app.listen(4000, () => console.log("Backend running on port 4000"));