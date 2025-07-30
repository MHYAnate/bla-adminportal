import APIResponseDebugger from "@/components/APIResponseDebugger";
import Products from "./components";
import AuthTestComponent from '@/components/AuthTestComponent';


export default function ProductsPage() {
  return (
    <section>
      <AuthTestComponent />
      <APIResponseDebugger />
      <Products />
    </section>
  );
}
