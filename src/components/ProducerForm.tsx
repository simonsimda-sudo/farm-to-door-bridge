import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface ProducerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, { message: t('producerForm.validation.nameRequired') }).max(100, { message: t('producerForm.validation.nameTooLong') }),
    email: z.string().trim().min(1, { message: t('producerForm.validation.emailRequired') }).email({ message: t('producerForm.validation.emailInvalid') }).max(255),
    phone: z.string().max(50).optional(),
    location: z.string().trim().min(1, { message: t('producerForm.validation.locationRequired') }).max(200),
    categories: z.string().max(500).optional(),
    certifications: z.string().max(500).optional(),
    profile: z.string().max(2000).optional(),
  });

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  categories: string;
  certifications: string;
  profile: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export const ProducerForm = ({ open, onOpenChange }: ProducerFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    categories: "",
    certifications: "",
    profile: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    const schema = createFormSchema(t);
    const fieldSchema = schema.shape[field];
    const result = fieldSchema.safeParse(value);
    return result.success ? undefined : result.error.errors[0]?.message;
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all required fields as touched
    setTouched({ name: true, email: true, location: true });

    const schema = createFormSchema(t);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        if (!newErrors[field]) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      toast.error(t('producerForm.toast.requiredFields'));
      setIsSubmitting(false);
      return;
    }

    try {
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

      const mailtoLink = `mailto:simon@trybiobridge.com?subject=New Producer Application - ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(emailBody)}`;
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
      setErrors({});
      setTouched({});
      onOpenChange(false);
    } catch (error) {
      toast.error(t('producerForm.toast.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (field: keyof FormData) => {
    return cn(
      touched[field] && errors[field] && "border-destructive focus-visible:ring-destructive"
    );
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
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(touched.name && errors.name && "text-destructive")}>
              {t('producerForm.name')}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder={t('producerForm.namePlaceholder')}
              className={getInputClassName("name")}
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={cn(touched.email && errors.email && "text-destructive")}>
              {t('producerForm.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder={t('producerForm.emailPlaceholder')}
              className={getInputClassName("email")}
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {touched.email && errors.email && (
              <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('producerForm.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={t('producerForm.phonePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className={cn(touched.location && errors.location && "text-destructive")}>
              {t('producerForm.location')}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              placeholder={t('producerForm.locationPlaceholder')}
              className={getInputClassName("location")}
              aria-invalid={touched.location && !!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {touched.location && errors.location && (
              <p id="location-error" className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">{t('producerForm.categories')}</Label>
            <Input
              id="categories"
              value={formData.categories}
              onChange={(e) => handleChange("categories", e.target.value)}
              placeholder={t('producerForm.categoriesPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">{t('producerForm.certifications')}</Label>
            <Input
              id="certifications"
              value={formData.certifications}
              onChange={(e) => handleChange("certifications", e.target.value)}
              placeholder={t('producerForm.certificationsPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">{t('producerForm.farmProfile')}</Label>
            <Textarea
              id="profile"
              value={formData.profile}
              onChange={(e) => handleChange("profile", e.target.value)}
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
