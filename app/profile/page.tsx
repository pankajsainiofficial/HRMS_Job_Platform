import { DashboardPlaceholderPage } from "../_components/dashboard-placeholder-page";

export default function ProfilePage() {
  return (
    <DashboardPlaceholderPage
      title="Profile"
      description="Manage your resume, candidate details, work history and job preferences from one place."
      items={["Resume upload", "Skills and experience", "Job preferences"]}
    />
  );
}
