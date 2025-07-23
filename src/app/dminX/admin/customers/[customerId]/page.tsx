import CustomerDetail from "./components";

export default async function CustomersDetailPage({
  params,
}: {
  params: { customerId: string };
}) {
  return (
    <>
      <CustomerDetail customerId={params && params?.customerId} />
    </>
  );
}
