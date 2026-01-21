import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { Customer } from './CustomerAuth';

interface HeaderProps {
  cartItems: number;
  onCartClick: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  customer: Customer | null;
  onCustomerClick: () => void;
}

export function Header({ cartItems, onCartClick, isMobileMenuOpen, onMobileMenuToggle, customer, onCustomerClick }: HeaderProps) {
  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img 
              src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" 
              alt="MAGOTECH Logo" 
              className="h-20 md:h-24 lg:h-28 xl:h-32 w-auto"
            />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 flex-shrink-0">
            <a href="#" className="hover:text-green-500 transition-colors whitespace-nowrap">Smartphones</a>
            <a href="#" className="hover:text-green-500 transition-colors whitespace-nowrap">Laptops</a>
            <a href="#" className="hover:text-green-500 transition-colors whitespace-nowrap">Acessórios</a>
            <a href="#" className="hover:text-green-500 transition-colors whitespace-nowrap">Gaming</a>
            <a href="#" className="hover:text-green-500 transition-colors whitespace-nowrap">Ofertas</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar produtos..." 
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-green-500 relative"
              onClick={onCustomerClick}
            >
              <User className="h-5 w-5" />
              {customer && (
                <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500 text-black">
                  <span className="sr-only">Logado</span>
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-green-500 relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-500 text-black">
                  {cartItems}
                </Badge>
              )}
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={onMobileMenuToggle}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-black text-white border-gray-800" aria-describedby={undefined}>
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img 
                      src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" 
                      alt="MAGOTECH Logo" 
                      className="h-16 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    <a 
                      href="#" 
                      className="text-lg hover:text-green-500 transition-colors py-2 px-4 hover:bg-gray-800 rounded-lg"
                      onClick={onMobileMenuToggle}
                    >
                      Smartphones
                    </a>
                    <a 
                      href="#" 
                      className="text-lg hover:text-green-500 transition-colors py-2 px-4 hover:bg-gray-800 rounded-lg"
                      onClick={onMobileMenuToggle}
                    >
                      Laptops
                    </a>
                    <a 
                      href="#" 
                      className="text-lg hover:text-green-500 transition-colors py-2 px-4 hover:bg-gray-800 rounded-lg"
                      onClick={onMobileMenuToggle}
                    >
                      Tablets
                    </a>
                    <a 
                      href="#" 
                      className="text-lg hover:text-green-500 transition-colors py-2 px-4 hover:bg-gray-800 rounded-lg"
                      onClick={onMobileMenuToggle}
                    >
                      Acessórios
                    </a>
                    <a 
                      href="#" 
                      className="text-lg hover:text-green-500 transition-colors py-2 px-4 hover:bg-gray-800 rounded-lg"
                      onClick={onMobileMenuToggle}
                    >
                      Gaming
                    </a>
                    <a 
                      href="#" 
                      className="text-lg hover:text-green-500 transition-colors py-2 px-4 hover:bg-gray-800 rounded-lg"
                      onClick={onMobileMenuToggle}
                    >
                      Ofertas
                    </a>
                  </nav>

                  <Separator className="bg-gray-700" />

                  {/* Mobile Search */}
                  <div className="px-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Buscar produtos..." 
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-3 px-4">
                    <Button 
                      variant="ghost" 
                      className="justify-start text-white hover:text-green-500 hover:bg-gray-800"
                      onClick={() => {
                        onCustomerClick();
                        onMobileMenuToggle();
                      }}
                    >
                      <User className="h-5 w-5 mr-3" />
                      {customer ? `Olá, ${customer.name.split(' ')[0]}` : 'Minha Conta'}
                      {customer && (
                        <Badge className="ml-auto bg-green-500 text-black">
                          Online
                        </Badge>
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-white hover:text-green-500 hover:bg-gray-800 relative"
                      onClick={() => {
                        onCartClick();
                        onMobileMenuToggle();
                      }}
                    >
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      Carrinho
                      {cartItems > 0 && (
                        <Badge className="ml-auto bg-green-500 text-black">
                          {cartItems}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Support Section */}
                  <div className="px-4">
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">Precisa de ajuda?</p>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-black"
                        onClick={() => {
                          window.open('https://wa.me/5579998628286', '_blank');
                          onMobileMenuToggle();
                        }}
                      >
                        <span className="mr-2">📱</span>
                        Falar no WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search - Only show when menu is closed */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar produtos..." 
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}