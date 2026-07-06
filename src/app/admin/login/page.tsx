import AdminLoginContent from "@/components/AdminLoginContent";
import { getSafeAdminRedirectPath } from "@/lib/adminAuth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeAdminRedirectPath(params.next);

  return <AdminLoginContent errorCode={params.error} nextPath={nextPath} />;
}
