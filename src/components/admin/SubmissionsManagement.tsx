import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/sanitized-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, Trash2, Search, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { formatBackendError, isAbortLikeError } from "@/lib/error-utils";

interface Submission {
  id: string;
  created_at: string;
  status: string;
  admin_note: string | null;
  name: string;
  email: string;
  phone: string | null;
  location: string;
  categories: string | null;
  certifications: string | null;
  profile: string | null;
  payload: unknown;
}

export function SubmissionsManagement() {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminNote, setAdminNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("producer_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        toast.error(`${t("admin.submissions.toast.loadError")}: ${formatBackendError(error)}`);
      } else {
        setSubmissions(data || []);
      }
    } catch (error) {
      if (isAbortLikeError(error)) return;
      console.error("Error fetching submissions:", error);
      toast.error(`${t("admin.submissions.toast.loadError")}: ${formatBackendError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsSaving(true);
    const { error } = await supabase
      .from("producer_submissions")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      toast.error(t("admin.submissions.toast.updateError"));
    } else {
      toast.success(t("admin.submissions.toast.statusUpdated"));
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    }
    setIsSaving(false);
  };

  const handleSaveNote = async () => {
    if (!selectedSubmission) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from("producer_submissions")
      .update({ admin_note: adminNote || null })
      .eq("id", selectedSubmission.id);

    if (error) {
      console.error("Error saving note:", error);
      toast.error(t("admin.submissions.toast.noteError"));
    } else {
      toast.success(t("admin.submissions.toast.noteSaved"));
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id ? { ...s, admin_note: adminNote || null } : s
        )
      );
      setSelectedSubmission((prev) => prev ? { ...prev, admin_note: adminNote || null } : null);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.submissions.confirmDelete"))) return;

    const { error } = await supabase
      .from("producer_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting submission:", error);
      toast.error(t("admin.submissions.toast.deleteError"));
    } else {
      toast.success(t("admin.submissions.toast.deleteSuccess"));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const openDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setAdminNote(submission.admin_note || "");
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">{t("admin.submissions.statusNew")}</Badge>;
      case "contacted":
        return <Badge variant="secondary">{t("admin.submissions.statusContacted")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <p className="text-center py-8">{t("admin.submissions.loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">{t("admin.submissions.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("admin.submissions.totalCount", { count: submissions.length })}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin.submissions.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("admin.submissions.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="new">{t("admin.submissions.statusNew")}</SelectItem>
            <SelectItem value="contacted">{t("admin.submissions.statusContacted")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.submissions.date")}</TableHead>
              <TableHead>{t("admin.submissions.name")}</TableHead>
              <TableHead>{t("admin.submissions.email")}</TableHead>
              <TableHead>{t("admin.submissions.phone")}</TableHead>
              <TableHead>{t("admin.submissions.location")}</TableHead>
              <TableHead>{t("admin.submissions.status")}</TableHead>
              <TableHead className="text-right">{t("admin.submissions.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t("admin.submissions.noSubmissions")}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(submission.created_at), "PPp")}
                  </TableCell>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone || "-"}</TableCell>
                  <TableCell>{submission.location}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetails(submission)}
                        title={t("admin.submissions.viewDetails")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(submission.id)}
                        className="text-destructive hover:text-destructive"
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.submissions.detailTitle")}</DialogTitle>
            <DialogDescription>
              {t("admin.submissions.submittedOn", {
                date: selectedSubmission
                  ? format(new Date(selectedSubmission.created_at), "PPPp")
                  : "",
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className="font-medium">{t("admin.submissions.status")}:</span>
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) => handleStatusChange(selectedSubmission.id, value)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t("admin.submissions.statusNew")}</SelectItem>
                    <SelectItem value="contacted">{t("admin.submissions.statusContacted")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.submissions.name")}</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.submissions.email")}</p>
                  <p className="font-medium">
                    <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.submissions.phone")}</p>
                  <p className="font-medium">{selectedSubmission.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.submissions.location")}</p>
                  <p className="font-medium">{selectedSubmission.location}</p>
                </div>
              </div>

              {/* Categories & Certifications */}
              {(selectedSubmission.categories || selectedSubmission.certifications) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedSubmission.categories && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("admin.submissions.categories")}</p>
                      <p className="font-medium">{selectedSubmission.categories}</p>
                    </div>
                  )}
                  {selectedSubmission.certifications && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("admin.submissions.certifications")}</p>
                      <p className="font-medium">{selectedSubmission.certifications}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Profile */}
              {selectedSubmission.profile && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.submissions.farmProfile")}</p>
                  <p className="mt-1 whitespace-pre-wrap bg-muted p-3 rounded-lg text-sm">
                    {selectedSubmission.profile}
                  </p>
                </div>
              )}

              {/* Admin Note */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">{t("admin.submissions.adminNote")}</span>
                </div>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={t("admin.submissions.adminNotePlaceholder")}
                  rows={3}
                />
                <Button onClick={handleSaveNote} disabled={isSaving} size="sm">
                  {isSaving ? t("common.loading") : t("admin.submissions.saveNote")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}