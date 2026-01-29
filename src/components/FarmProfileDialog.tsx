import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShieldCheck, MapPin, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/sanitized-client";
import { useToast } from "@/hooks/use-toast";

interface FarmProfileDialogProps {
  farmId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FarmData {
  id: string;
  name: string;
  description: string | null;
  story: string | null;
  image_url: string | null;
  location: string;
  region: string;
  farm_certifications: { certification: string }[];
  farm_practices: { practice: string }[];
}

export const FarmProfileDialog = ({
  farmId,
  open,
  onOpenChange,
}: FarmProfileDialogProps) => {
  const [farmData, setFarmData] = useState<FarmData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && farmId) {
      fetchFarmData();
    }
  }, [open, farmId]);

  const fetchFarmData = async () => {
    if (!farmId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("farms")
        .select(`
          *,
          farm_certifications (certification),
          farm_practices (practice)
        `)
        .eq("id", farmId)
        .single();

      if (error) throw error;

      setFarmData(data);
    } catch (error) {
      console.error("Error fetching farm data:", error);
      toast({
        title: "Error loading farm details",
        description: "Failed to load farm information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!farmData && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading farm details...</p>
          </div>
        ) : farmData ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{farmData.name}</DialogTitle>
              <DialogDescription>
                Learn about their practices and commitment to organic farming
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Farm Image */}
              <AspectRatio ratio={16 / 9}>
                <img
                  src={farmData.image_url || "/placeholder.svg"}
                  alt={farmData.name}
                  className="object-cover w-full h-full rounded-lg bg-muted"
                />
              </AspectRatio>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{farmData.location} • {farmData.region}</span>
              </div>

              {/* Certifications */}
              {farmData.farm_certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-fresh-green" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {farmData.farm_certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert.certification}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Story */}
              {farmData.story && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Our Story</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {farmData.story}
                  </p>
                </div>
              )}

              {/* Description */}
              {farmData.description && (
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    {farmData.description}
                  </p>
                </div>
              )}

              {(farmData.story || farmData.description) && <Separator />}

              {/* Farming Practices */}
              {farmData.farm_practices.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-organic-green" />
                    Our Practices
                  </h3>
                  <ul className="space-y-2">
                    {farmData.farm_practices.map((practice, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-organic-green mt-1">•</span>
                        <span>{practice.practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              {/* Map Placeholder */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map placeholder - Location: {farmData.location}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full" size="lg" disabled>
                View all products from this farm
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
