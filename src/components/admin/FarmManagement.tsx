import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/sanitized-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatBackendError, isAbortLikeError } from "@/lib/error-utils";

type Farm = {
  id: string;
  name: string;
  location: string;
  region: string;
  description: string | null;
  story: string | null;
  image_url: string | null;
};

export function FarmManagement() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    region: "",
    description: "",
    story: "",
    image_url: "",
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("farms").select("*").order("name");

      if (error) {
        console.error("Error fetching farms:", error);
        toast.error(`Failed to load farms: ${formatBackendError(error)}`);
        return;
      }

      setFarms(data || []);
    } catch (error) {
      if (isAbortLikeError(error)) return;
      console.error("Error fetching farms:", error);
      toast.error(`Failed to load farms: ${formatBackendError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingFarm) {
      const { error } = await supabase
        .from("farms")
        .update(formData)
        .eq("id", editingFarm.id);

      if (error) {
        toast.error("Failed to update farm");
      } else {
        toast.success("Farm updated successfully");
        setIsOpen(false);
        resetForm();
        fetchFarms();
      }
    } else {
      const { error } = await supabase
        .from("farms")
        .insert([formData]);

      if (error) {
        toast.error("Failed to create farm");
      } else {
        toast.success("Farm created successfully");
        setIsOpen(false);
        resetForm();
        fetchFarms();
      }
    }
  };

  const handleEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      region: farm.region,
      description: farm.description || "",
      story: farm.story || "",
      image_url: farm.image_url || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this farm?")) return;

    const { error } = await supabase
      .from("farms")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.message.includes("foreign key constraint")) {
        toast.error("Cannot delete farm: it has associated products. Delete the products first.");
      } else {
        toast.error("Failed to delete farm: " + error.message);
      }
    } else {
      toast.success("Farm deleted successfully");
      fetchFarms();
    }
  };

  const resetForm = () => {
    setEditingFarm(null);
    setFormData({
      name: "",
      location: "",
      region: "",
      description: "",
      story: "",
      image_url: "",
    });
  };

  if (loading) return <p>Loading farms...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Farm Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFarm ? "Edit Farm" : "Add New Farm"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Farm Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story">Story</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingFarm ? "Update Farm" : "Create Farm"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell className="font-medium">{farm.name}</TableCell>
                <TableCell>{farm.location}</TableCell>
                <TableCell>{farm.region}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(farm)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(farm.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}