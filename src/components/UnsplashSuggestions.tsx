import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Search, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { unsplash_tool } from '../tools/unsplash';

interface UnsplashSuggestionsProps {
  productName: string;
  onImageSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

export function UnsplashSuggestions({ 
  productName, 
  onImageSelect, 
  selectedImage 
}: UnsplashSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const generateSearchTerms = (productName: string): string[] => {
    const terms = [];
    
    // Termo completo
    terms.push(productName);
    
    // Extrair palavras-chave principais
    const keywords = productName.toLowerCase();
    
    if (keywords.includes('iphone')) terms.push('smartphone modern black');
    if (keywords.includes('macbook')) terms.push('laptop computer modern');
    if (keywords.includes('airpods')) terms.push('wireless headphones');
    if (keywords.includes('ipad')) terms.push('tablet device modern');
    if (keywords.includes('watch')) terms.push('smartwatch technology');
    if (keywords.includes('gamer') || keywords.includes('gaming')) terms.push('gaming setup technology');
    if (keywords.includes('mouse')) terms.push('computer mouse gaming');
    if (keywords.includes('teclado')) terms.push('keyboard gaming');
    if (keywords.includes('monitor')) terms.push('computer monitor gaming');
    if (keywords.includes('notebook')) terms.push('laptop computer modern');
    if (keywords.includes('smartphone')) terms.push('smartphone technology black');
    
    // Termos genéricos baseados em categoria
    if (terms.length === 1) {
      terms.push('technology device modern');
    }
    
    return terms;
  };

  const searchImages = async () => {
    if (!productName.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const searchTerms = generateSearchTerms(productName);
      const imagePromises = searchTerms.slice(0, 4).map(async (term) => {
        try {
          const response = await fetch('/api/unsplash', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: term })
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.url;
          }
          return null;
        } catch (error) {
          console.warn(`Erro ao buscar imagem para "${term}":`, error);
          return null;
        }
      });
      
      const images = await Promise.all(imagePromises);
      const validImages = images.filter(Boolean) as string[];
      setSuggestions(validImages);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Buscar imagens relacionadas ao produto
          </span>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={searchImages}
          disabled={isLoading || !productName.trim()}
          className="w-full"
        >
          {isLoading ? (
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
      </div>

      {hasSearched && suggestions.length === 0 && !isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Nenhuma sugestão encontrada. Tente buscar novamente ou use upload manual.
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
                  selectedImage === imageUrl ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              >
                <CardContent className="p-2">
                  <div className="relative">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={`Sugestão ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    {selectedImage === imageUrl && (
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
        </div>
      )}
    </div>
  );
}