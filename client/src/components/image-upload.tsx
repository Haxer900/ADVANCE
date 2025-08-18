import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'zenthra_products'); // You'll need to create this preset in Cloudinary
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dfittnogt/image/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error('Failed to upload to Cloudinary');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(files).map(uploadToCloudinary);

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
          Upload images or add URLs. Maximum {maxImages} images allowed.
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

      {/* Upload Controls */}
      <div className="space-y-3">
        {/* File Upload */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-700"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </>
            )}
          </Button>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Or paste image URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-neutral-700 border-neutral-600 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlAdd();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim() || images.length >= maxImages}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400 mb-2">No images added yet</p>
          <p className="text-neutral-500 text-sm">Upload files or add image URLs to get started</p>
        </div>
      )}
    </div>
  );
}