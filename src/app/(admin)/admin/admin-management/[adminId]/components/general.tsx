import { HorizontalDots } from "../../../../../../../public/icons";

const General: React.FC = () => {
  const roles = [
    {
      title: "Order Manager",
    },
    {
      title: "Inventory Manager",
    },
  ];
  const colors = [
    {
      bg: "#E7F7EF",
      color: "#0CAF60",
    },
    {
      bg: "#FFF6D3",
      color: "#E6BB20",
    },
  ];
  return (
    <>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6 mb-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Personal Info
        </h5>
        <div className="flex justify-between gap-[2rem]">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Full Name</p>
              <p className="text-sm text-[#111827] font-semibold">
                Mirabel Sandra Okon
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Store Name</p>
              <p className="text-sm text-[#111827] font-semibold">
                Mirabel Store
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Email Address</p>
              <p className="text-sm text-[#111827] font-semibold">
                mirabel@gmail.com{" "}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Gender</p>
              <p className="text-sm text-[#111827] font-semibold">Female</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">CAC Number</p>
              <p className="text-sm text-[#111827] font-semibold">
                RC123456789
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Phone Number</p>
              <p className="text-sm text-[#111827] font-semibold">
                (+234)08131829849
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F2F4]">
          <h5 className="text-[#111827] font-semibold">Role</h5>
          <HorizontalDots />
        </div>
        <div className="flex gap-[4rem] items-center">
          <div>
            <p className="text-sm text-[#687588]">Current Role</p>
          </div>
          <div className="flex gap-3">
            {roles.map((role, index) => {
              const colorIndex = index % colors.length;
              const { bg, color } = colors[colorIndex];

              return (
                <p
                  key={index}
                  className="text-xs font-medium py-2 px-2.5 rounded-[10px]"
                  style={{ backgroundColor: bg, color: color }}
                >
                  {role.title}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default General;
