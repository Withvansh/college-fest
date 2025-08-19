
import { supabase } from "./client";

export async function initializeRecruiterHRMS(userId: string) {
  // 1. Check if dashboard already exists
  const { data: existingDashboard, error: fetchError } = await supabase
    .from("recruiter_dashboards")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existingDashboard) return existingDashboard;

  // 2. Create new dashboard
  const { data: dashboard, error: createError } = await supabase
    .from("recruiter_dashboards")
    .insert({ 
      user_id: userId,
      company_name: "My Company"
    })
    .select()
    .single();

  if (createError) throw createError;

  // 3. Create starter employee for HR admin
  const { error: employeeError } = await supabase.from("employees").insert({
    user_id: userId,
    company_id: userId,
    employee_id: "EMP001",
    department: "HR",
    designation: "HR Manager",
    employment_status: "active",
    joining_date: new Date().toISOString(),
    employee_type: "full_time",
    created_by: userId,
  });

  if (employeeError) {
    console.error("Error creating employee:", employeeError);
  }

  // 4. Create welcome project
  const { error: projectError } = await supabase.from("projects").insert({
    company_id: userId,
    name: "Welcome Project",
    description: "This is a sample project to get you started",
    status: "active",
    priority: "medium",
    start_date: new Date().toISOString(),
  });

  if (projectError) {
    console.error("Error creating project:", projectError);
  }

  return dashboard;
}
