import AuthTestComponent from "@/components/AuthTestComponent";
import Manufacturers from "./components/index";
import APIResponseDebugger from "@/components/APIResponseDebugger";

export default function ManufacturersPage() {
  return (
    <section>
      <AuthTestComponent />
      <APIResponseDebugger />
      <Manufacturers />
    </section>
  );
}