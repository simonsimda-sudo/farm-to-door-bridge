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
import { trackFormSubmit } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

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
  const [isSuccess, setIsSuccess] = useState(false);

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

  const resetForm = () => {
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
    setIsSuccess(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
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
      // Store submission in database
      const { error: dbError } = await supabase
        .from('producer_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location,
          categories: formData.categories || null,
          certifications: formData.certifications || null,
          profile: formData.profile || null,
          payload: formData,
          status: 'new',
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      trackFormSubmit('producer_form');
      
      // Show success state inline
      setIsSuccess(true);
      
      // Clear form data
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
    } catch (error) {
      console.error('Error submitting form:', error);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">
              {t('producerForm.successTitle')}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('producerForm.successMessage')}
            </p>
            <Button onClick={() => handleOpenChange(false)} className="mt-4">
              {t('common.close')}
            </Button>
          </div>
        ) : (
          <>
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
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};