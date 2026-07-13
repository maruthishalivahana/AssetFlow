import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuthUser } from "@/src/types/auth";

const roleOptions: Array<{ label: string; value: string }> = [
  { label: "Employee", value: "EMPLOYEE" },
  { label: "Asset Manager", value: "ASSET_MANAGER" },
  { label: "Department Head", value: "DEPARTMENT_HEAD" },
  { label: "Administrator", value: "ADMIN" },
];

interface RolePromotionDialogProps {
  employee: AuthUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employeeId: string, newRole: string) => void;
}

export function RolePromotionDialog({
  employee,
  open,
  onOpenChange,
  onSave,
}: RolePromotionDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset selected role when modal opens
  React.useEffect(() => {
    if (open && employee) {
      setSelectedRole(employee.role);
    }
  }, [open, employee]);

  if (!employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || selectedRole === employee.role) return;

    setIsSubmitting(true);
    try {
      await onSave(employee.id, selectedRole);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-slate-100">
            Promote / Change Role
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div>
            <p className="text-sm text-slate-400 mb-4">
              Update role for <strong className="text-slate-200">{employee.firstName} {employee.lastName}</strong>.
            </p>

            <div className="space-y-2">
              <Label className="text-slate-300">Select New Role</Label>
              <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as any)}>
                <SelectTrigger className="bg-slate-900 border-border text-slate-100">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedRole && selectedRole !== employee.role && (
            <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-amber-500 font-medium text-sm">Warning</AlertTitle>
              <AlertDescription className="text-amber-500/80 text-xs mt-1">
                Changing roles affects permissions. This user will immediately gain or lose access based on the new role.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-border text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedRole || selectedRole === employee.role}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
