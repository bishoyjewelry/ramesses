import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdateRepairStatusOptions {
  repairId: string;
  previousStatus: string | null;
  newStatus: string;
  trackingNumber?: string;
}

export const useRepairStatusUpdate = () => {
  const updateRepairStatus = async ({
    repairId,
    previousStatus,
    newStatus,
    trackingNumber,
  }: UpdateRepairStatusOptions): Promise<boolean> => {
    try {
      // Build update data
      const updateData: {
        status: string;
        updated_at: string;
        tracking_number?: string;
      } = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // Include tracking number if provided (especially for shipped status)
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }

      // Update the repair status
      const { error: updateError } = await supabase
        .from("repair_quotes")
        .update(updateData)
        .eq("id", repairId);

      if (updateError) {
        throw updateError;
      }

      // Send status change email if status actually changed
      if (previousStatus !== newStatus) {
        try {
          await supabase.functions.invoke("send-repair-status-email", {
            body: {
              repair_id: repairId,
              previous_status: previousStatus,
              new_status: newStatus,
            },
          });
          console.log(`Status change email sent: ${previousStatus} -> ${newStatus}`);
        } catch (emailError) {
          // Log but don't fail if email doesn't send
          console.error("Failed to send status change email:", emailError);
        }
      }

      toast.success(`Repair status updated to ${newStatus.replace(/_/g, " ")}`);
      return true;
    } catch (error) {
      console.error("Error updating repair status:", error);
      toast.error("Failed to update repair status");
      return false;
    }
  };

  return { updateRepairStatus };
};
