import AuthTestComponent from "@/components/AuthTestComponent";
import Manufacturers from "./components/index";
import APIResponseDebugger from "@/components/APIResponseDebugger";
import { useManufacturersQuery } from '@/hooks/useApiQuery';

// Define the manufacturer type
interface Manufacturer {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other properties based on your API response
  [key: string]: any; // Allow additional properties
}

export default function ManufacturersPage() {
  const { data, isLoading, error } = useManufacturersQuery({ pageSize: 10, page: 1 });

  console.log('Manufacturers component data:', data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // data will now be properly structured
  const items: Manufacturer[] = data?.items || [];

  return (
    <section>
      <AuthTestComponent />
      <APIResponseDebugger />

      {/* Option 2: Use the existing Manufacturers component (handles its own data) */}
      <div className="mt-8">
        <h2>Existing Manufacturers Component:</h2>
        <Manufacturers />
      </div>
    </section>
  );
}