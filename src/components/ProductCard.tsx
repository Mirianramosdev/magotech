import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice && product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white border-gray-200 overflow-hidden">
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-green-500 text-black">Novo</Badge>
          )}
          {product.isOnSale && discount > 0 && (
            <Badge variant="destructive">-{discount}%</Badge>
          )}
        </div>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-1">{product.category}</p>
        <h3 className="line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl text-green-600">
            R$ {product.price.toLocaleString('pt-BR')}
          </span>
          {product.originalPrice && product.originalPrice > 0 && (
            <span className="text-sm text-gray-500 line-through">
              R$ {product.originalPrice.toLocaleString('pt-BR')}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}