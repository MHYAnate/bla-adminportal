import OrderDetails from "./components";

export default function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <section>
      <OrderDetails orderId={params.orderId} />
    </section>
  );
}
