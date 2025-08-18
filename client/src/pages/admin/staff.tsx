import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Users, Shield, UserCheck } from "lucide-react";

const staffSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "moderator", "staff"], {
    required_error: "Please select a role",
  }),
  permissions: z.array(z.string()).optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function StaffAdmin() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "staff",
      permissions: [],
    },
  });

  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["/api/admin/staff"],
    queryFn: async () => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("GET", "/api/admin/staff", undefined, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
  });

  const createStaffMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("POST", "/api/admin/staff", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Staff member created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create staff member",
        variant: "destructive",
      });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaffFormData> }) => {
      const token = localStorage.getItem("admin-token");
      const response = await apiRequest("PUT", `/api/admin/staff/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      setEditingStaff(null);
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("admin-token");
      await apiRequest("DELETE", `/api/admin/staff/${id}`, undefined, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff"] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StaffFormData) => {
    if (editingStaff) {
      updateStaffMutation.mutate({ id: editingStaff.id, data });
    } else {
      createStaffMutation.mutate(data);
    }
  };

  const handleEdit = (staff: any) => {
    setEditingStaff(staff);
    form.reset({
      username: staff.username,
      email: staff.email,
      role: staff.role,
      permissions: staff.permissions || [],
    });
    setIsCreateDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "moderator":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "moderator":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-green-500/20 text-green-300 border-green-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Staff Management</h1>
          <p className="text-neutral-400 mt-2">Manage admin, moderator, and staff accounts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gold hover:bg-gold/90 text-black font-medium"
              onClick={() => {
                setEditingStaff(null);
                form.reset();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-800 border-neutral-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-200">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-neutral-700 border-neutral-600 text-white"
                          placeholder="Enter username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-200">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="bg-neutral-700 border-neutral-600 text-white"
                          placeholder="Enter email address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!editingStaff && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-200">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            placeholder="Enter password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-200">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="staff" className="text-white hover:bg-neutral-600">Staff</SelectItem>
                          <SelectItem value="moderator" className="text-white hover:bg-neutral-600">Moderator</SelectItem>
                          <SelectItem value="admin" className="text-white hover:bg-neutral-600">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gold hover:bg-gold/90 text-black"
                    disabled={createStaffMutation.isPending || updateStaffMutation.isPending}
                  >
                    {editingStaff ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-neutral-800/50 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-gold" />
            Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-700">
                <TableHead className="text-neutral-300">User</TableHead>
                <TableHead className="text-neutral-300">Role</TableHead>
                <TableHead className="text-neutral-300">Email</TableHead>
                <TableHead className="text-neutral-300">Status</TableHead>
                <TableHead className="text-neutral-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers?.map((staff: any) => (
                <TableRow key={staff.id} className="border-neutral-700">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        {getRoleIcon(staff.role)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{staff.username}</p>
                        <p className="text-sm text-neutral-400">
                          Created {new Date(staff.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleBadgeColor(staff.role)} border`}>
                      {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-300">{staff.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(staff)}
                        className="text-gold hover:bg-gold/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteStaffMutation.mutate(staff.id)}
                        className="text-red-400 hover:bg-red-500/10"
                        disabled={deleteStaffMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {!staffMembers?.length && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">No staff members found</p>
              <p className="text-neutral-500 text-sm">Add your first staff member to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}