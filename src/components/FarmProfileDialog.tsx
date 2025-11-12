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

interface FarmProfileDialogProps {
  farmId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FarmProfileDialog = ({
  farmId,
  open,
  onOpenChange,
}: FarmProfileDialogProps) => {
  // Placeholder farm data - ready for real data injection
  const farmData = {
    id: farmId,
    name: "{{Farm Name}}",
    description:
      "{{Farm Name}} is a certified-organic producer focused on sustainable methods and soil health. Learn about their practices and seasonal cycle.",
    image: "/placeholder.svg",
    location: "{{Region, Country}}",
    certifications: ["Certified Organic", "Biodynamic", "Fair Trade"],
    practices: [
      "Regenerative agriculture",
      "Crop rotation",
      "No synthetic pesticides",
      "Heirloom varieties",
    ],
    story:
      "For over 20 years, our family farm has been dedicated to growing the highest quality organic produce while nurturing the land for future generations. We believe in working with nature, not against it.",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              src={farmData.image}
              alt={farmData.name}
              className="object-cover w-full h-full rounded-lg bg-muted"
            />
          </AspectRatio>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>{farmData.location}</span>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-fresh-green" />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {farmData.certifications.map((cert) => (
                <Badge key={cert} variant="secondary">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Story */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Our Story</h3>
            <p className="text-muted-foreground leading-relaxed">
              {farmData.story}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {farmData.description}
            </p>
          </div>

          <Separator />

          {/* Farming Practices */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-organic-green" />
              Our Practices
            </h3>
            <ul className="space-y-2">
              {farmData.practices.map((practice) => (
                <li
                  key={practice}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="text-organic-green mt-1">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>

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
      </DialogContent>
    </Dialog>
  );
};
