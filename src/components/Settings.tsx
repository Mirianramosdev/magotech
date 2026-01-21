import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { 
  Store, 
  Bell, 
  Settings as SettingsIcon, 
  Shield,
  Save,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle
} from 'lucide-react';

interface StoreSettings {
  storeName: string;
  storeSlogan: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  storeWebsite: string;
  storeAddress: string;
  businessHours: string;
}

interface NotificationSettings {
  emailOnNewOrder: boolean;
  emailOnLowStock: boolean;
  whatsappOnNewOrder: boolean;
  dailyReportEmail: boolean;
}

interface GeneralSettings {
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  defaultShippingCost: number;
}

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings from localStorage
  const loadSettings = () => {
    const saved = localStorage.getItem('magotech_settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return getDefaultSettings();
  };

  const getDefaultSettings = () => ({
    store: {
      storeName: 'Mago Tech',
      storeSlogan: 'Assistência Técnica e Soluções Tecnológicas',
      storeDescription: 'Mago Tech - Assistência Técnica e Soluções Tecnológicas. Oferecemos os melhores serviços de assistência técnica, produtos tecnológicos de qualidade e soluções personalizadas para suas necessidades.',
      contactEmail: 'magotech25@gmail.com',
      contactPhone: '+55 79 99914-3853',
      whatsappNumber: '+5579999143853',
      storeWebsite: 'www.magotech.com.br',
      storeAddress: 'Av. Josias de Carvalho, Salgado, 49390-000, SE, BR',
      businessHours: 'Segunda a Sábado: 9h às 18h'
    },
    notifications: {
      emailOnNewOrder: true,
      emailOnLowStock: true,
      whatsappOnNewOrder: true,
      dailyReportEmail: false
    },
    general: {
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      taxRate: 0,
      defaultShippingCost: 0
    }
  });

  const [settings, setSettings] = useState(loadSettings());

  const handleStoreChange = (field: keyof StoreSettings, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      store: { ...prev.store, [field]: value }
    }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setSettings((prev: any) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  const handleGeneralChange = (field: keyof GeneralSettings, value: string | number) => {
    setSettings((prev: any) => ({
      ...prev,
      general: { ...prev.general, [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save to localStorage
    localStorage.setItem('magotech_settings', JSON.stringify(settings));

    setIsSaving(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefaults = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    localStorage.setItem('magotech_settings', JSON.stringify(defaults));
  };

  const handleClearLocalData = () => {
    // Clear all local storage data
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações da sua loja</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Check className="h-3 w-3 mr-1" />
              Salvo com sucesso!
            </Badge>
          )}
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">
            <Store className="h-4 w-4 mr-2" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Shield className="h-4 w-4 mr-2" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>Configure as informações básicas da sua loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    value={settings.store.storeName}
                    onChange={(e) => handleStoreChange('storeName', e.target.value)}
                    placeholder="MAGOTECH"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeSlogan">Slogan</Label>
                  <Input
                    id="storeSlogan"
                    value={settings.store.storeSlogan}
                    onChange={(e) => handleStoreChange('storeSlogan', e.target.value)}
                    placeholder="Tecnologia que Move o Futuro"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Descrição da Loja</Label>
                <Textarea
                  id="storeDescription"
                  value={settings.store.storeDescription}
                  onChange={(e) => handleStoreChange('storeDescription', e.target.value)}
                  placeholder="Descreva sua loja..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.store.contactEmail}
                    onChange={(e) => handleStoreChange('contactEmail', e.target.value)}
                    placeholder="contato@magotech.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.store.contactPhone}
                    onChange={(e) => handleStoreChange('contactPhone', e.target.value)}
                    placeholder="+55 79 99914-3853"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp (com código do país)</Label>
                  <Input
                    id="whatsappNumber"
                    value={settings.store.whatsappNumber}
                    onChange={(e) => handleStoreChange('whatsappNumber', e.target.value)}
                    placeholder="+5579999143853"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeWebsite">Website</Label>
                  <Input
                    id="storeWebsite"
                    value={settings.store.storeWebsite}
                    onChange={(e) => handleStoreChange('storeWebsite', e.target.value)}
                    placeholder="www.magotech.com.br"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Endereço Completo</Label>
                <Input
                  id="storeAddress"
                  value={settings.store.storeAddress}
                  onChange={(e) => handleStoreChange('storeAddress', e.target.value)}
                  placeholder="Av. Ivo do Prado, 424 - Centro, Aracaju - SE"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessHours">Horário de Funcionamento</Label>
                <Input
                  id="businessHours"
                  value={settings.store.businessHours}
                  onChange={(e) => handleStoreChange('businessHours', e.target.value)}
                  placeholder="Segunda a Sábado: 9h às 18h"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>Configure quando você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailOnNewOrder">Email em Novo Pedido</Label>
                  <p className="text-sm text-gray-500">Receba um email sempre que houver um novo pedido</p>
                </div>
                <Switch
                  id="emailOnNewOrder"
                  checked={settings.notifications.emailOnNewOrder}
                  onCheckedChange={(checked) => handleNotificationChange('emailOnNewOrder', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailOnLowStock">Email em Estoque Baixo</Label>
                  <p className="text-sm text-gray-500">Receba alertas quando produtos estiverem com estoque baixo</p>
                </div>
                <Switch
                  id="emailOnLowStock"
                  checked={settings.notifications.emailOnLowStock}
                  onCheckedChange={(checked) => handleNotificationChange('emailOnLowStock', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsappOnNewOrder">WhatsApp em Novo Pedido</Label>
                  <p className="text-sm text-gray-500">Receba notificação via WhatsApp para novos pedidos</p>
                </div>
                <Switch
                  id="whatsappOnNewOrder"
                  checked={settings.notifications.whatsappOnNewOrder}
                  onCheckedChange={(checked) => handleNotificationChange('whatsappOnNewOrder', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dailyReportEmail">Relatório Diário por Email</Label>
                  <p className="text-sm text-gray-500">Receba um resumo diário das vendas por email</p>
                </div>
                <Switch
                  id="dailyReportEmail"
                  checked={settings.notifications.dailyReportEmail}
                  onCheckedChange={(checked) => handleNotificationChange('dailyReportEmail', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure preferências gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Input
                    id="currency"
                    value={settings.general.currency}
                    onChange={(e) => handleGeneralChange('currency', e.target.value)}
                    placeholder="BRL"
                    disabled
                  />
                  <p className="text-xs text-gray-500">Código ISO da moeda</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Input
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                    placeholder="America/Sao_Paulo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Input
                    id="language"
                    value={settings.general.language}
                    onChange={(e) => handleGeneralChange('language', e.target.value)}
                    placeholder="pt-BR"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.general.taxRate}
                    onChange={(e) => handleGeneralChange('taxRate', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultShippingCost">Custo de Entrega Padrão (R$)</Label>
                <Input
                  id="defaultShippingCost"
                  type="number"
                  step="0.01"
                  value={settings.general.defaultShippingCost}
                  onChange={(e) => handleGeneralChange('defaultShippingCost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Ações avançadas e informações do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Restaurar Configurações Padrão</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Restaura todas as configurações para os valores padrão da MAGOTECH
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restaurar Padrões
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Restaurar Configurações Padrão?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá restaurar todas as configurações para os valores padrão da MAGOTECH. 
                          Suas configurações personalizadas serão perdidas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetToDefaults} className="bg-green-600 hover:bg-green-700">
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Zona de Perigo
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Ações irreversíveis que podem afetar seus dados
                  </p>
                  
                  <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 mb-2">Limpar Dados Locais</h5>
                    <p className="text-sm text-red-700 mb-4">
                      Esta ação irá remover TODOS os dados salvos localmente, incluindo:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 mb-4 list-disc list-inside">
                      <li>Produtos cadastrados</li>
                      <li>Clientes registrados</li>
                      <li>Pedidos realizados</li>
                      <li>Configurações personalizadas</li>
                      <li>Histórico e preferências</li>
                    </ul>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full md:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Limpar Todos os Dados
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            ATENÇÃO: Limpar Dados Locais
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação é <strong>IRREVERSÍVEL</strong> e irá:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Excluir TODOS os produtos</li>
                              <li>Excluir TODOS os clientes</li>
                              <li>Excluir TODOS os pedidos</li>
                              <li>Restaurar configurações padrão</li>
                              <li>Recarregar a página</li>
                            </ul>
                            <p className="mt-3 font-semibold">Você tem certeza absoluta?</p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleClearLocalData}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sim, Limpar Tudo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Informações do Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Versão</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Tipo de Armazenamento</span>
                      <Badge variant="outline">Local + Cloud</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Banco de Dados</span>
                      <span className="font-medium">Supabase + localStorage</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Última Atualização</span>
                      <span className="font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
