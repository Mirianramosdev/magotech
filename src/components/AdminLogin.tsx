import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  error?: string;
}

export function AdminLogin({ onLogin, error }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-3 sm:p-4 md:p-6">
      <Card className="w-full max-w-md sm:max-w-sm md:max-w-md bg-white border-gray-200 shadow-2xl">
        <CardHeader className="text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <img 
              src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" 
              alt="MAGOTECH Logo" 
              className="h-12 sm:h-14 md:h-16 w-auto"
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl md:text-2xl text-gray-900 flex-wrap">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
              <span>Painel Administrativo</span>
            </CardTitle>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">Acesso restrito ao CEO</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ceo@magotech.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-sm sm:text-base h-9 sm:h-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base h-9 sm:h-10 mt-2 sm:mt-3"
              size="lg"
            >
              Entrar no Painel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}