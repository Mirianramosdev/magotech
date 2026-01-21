import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate?: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface CustomerAuthProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => Promise<Customer>;
  onRegister: (customerData: Omit<Customer, 'id' | 'registrationDate' | 'totalOrders' | 'totalSpent' | 'status'> & { password: string }) => Promise<void>;
  customers: Customer[];
}

export function CustomerAuth({ 
  isOpen, 
  onOpenChange, 
  onLogin, 
  onRegister, 
  customers 
}: CustomerAuthProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      await onLogin(loginData.email, loginData.password);
      onOpenChange(false);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      // Validações
      if (registerData.password.length < 6) {
        setLoginError('A senha deve ter pelo menos 6 caracteres');
        setIsLoading(false);
        return;
      }

      if (registerData.password !== registerData.confirmPassword) {
        setLoginError('As senhas não coincidem');
        setIsLoading(false);
        return;
      }

      if (customers.find(c => c.email === registerData.email)) {
        setLoginError('Este email já está cadastrado');
        setIsLoading(false);
        return;
      }

      // Criar novo cliente
      const newCustomer = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        address: registerData.address,
        birthDate: registerData.birthDate,
        password: registerData.password,
        lastLogin: new Date().toISOString()
      };

      await onRegister(newCustomer);
      onOpenChange(false);
      setRegisterData({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Erro ao criar conta');
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center">Área do Cliente</DialogTitle>
          <DialogDescription className="text-center">
            Faça login ou cadastre-se para acessar sua conta e acompanhar seus pedidos
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Fazer Login</CardTitle>
                <p className="text-sm text-gray-600 text-center">
                  Acesse sua conta para acompanhar pedidos
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {loginError}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Não tem uma conta? <span className="text-green-600 cursor-pointer" onClick={() => setActiveTab('register')}>Cadastre-se aqui</span>
                    </p>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <p><strong>Para testar com contas existentes:</strong></p>
                      <p>Use: joao@email.com, maria@email.com ou carlos@email.com</p>
                      <p>Senha: cliente123</p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Criar Conta</CardTitle>
                <p className="text-sm text-gray-600 text-center">
                  Cadastre-se para uma experiência personalizada
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-name"
                        placeholder="Seu nome completo"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Telefone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-phone"
                        placeholder="(11) 99999-9999"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-address">Endereço *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-address"
                        placeholder="Rua, número, bairro, cidade"
                        value={registerData.address}
                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-birth">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-birth"
                        type="date"
                        value={registerData.birthDate}
                        onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha * (mínimo 6 caracteres)</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha segura"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pr-10"
                        minLength={6}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirmar Senha *</Label>
                    <Input
                      id="register-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {loginError}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Ao criar uma conta, você concorda com nossos termos de uso
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}