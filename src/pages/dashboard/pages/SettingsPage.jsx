// import Header from "../../../components/dashBoard/home/common/Header";
import ConnectedAccounts from "../../../components/dashBoard/home/settings/ConnectedAccounts";
import DangerZone from "../../../components/dashBoard/home/settings/DangerZone";
import LogoutZone from "../../../components/dashBoard/home/settings/LogoutZone";
import Notifications from "../../../components/dashBoard/home/settings/Notifications";
import Profile from "../../../components/dashBoard/home/settings/Profile";
import Security from "../../../components/dashBoard/home/settings/Security";
import DokaanProfile from "../../../components/dashBoard/home/settings/DokaanProfile";
import ThemeControlButton from "../../../components/dashBoard/home/settings/ThemeControlButton";
import InvoiceTypeSelector from "../../../components/dashBoard/home/settings/InvoiceTypeSelector";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 '>
			{/* <Header title='Settings' /> */}
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<DokaanProfile/>
				<Notifications />
				<Security />
				<ConnectedAccounts />
				<InvoiceTypeSelector/>
				<ThemeControlButton />
				<LogoutZone />
				<DangerZone />
			</main>
		</div>
	);
};
export default SettingsPage;
