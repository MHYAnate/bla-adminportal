// pages/customers/[customerId]/page.tsx
import CustomerDetail from "./components";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export default async function CustomersDetailPage({ params }: PageProps) {
  // Handle the params properly
  const resolvedParams = await params;
  const customerId = resolvedParams.customerId;

  console.log("🎬 Page Component - Customer ID:", customerId);

  if (!customerId) {
    return <div>No customer ID provided</div>;
  }

  return <CustomerDetail customerId={customerId} />;
}