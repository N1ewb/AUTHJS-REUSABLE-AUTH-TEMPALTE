import React from "react";
import { getInstructorDashboard } from "@/actions/client/dashboard.action";
import InstructorDashboard from "./InstructorDashboard";

export default async function InstructorDashboardPage() {
  const data = await getInstructorDashboard();
  return <InstructorDashboard data={data} />;
}
