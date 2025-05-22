
import { DatabaseConfig } from "@/types/auth";

/**
 * Carrega a configuração do banco de dados salva
 */
export const loadDatabaseConfig = (): DatabaseConfig => {
  return {
    host: localStorage.getItem('db_host') || '',
    port: Number(localStorage.getItem('db_port')) || 3306,
    database: localStorage.getItem('db_name') || '',
    username: localStorage.getItem('db_username') || '',
    password: localStorage.getItem('db_password') || '',
    ssl: localStorage.getItem('db_ssl') === 'true'
  };
};

/**
 * Salva a configuração do banco de dados
 */
export const saveDatabaseConfig = (config: DatabaseConfig): void => {
  localStorage.setItem('db_host', config.host);
  localStorage.setItem('db_port', config.port.toString());
  localStorage.setItem('db_name', config.database);
  localStorage.setItem('db_username', config.username);
  localStorage.setItem('db_password', config.password);
  localStorage.setItem('db_ssl', config.ssl.toString());
};

/**
 * Teste de conexão com o banco de dados
 * Em um ambiente real, isso seria feito através de uma API
 */
export const testDatabaseConnection = async (config: DatabaseConfig): Promise<{success: boolean; message: string}> => {
  // Simulando um teste de conexão
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Verificando se os dados essenciais foram preenchidos
  if (!config.host || !config.database || !config.username) {
    return {
      success: false,
      message: "Preencha todos os campos obrigatórios (host, banco de dados e usuário)."
    };
  }
  
  // Simulando uma conexão bem sucedida
  return {
    success: true,
    message: "Conexão com o banco de dados estabelecida com sucesso."
  };
};
