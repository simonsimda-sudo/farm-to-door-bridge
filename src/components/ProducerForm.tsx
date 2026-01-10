import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProducerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProducerForm = ({ open, onOpenChange }: ProducerFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    categories: "",
    certifications: "",
    profile: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.email || !formData.location) {
        toast.error(t('producerForm.toast.requiredFields'));
        setIsSubmitting(false);
        return;
      }

      const emailBody = `
New Producer Application:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}
Product Categories: ${formData.categories}
Certifications: ${formData.certifications}
Profile: ${formData.profile}
      `;

      const mailtoLink = `mailto:simon.simda@gmail.com?subject=New Producer Application - ${formData.name}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      toast.success(t('producerForm.toast.success'));
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        categories: "",
        certifications: "",
        profile: "",
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(t('producerForm.toast.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('producerForm.title')}</DialogTitle>
          <DialogDescription>
            {t('producerForm.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('producerForm.name')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('producerForm.namePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('producerForm.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('producerForm.emailPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('producerForm.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('producerForm.phonePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('producerForm.location')}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={t('producerForm.locationPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">{t('producerForm.categories')}</Label>
            <Input
              id="categories"
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              placeholder={t('producerForm.categoriesPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">{t('producerForm.certifications')}</Label>
            <Input
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder={t('producerForm.certificationsPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">{t('producerForm.farmProfile')}</Label>
            <Textarea
              id="profile"
              value={formData.profile}
              onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
              placeholder={t('producerForm.farmProfilePlaceholder')}
              rows={6}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? t('producerForm.submitting') : t('producerForm.submitApplication')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
