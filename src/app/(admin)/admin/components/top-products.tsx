"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumber, formatString } from "@/lib/utils";

interface ProductData {
	name: string;
	sales: number;
}

interface iProps {
	data: ProductData[];
}

export function TopProductsChart({ data }: iProps) {
	const totalProducts = data?.reduce(
		(acc, customer) => acc + Number(customer?.sales),
		0
	);

	const productColors = ["#9333EA", "#2DD4BF", "#F97316"]; // purple, aqua green, orange

	const coloredData = data.map((item, index) => ({
		...item,
		fill: productColors[index] || "#94A3B8", // fallback to slate if more than 3 items
	}));

	const chartConfig = coloredData.reduce((acc, item, index) => {
		acc[`customer_${index + 1}`] = {
			label: item.name,
			color: item.fill,
		};
		return acc;
	}, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;

	return (
		<Card className="flex flex-col p-6 w-full h-auto">
			<div className="flex items-center justify-between">
				<h5 className="font-bold text-[#111827]">Top 3 Selling Product</h5>
			</div>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px] flex justify-center items-center"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={coloredData}
							dataKey="sales"
							nameKey="name"
							innerRadius={60}
							strokeWidth={0}
							activeIndex={0}
							paddingAngle={3}
							label={({ cx, cy }) => (
								<text
									x={cx}
									y={cy}
									textAnchor="middle"
									className="fill-[#111827] text-sm font-bold"
								>
									<tspan x={cx} y={cy}>
										{Math.floor(totalProducts || 0)}{" "}
										{/* rounds down without decimals */}
									</tspan>
									<tspan x={cx} y={cy + 24} className="fill-[#A0AEC0] text-xs">
										Total Units
									</tspan>
								</text>
							)}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>

			<div className="flex flex-col gap-3">
				{coloredData.map((data, index) => (
					<div className="flex items-center gap-3" key={index}>
						<div
							className={`w-[10px] h-[10px] rounded-full`}
							style={{ backgroundColor: data.fill }}
						></div>
						<p className="text-[#687588] text-xs font-medium me-auto">
							{/* {formatString(data?.name, 15) || ""} */}
							{data?.name || ""}
						</p>
						<h6 className="font-bold text-sm text-[#111827]">{data?.sales}</h6>
					</div>
				))}
			</div>
		</Card>
	);
}
