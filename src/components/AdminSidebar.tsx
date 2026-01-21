import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut, 
  Home,
  Warehouse,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ 
  activeSection, 
  onSectionChange, 
  onLogout, 
  isMobile = false,
  onClose 
}: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'inventory', label: 'Estoque', icon: Warehouse },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'analytics', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <img 
          src="https://i.postimg.cc/BZYqNzjQ/Logo-Mago-teech.png" 
          alt="MAGOTECH Logo" 
          className="h-20 w-auto mx-auto"
        />
        {!isMobile && (
          <p className="text-center text-sm text-gray-400 mt-2">Painel Administrativo</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    isActive 
                      ? "bg-green-600 text-black hover:bg-green-700" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="bg-gray-800" />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}