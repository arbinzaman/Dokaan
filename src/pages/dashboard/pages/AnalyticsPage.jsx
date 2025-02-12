// import Header from "../../../components/dashBoard/home/common/Header";

import OverviewCards from "../../../components/dashBoard/home/analytics/OverviewCards";
import RevenueChart from "../../../components/dashBoard/home/analytics/RevenueChart";
import ChannelPerformance from "../../../components/dashBoard/home/analytics/ChannelPerformance";
import ProductPerformance from "../../../components/dashBoard/home/analytics/ProductPerformance";
import UserRetention from "../../../components/dashBoard/home/analytics/UserRetention";
import CustomerSegmentation from "../../../components/dashBoard/home/analytics/CustomerSegmentation";
// import AIPoweredInsights from "../../../components/dashBoard/home/analytics/AIPoweredInsights";

const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 '>
			{/* <Header title={"Analytics Dashboard"} /> */}

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance />
					<ProductPerformance />
					<UserRetention />
					<CustomerSegmentation />
				</div>

				{/* <AIPoweredInsights /> */}
			</main>
		</div>
	);
};
export default AnalyticsPage;
