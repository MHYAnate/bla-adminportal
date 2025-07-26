import ManufacturerDetails from "./components";

interface PageProps {
    params: {
        manufacturerId: string;
    };
}

export default function ManufacturerDetailsPage({ params }: PageProps) {
    return (
        <>
            <ManufacturerDetails manufacturerId={params.manufacturerId} />
        </>
    );
}