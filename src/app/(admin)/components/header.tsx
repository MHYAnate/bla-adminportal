interface IProps {
  title: string;
  subtext: string;
}

const Header: React.FC<IProps> = ({ title, subtext }) => {
  return (
    <div>
      <h6 className="font-semibold text-lg text-[#111827] mb-1">{title}</h6>
      <p className="text-[#687588] font-medium text-sm">{subtext}</p>
    </div>
  );
};

export default Header;
