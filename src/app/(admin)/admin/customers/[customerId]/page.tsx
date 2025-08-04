// pages/customers/[customerId]/page.tsx
import CustomerDetail from "./components";

export default async function CustomersDetailPage({
  params,
}: {
  params: { customerId: string };
}) {
  // Add await for params if using Next.js 15+
  const resolvedParams = await params;

  return (
    <>
      <CustomerDetail customerId={resolvedParams.customerId} />
    </>
  );
}