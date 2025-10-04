import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, className }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState("");
  const { toast } = useToast();

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    
    if (images.length >= maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(urlInput); // Validate URL
      onImagesChange([...images, urlInput.trim()]);
      setUrlInput("");
      toast({
        title: "Success",
        description: "Image URL added successfully",
      });
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-neutral-200">Product Images</Label>
        <p className="text-sm text-neutral-400">
          Add image URLs from any source (Unsplash, Imgur, direct links). Maximum {maxImages} images.
        </p>
        <p className="text-xs text-neutral-500">
          💡 Tip: Right-click any image online → "Copy image address" to get the URL
        </p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-700">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%239CA3AF'%3EBroken%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                data-testid={`button-remove-image-${index}`}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* URL Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="url"
              placeholder="Paste image URL here (e.g., https://images.unsplash.com/...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUrlAdd();
                }
              }}
              data-testid="input-image-url"
            />
          </div>
          <Button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim() || images.length >= maxImages}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            data-testid="button-add-image"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400 mb-2">No images added yet</p>
          <p className="text-neutral-500 text-sm">Paste image URLs above to add product images</p>
        </div>
      )}
    </div>
  );
}