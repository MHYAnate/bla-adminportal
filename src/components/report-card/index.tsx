import { IReportCard } from "@/types";
import { DowngressIcon, ProgressIcon } from "../../../public/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "../ui/card";
interface iProps {
	report: IReportCard;
}

const ReportCard: React.FC<iProps> = ({ report }) => {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex justify-between items-start mb-[2.25rem]">
					<div className="text-[#202224] pr-4 flex-1 min-w-0">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<p className="mb-[0.875rem] font-medium text-[1rem] truncate cursor-default">
										{report.title}
									</p>
								</TooltipTrigger>
								<TooltipContent>
									<p>{report.title}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<h5 className="font-medium text-[1.5rem] truncate cursor-default">
										{report.value}
									</h5>
								</TooltipTrigger>
								<TooltipContent>
									<p>{report.value}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div className="flex-shrink-0">{report.icon}</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex-shrink-0">
						{report.isProgressive ? <ProgressIcon /> : <DowngressIcon />}
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="font-medium text-[1rem] text-[#606060] truncate cursor-default">
									<span
										className={`${
											report.isProgressive ? "text-[#00B69B]" : "text-[#F93C65]"
										}`}
									>
										{report.count}%
									</span>
									{report.description}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									<span
										className={`${
											report.isProgressive ? "text-[#00B69B]" : "text-[#F93C65]"
										}`}
									>
										{report.count}%
									</span>
									{report.description}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</CardContent>
		</Card>
	);
};
export default ReportCard;
