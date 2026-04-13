const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Test connection by executing a simple query
    const result = await prisma.
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    ;
    
    console.log('\n✓ Conexão estabelecida com sucesso!');
    console.log('\nTabelas no banco de dados:');
    console.log('=' + '='.repeat(49) + '=');
    
    if (result.length > 0) {
      result.forEach((row, index) => {
        console.log(${index + 1}. );
      });
      console.log('=' + '='.repeat(49) + '=');
      console.log(\nTotal de tabelas: );
    } else {
      console.log('Nenhuma tabela encontrada.');
    }
    
  } catch (error) {
    console.error('\n✗ Erro ao conectar ao banco de dados:');
    console.error('Mensagem completa do erro:');
    console.error(error.message);
    if (error.code) console.error(Código: );
    if (error.stack) console.error(Stack: );
  } finally {
    await prisma.();
    console.log('\nConexão fechada.');
  }
}

testDatabase();
