
// import * as XLSX from "xlsx";

// const downloadExcel = () => {
//   const formattedData = formatDataForExcel(getProductsData);
//   const worksheet = XLSX.utils.json_to_sheet(formattedData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

//   XLSX.writeFile(workbook, "products.xlsx");
// };
// const formatDataForExcel = (products:any) => {
//   return products.map((product:any) => ({
//     ID: product.id,
//     Name: product.name,
//     Description: product.description,
//     Category: product.category?.name,
//     Manufacturer: product.manufacturer?.name,
//     Country: product.manufacturer?.country,
//     Price: product.options?.[0]?.price,
//     Inventory: product.options?.[0]?.inventory,
//     Unit: product.options?.[0]?.unit,
//     CreatedAt: product.createdAt,
//     UpdatedAt: product.updatedAt,
//   }));
// };

// <Button
//   variant="outline"
//   className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
//   size="xl"
//   onClick={downloadExcel}
// >
//   <ExportIcon /> Download
// </Button>