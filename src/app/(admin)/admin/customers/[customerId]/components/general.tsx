interface iProps {
  data: Record<string | number, string | number>;
}

const General: React.FC<iProps> = ({ data }) => {
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
              <p className="text-sm text-[#687588]">Email</p>
              <p className="text-sm text-[#111827] font-semibold">
                {data?.email || "----"}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Gender</p>
              <p className="text-sm text-[#111827] font-semibold">Female</p>
            </div>
            {data?.type === "business" && (
              <div className="flex justify-between mb-4">
                <p className="text-sm text-[#687588]">CAC Number</p>
                <p className="text-sm text-[#111827] font-semibold">
                  RC123456789
                </p>
              </div>
            )}
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
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Address
        </h5>
        <div className="flex gap-[4rem]">
          <div>
            <p className="text-sm text-[#687588] mb-4">Primary Address</p>
            <p className="text-sm text-[#687588] mb-4">Shipping Address</p>
            <p className="text-sm text-[#687588] mb-4">City</p>
            <p className="text-sm text-[#687588] mb-4">State/Province</p>
            <p className="text-sm text-[#687588] mb-4">Country</p>
            <p className="text-sm text-[#687588] mb-4">Post Code</p>
          </div>
          <div>
            <p className="text-sm text-[#111827] font-semibold mb-4">
              68 Bode Thomas Surulere, Lagos Nigeria.
            </p>
            <p className="text-sm text-[#111827] font-semibold mb-4">
              68 Bode Thomas Surulere, Lagos Nigeria.
            </p>
            <p className="text-sm text-[#111827] font-semibold mb-4">Lagos</p>
            <p className="text-sm text-[#111827] font-semibold mb-4">
              Lagos, Mainland
            </p>
            <p className="text-sm text-[#111827] font-semibold mb-4">Nigeria</p>
            <p className="text-sm text-[#111827] font-semibold mb-4">101212</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default General;
