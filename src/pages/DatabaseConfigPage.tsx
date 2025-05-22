
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DatabaseConfig } from "@/types/auth";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  loadDatabaseConfig, 
  saveDatabaseConfig,
  testDatabaseConnection 
} from "@/services/databaseService";

export default function DatabaseConfigPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  const [config, setConfig] = useState<DatabaseConfig>(loadDatabaseConfig());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'port') {
      setConfig(prev => ({ ...prev, [name]: Number(value) }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setConfig(prev => ({ ...prev, [name]: checked }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testDatabaseConnection(config);
      setTestResult(result);
      
      toast({
        title: "Teste de conexão",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error testing connection:", error);
      
      setTestResult({
        success: false,
        message: "Erro ao testar a conexão."
      });
      
      toast({
        title: "Erro de conexão",
        description: "Ocorreu um erro ao testar a conexão com o banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveConfig = () => {
    setIsSubmitting(true);
    
    try {
      saveDatabaseConfig(config);
      
      toast({
        title: "Configurações salvas",
        description: "Configurações do banco de dados salvas com sucesso!",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificar se o usuário é admin, se não for, mostrar mensagem informativa
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Negado</AlertTitle>
            <AlertDescription>
              Você não tem permissão para acessar esta página. Apenas administradores podem configurar conexões de banco de dados.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Configuração do Banco de Dados</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Configuração MySQL</CardTitle>
            <CardDescription>
              Configure os parâmetros de conexão para o banco de dados MySQL
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  name="host"
                  placeholder="localhost"
                  value={config.host}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">Porta</Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  placeholder="3306"
                  value={config.port}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="database">Nome do Banco</Label>
              <Input
                id="database"
                name="database"
                placeholder="meu_banco"
                value={config.database}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                name="username"
                placeholder="root"
                value={config.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={config.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="ssl" 
                name="ssl"
                checked={config.ssl} 
                onCheckedChange={(checked) => setConfig(prev => ({...prev, ssl: checked}))}
              />
              <Label htmlFor="ssl">Usar SSL</Label>
            </div>
            
            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Teste de Conexão</AlertTitle>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={testConnection}
              disabled={isTesting}
              className="w-full sm:w-auto"
            >
              {isTesting ? "Testando..." : "Testar Conexão"}
            </Button>
            <Button 
              type="button" 
              onClick={saveConfig}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
