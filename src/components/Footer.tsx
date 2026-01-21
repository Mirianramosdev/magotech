import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" 
              alt="MAGOTECH Logo" 
              className="h-16 w-auto"
            />
            <p className="text-gray-400 text-sm">
              Mago Tech - Assistência Técnica e Soluções Tecnológicas.
              Transformando a tecnologia em experiências incríveis.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-500">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-500">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-500">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-500">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-green-500">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Produtos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ofertas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Assistência Técnica</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-green-500">Categorias</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smartphones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Notebooks</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tablets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Acessórios</a></li>
            </ul>
            
            {onAdminClick && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAdminClick}
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-600 transition-colors"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              </div>
            )}
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-green-500">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>(79) 99914-3853</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>magotech25@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Av. Josias de Carvalho<br />Salgado, 49390-000<br />SE, BR</span>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm mb-2">Newsletter</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Seu e-mail" 
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="text-center md:text-left">
            <p>&copy; 2024 MAGOTECH. Todos os direitos reservados.</p>
            <p className="text-xs mt-1">CNPJ: 47.322.216/0001-37</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a>
          </div>
        </div>
      </div>
    </footer>
  );
}