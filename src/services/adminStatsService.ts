
import { supabase } from "@/integrations/supabase/client";

export const getAdminStats = async () => {
  const stats = {
    totalUsers: 0,
    activeJobs: 0,
    testsCreated: 0,
    scheduledInterviews: 0,
    pendingApprovals: 0,
    documentsUploaded: 0,
    activeEmployees: 0,
    newApplications: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  try {
    const [
      { count: userCount },
      { count: activeJobCount },
      { count: testCount },
      { count: interviewCount },
      { count: approvalCount },
      { count: employeeCount },
      { count: applicationCount },
      ordersResponse,
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("ai_interviews").select("*", { count: "exact", head: true }),
      supabase.from("interviews").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("employees").select("*", { count: "exact", head: true }),
      supabase.from("job_applications").select("*", { count: "exact", head: true }),
      supabase.from("digital_orders").select("amount_paid"),
    ]);

    stats.totalUsers = userCount ?? 0;
    stats.activeJobs = activeJobCount ?? 0;
    stats.testsCreated = testCount ?? 0;
    stats.scheduledInterviews = interviewCount ?? 0;
    stats.pendingApprovals = approvalCount ?? 0;
    stats.documentsUploaded = 0; // Set to 0 since documents table doesn't exist
    stats.activeEmployees = employeeCount ?? 0;
    stats.newApplications = applicationCount ?? 0;

    if (!ordersResponse.error && ordersResponse.data) {
      stats.totalOrders = ordersResponse.data.length;
      stats.totalRevenue = ordersResponse.data.reduce(
        (sum, order) => sum + (order.amount_paid || 0),
        0
      );
    }
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
  }

  return stats;
};
