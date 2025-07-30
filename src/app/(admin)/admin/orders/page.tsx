import AuthTestComponent from "@/components/AuthTestComponent";
import Orders from "./components";
import APIResponseDebugger from "@/components/APIResponseDebugger";

export default function OrdersPage() {
  return (
    <section>
      <AuthTestComponent />
      <APIResponseDebugger />
      <Orders />
    </section>
  );
}
