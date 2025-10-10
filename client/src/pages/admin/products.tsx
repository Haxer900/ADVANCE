import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), "Price must be a number"),
  imageUrl: z.string().url("Must be a valid URL").min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsAdmin() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      inStock: true,
      featured: false,
    },
  });

  const { data: productsData, isLoading } = useQuery<{ products: any[] }>({
    queryKey: ["/api/admin/products"],
  });

  const products = productsData?.products || [];

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("POST", "/api/admin/products", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("PUT", `/api/admin/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("admin-token");
      await apiRequest("DELETE", `/api/admin/products/${id}`, undefined, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured,
    });
    setIsCreateDialogOpen(true);
  };

  const handleToggleStock = (product: any) => {
    updateProductMutation.mutate({
      id: product.id,
      data: { inStock: !product.inStock }
    });
  };

  const handleToggleFeatured = (product: any) => {
    updateProductMutation.mutate({
      id: product.id,
      data: { featured: !product.featured }
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-neutral-400">Manage your product catalog</p>
        </div>
        <Dialog open={isCreateDialogOpen || !!editingProduct} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingProduct(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-800 border-neutral-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-200">Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-neutral-700 border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-200">Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            className="bg-neutral-700 border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-200">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="bg-neutral-700 border-neutral-600 text-white"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-200">Category</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-neutral-700 border-neutral-600 text-white"
                          placeholder="e.g., Dresses, Accessories, Shoes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-200">Product Image URL</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            className="bg-neutral-700 border-neutral-600 text-white"
                          />
                          {field.value && (
                            <div className="rounded-lg overflow-hidden bg-neutral-700 max-w-xs">
                              <img 
                                src={field.value} 
                                alt="Preview" 
                                className="w-full h-40 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' fill='%239CA3AF'%3EInvalid%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-6">
                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-neutral-200">In Stock</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-neutral-200">Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingProduct(null);
                      form.reset();
                    }}
                    className="border-neutral-600 text-neutral-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-black"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  >
                    {editingProduct ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-neutral-800/50 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Product Catalog ({products?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-700">
                  <TableHead className="text-neutral-300">Product</TableHead>
                  <TableHead className="text-neutral-300">Category</TableHead>
                  <TableHead className="text-neutral-300">Price</TableHead>
                  <TableHead className="text-neutral-300">Status</TableHead>
                  <TableHead className="text-neutral-300">Featured</TableHead>
                  <TableHead className="text-neutral-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product: any) => (
                  <TableRow key={product.id} className="border-neutral-700 hover:bg-neutral-800/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-neutral-400 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-neutral-600 text-neutral-300">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      ₹{product.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.inStock}
                          onCheckedChange={() => handleToggleStock(product)}
                        />
                        <Badge
                          variant={product.inStock ? "default" : "destructive"}
                          className={product.inStock ? "bg-green-500/20 text-green-400" : ""}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.featured}
                        onCheckedChange={() => handleToggleFeatured(product)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}