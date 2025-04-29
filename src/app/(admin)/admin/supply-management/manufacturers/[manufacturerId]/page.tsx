import ManufacturerDetails from "./components";

export default function ManufacturerDetailsPage({
  params,
}: {
  params: { manufacturerId: string };
}) {
  return (
    <>
      <ManufacturerDetails manufacturerId={params && params?.manufacturerId} />
    </>
  );
}
