import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageRemove: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ 
  currentImage, 
  onImageChange, 
  onImageRemove, 
  label = "Imagem do Produto",
  className = "" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validação do tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, selecione apenas arquivos de imagem válidos (PNG, JPG, GIF, WebP)');
      return;
    }

    // Validação do tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Converter para base64 para armazenamento local
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Erro ao processar a imagem. Tente novamente.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem. Verifique o arquivo e tente novamente.');
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {currentImage ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <ImageWithFallback
                src={currentImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={onImageRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Alterar Imagem
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragOver 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <CardContent className="p-8">
            <div className="text-center">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-green-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-600">Processando imagem...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm mb-2">
                    <span className="text-green-600 hover:text-green-700 cursor-pointer">
                      Clique para selecionar
                    </span>{' '}
                    ou arraste uma imagem aqui
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP até 5MB
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}