import { Client } from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'neuro123',
    database: process.env.DB_NAME || 'paralelo14',
    port: Number(process.env.DB_PORT || 5432),
  });

  try {
    console.log('Conectando ao banco de dados...');
    await client.connect();

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\nConexão estabelecida com sucesso!');
    console.log('\nTabelas no banco de dados:');
    console.log('===================================================');

    if (result.rows.length > 0) {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
      console.log('===================================================');
      console.log(`\nTotal de tabelas: ${result.rows.length}`);
    } else {
      console.log('Nenhuma tabela encontrada.');
    }
  } catch (error) {
    console.error('\nErro ao conectar ao banco de dados:');
    console.error(error.message);
    if (error.code) console.error(`Código: ${error.code}`);
  } finally {
    await client.end().catch(() => {});
    console.log('\nConexão fechada.');
  }
}

testDatabase();
