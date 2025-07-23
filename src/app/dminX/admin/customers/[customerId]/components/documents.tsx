import { DeleteIcon, ExportIcon } from "../../../../../../../public/icons";

const Documents: React.FC = () => {
  const documents = [
    {
      id: 1,
      name: "CAC document.pdf",
    },
    {
      id: 2,
      name: "NIN_slip.pdf",
    },
  ];
  return (
    <>
      <h5 className="mb-4 text-[#111827] font-semibold">Personal Documents</h5>
      <div className="bg-[#FAFAFA] p-4 font-bold text-xs text-[#687588] flex justify-between">
        <h6>Document Name</h6>
        <h6>Action</h6>
      </div>
      <div className="flex flex-col border-b border-[#F1F2F4]">
        {documents.map((document, index) => (
          <div className="flex justify-between p-4" key={index}>
            <h6 className="font-bold text-xs text-[#687588]">
              {document.name}
            </h6>
            <div className="flex gap-2.5">
              <div className="bg-[#EC9F01] p-[7px] rounded-lg">
                <ExportIcon fill="#fff" />
              </div>
              <div className="bg-[#E03137] p-[7px] rounded-lg">
                <DeleteIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Documents;
