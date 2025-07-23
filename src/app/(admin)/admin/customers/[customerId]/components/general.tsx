export interface CustomerAddress {
	id: number;
	addressLine1: string;
	addressLine2: string | null;
	addressType: "SHIPPING" | "BILLING" | string;
	city: string;
	stateProvince: string;
	country: string;
	postalCode: string;
	phoneNumber: string;
	isDefault: boolean;
	createdAt: string; // ISO string
	updatedAt: string;
}

export interface BusinessInfo {
	businessAddress: string;
	businessPhone: string;
	cacNumber: string;
	storeName: string;
}

export interface PersonalInfo {
	fullName: string;
	email: string;
	phone: string;
	gender: string | null;
}

export interface ReferralInfo {
	referralCode: string;
	referredBy: string | null;
	hasFreeShipping: boolean;
	totalReferrals: number;
	successfulReferrals: number;
	totalBonuses: number;
	activeBonuses: number;
	referralsMade: any[]; // Replace `any` with proper type if known
	referralsReceived: any[];
	bonusHistory: any[];
}

export interface CustomerData {
	id: number;
	email: string;
	customerType: "business" | "individual" | string;
	role: string;
	customerStatus: "ACTIVE" | "INACTIVE" | string;
	status: string;
	createdAt: string;
	complianceStatus: "GOOD" | "BAD" | string;
	complianceScore: number;
	howDidYouHear: string;
	kyc: string;
	kycStatus: string;
	addresses: CustomerAddress[];
	businessInfo: BusinessInfo;
	personalInfo: PersonalInfo;
	referralInfo: ReferralInfo;
}

export interface Customer {
	data: CustomerData;
}

const General: React.FC<Customer> = ({ data }) => {

  const address = data?.addresses?.find(addr => addr.isDefault) || data?.addresses?.[0];

  return (
    <>
      {/* Personal Info Section (unchanged) */}
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6 mb-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Personal Info
        </h5>
        <div className="flex justify-between gap-[2rem]">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Full Name</p>
              <p className="text-sm text-[#111827] font-semibold">
                {data?.personalInfo?.fullName}
              </p>
            </div>
						{data?.customerType === "business" && (
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Store Name</p>
              <p className="text-sm text-[#111827] font-semibold">
                {data?.businessInfo?.storeName}
              </p>
            </div>
						)}
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Email</p>
              <p className="text-sm text-[#111827] font-semibold">
                {data?.personalInfo?.email || "----"}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Gender</p>
              <p className="text-sm text-[#111827] font-semibold">{data?.personalInfo?.gender}</p>
            </div>
            {data?.customerType === "business" && (
              <div className="flex justify-between mb-4">
                <p className="text-sm text-[#687588]">CAC Number</p>
                <p className="text-sm text-[#111827] font-semibold">
                 {data?.businessInfo?.cacNumber}
                </p>
              </div>
            )}
               {data?.customerType === "business" && (
              <div className="flex justify-between mb-4">
                <p className="text-sm text-[#687588]">Business Number</p>
                <p className="text-sm text-[#111827] font-semibold">
                {data?.businessInfo?.businessPhone}
                </p>
              </div>
            )}
               {data?.customerType !== "business" && (
              <div className="flex justify-between mb-4">
                <p className="text-sm text-[#687588]">Phone Number</p>
                <p className="text-sm text-[#111827] font-semibold">
                  {data?.personalInfo?.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Address Section */}
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Address
        </h5>
        <div className="flex gap-[4rem] align-top">
          <div>
            <p className="text-sm text-[#687588] mb-4">Primary Address</p>
            <p className="text-sm text-[#687588] mb-4">Shipping Address</p>
            <p className="text-sm text-[#687588] mb-4">City</p>
            <p className="text-sm text-[#687588] mb-4">State/Province</p>
            <p className="text-sm text-[#687588] mb-4">Country</p>
            <p className="text-sm text-[#687588] mb-4">Post Code</p>
          </div>
          
          {address ? (
            <div>
              <p className="text-sm text-[#111827] font-semibold mb-4">
                {address.addressLine1 || '----'}
              </p>
              <p className="text-sm text-[#111827] font-semibold mb-4">
                {address.addressLine2 || '----'}
              </p>
              <p className="text-sm text-[#111827] font-semibold mb-4">
                {address.city || '----'}
              </p>
              <p className="text-sm text-[#111827] font-semibold mb-4">
                {address.stateProvince || '----'}
              </p>
              <p className="text-sm text-[#111827] font-semibold mb-4">
                {address.country || '----'}
              </p>
              <p className="text-sm text-[#111827] font-semibold mb-4">
                {address.postalCode || '----'}
              </p>
            </div>
          ) : (
            <div>
              {[...Array(6)].map((_, i) => (
                <p key={i} className="text-sm text-[#111827] font-semibold mb-4">----</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default General;
