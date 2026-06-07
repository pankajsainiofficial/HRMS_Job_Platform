import { DashboardPlaceholderPage } from "../_components/dashboard-placeholder-page";

export default function SignOutPage() {
  return (
    <DashboardPlaceholderPage
      title="Sign Out"
      description="Confirm your session status and return to the hiring dashboard when you are ready."
      items={["Session summary", "Account security", "Return to jobs"]}
    />
  );
}
