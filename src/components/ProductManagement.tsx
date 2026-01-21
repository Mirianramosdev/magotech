import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Package, Search, Link, Upload, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ImageUpload } from './ImageUpload';

export interface ProductWithStock extends Product {
  stock: number;
  description?: string;
}

interface ProductManagementProps {
  products: ProductWithStock[];
  onAddProduct: (product: Omit<ProductWithStock, 'id'>) => void;
  onUpdateProduct: (id: number, product: Partial<ProductWithStock>) => void;
  onDeleteProduct: (id: number) => void;
}

export function ProductManagement({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithStock | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Smartphones', 'Laptops', 'Tablets', 'Acessórios', 'Gaming'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const ProductForm = ({ 
    product, 
    onSubmit, 
    onCancel 
  }: { 
    product?: ProductWithStock; 
    onSubmit: (data: any) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      price: product?.price || 0,
      originalPrice: product?.originalPrice || undefined,
      image: product?.image || '',
      category: product?.category || '',
      stock: product?.stock || 0,
      description: product?.description || '',
      rating: product?.rating || 5,
      reviews: product?.reviews || 0,
      isNew: product?.isNew || false,
      isOnSale: product?.isOnSale || false
    });

    const [imageMethod, setImageMethod] = useState<'upload' | 'url' | 'suggestions'>('upload');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Remove originalPrice se for 0 ou undefined
      const dataToSubmit = {
        ...formData,
        originalPrice: formData.originalPrice && formData.originalPrice > 0 ? formData.originalPrice : undefined
      };
      onSubmit(dataToSubmit);
    };

    const generateSearchTerms = (productName: string): string[] => {
      const keywords = productName.toLowerCase();
      
      if (keywords.includes('iphone')) return ['smartphone modern black', 'technology device'];
      if (keywords.includes('macbook')) return ['laptop computer modern', 'technology workspace'];
      if (keywords.includes('airpods')) return ['wireless headphones black', 'audio technology'];
      if (keywords.includes('ipad')) return ['tablet device modern', 'technology device'];
      if (keywords.includes('watch')) return ['smartwatch technology', 'wearable device'];
      if (keywords.includes('gamer') || keywords.includes('gaming')) return ['gaming setup technology', 'computer gaming'];
      if (keywords.includes('mouse')) return ['computer mouse gaming', 'gaming peripheral'];
      if (keywords.includes('teclado')) return ['keyboard gaming', 'computer keyboard'];
      if (keywords.includes('monitor')) return ['computer monitor gaming', 'display technology'];
      if (keywords.includes('notebook')) return ['laptop computer modern', 'portable computer'];
      if (keywords.includes('smartphone')) return ['smartphone technology black', 'mobile device'];
      
      return ['technology device modern', 'gadget technology'];
    };

    const searchUnsplashImages = async () => {
      if (!formData.name.trim()) return;
      
      setIsLoadingSuggestions(true);
      
      try {
        const searchTerms = generateSearchTerms(formData.name);
        
        // Map de imagens pré-buscadas para diferentes tipos de produtos
        const imageMap: { [key: string]: string[] } = {
          'smartphone modern black': [
            'https://images.unsplash.com/photo-1600034587986-b0b531d62950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMGJsYWNrfGVufDF8fHx8MTc1ODI5MTMxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ],
          'laptop computer modern': [
            'https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1vZGVybnxlbnwxfHx8fDE3NTgyMjIxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            'https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ],
          'wireless headphones black': [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU4MjEyNjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ],
          'gaming setup technology': [
            'https://images.unsplash.com/photo-1629102981237-c44ffad32775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU4MjkxMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ],
          'tablet device modern': [
            'https://images.unsplash.com/photo-1610664840481-10b7b43c9283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ],
          'smartwatch technology': [
            'https://images.unsplash.com/photo-1579586337278-3f436f25d4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ],
          'technology device modern': [
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1547394765-185e1e68f34e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          ]
        };
        
        // Buscar imagens baseadas nos termos de pesquisa
        let foundImages: string[] = [];
        for (const term of searchTerms) {
          if (imageMap[term]) {
            foundImages = [...foundImages, ...imageMap[term]];
            break; // Use o primeiro termo que tiver correspondência
          }
        }
        
        // Se não encontrou correspondência exata, use imagens genéricas de tecnologia
        if (foundImages.length === 0) {
          foundImages = imageMap['technology device modern'];
        }
        
        // Limitar a 4 imagens únicas
        const uniqueImages = Array.from(new Set(foundImages)).slice(0, 4);
        setSuggestions(uniqueImages);
        
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(c => c !== 'all').map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPrice">Preço Original (R$) - Opcional</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={formData.originalPrice || ''}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Deixe vazio se não houver promoção"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Estoque *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Avaliação (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="space-y-4">
          <Label>Imagem do Produto</Label>
          
          <Tabs value={imageMethod} onValueChange={(value) => setImageMethod(value as 'upload' | 'url' | 'suggestions')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Sugestões
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                URL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4">
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                onImageRemove={() => setFormData({ ...formData, image: '' })}
                label=""
              />
              {formData.image && (
                <p className="text-xs text-gray-500 mt-2">
                  ✓ Imagem carregada com sucesso
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="suggestions" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Imagens sugeridas baseadas no nome do produto
                  </span>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={searchUnsplashImages}
                  disabled={isLoadingSuggestions || !formData.name.trim()}
                  className="w-full"
                >
                  {isLoadingSuggestions ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Buscando imagens...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Sugestões de Imagens
                    </>
                  )}
                </Button>

                {suggestions.length === 0 && !isLoadingSuggestions && formData.name && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Digite o nome do produto e clique em "Buscar Sugestões"
                    </p>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {suggestions.length} sugestões encontradas
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {suggestions.map((imageUrl, index) => (
                        <Card 
                          key={index} 
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            formData.image === imageUrl ? 'ring-2 ring-green-500' : ''
                          }`}
                          onClick={() => setFormData({ ...formData, image: imageUrl })}
                        >
                          <CardContent className="p-2">
                            <div className="relative">
                              <ImageWithFallback
                                src={imageUrl}
                                alt={`Sugestão ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              {formData.image === imageUrl && (
                                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                                  <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 text-center">
                              Opção {index + 1}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {formData.image && suggestions.includes(formData.image) && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Imagem selecionada com sucesso!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-4">
              <div className="space-y-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Cole aqui o link direto para a imagem do produto
                </p>
                {formData.image && (
                  <div className="mt-3">
                    <Label className="text-sm">Preview:</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isNew"
              checked={formData.isNew}
              onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
            />
            <Label htmlFor="isNew">Produto Novo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOnSale"
              checked={formData.isOnSale}
              onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
            />
            <Label htmlFor="isOnSale">Em Promoção</Label>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {product ? 'Atualizar' : 'Adicionar'} Produto
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Gerenciar Produtos</h1>
          <p className="text-gray-600">Adicione, edite ou remova produtos do catálogo</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 rounded-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para adicionar um novo produto ao catálogo da loja
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={(data) => {
                onAddProduct(data);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'Todas as Categorias' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden bg-white border border-gray-200">
            <div className="relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && <Badge className="bg-green-500 text-black">Novo</Badge>}
                {product.isOnSale && <Badge variant="destructive">Promoção</Badge>}
                <Badge className={`${product.stock < 5 ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
                  <Package className="h-3 w-3 mr-1" />
                  {product.stock}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="line-clamp-2 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg text-green-600">
                  R$ {product.price.toLocaleString('pt-BR')}
                </span>
                {product.originalPrice && product.originalPrice > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.originalPrice.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Dialog 
                  open={editingProduct?.id === product.id} 
                  onOpenChange={(open) => !open && setEditingProduct(null)}
                >
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                      <DialogDescription>
                        Modifique as informações do produto e clique em atualizar para salvar as alterações
                      </DialogDescription>
                    </DialogHeader>
                    <ProductForm
                      product={editingProduct || undefined}
                      onSubmit={(data) => {
                        if (editingProduct) {
                          onUpdateProduct(editingProduct.id, data);
                          setEditingProduct(null);
                        }
                      }}
                      onCancel={() => setEditingProduct(null)}
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir "{product.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDeleteProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
}