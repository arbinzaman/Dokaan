// import Header from "../../../components/dashBoard/home/common/Header";
import ConnectedAccounts from "../../../components/dashBoard/home/settings/ConnectedAccounts";
import DangerZone from "../../../components/dashBoard/home/settings/DangerZone";
import LogoutZone from "../../../components/dashBoard/home/settings/LogoutZone";
import Notifications from "../../../components/dashBoard/home/settings/Notifications";
import Profile from "../../../components/dashBoard/home/settings/Profile";
import Security from "../../../components/dashBoard/home/settings/Security";
import DokaanProfile from "../../../components/dashBoard/home/settings/DokaanProfile";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			{/* <Header title='Settings' /> */}
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<DokaanProfile/>
				<Notifications />
				<Security />
				<ConnectedAccounts />
				<LogoutZone />
				<DangerZone />
			</main>
		</div>
	);
};
export default SettingsPage;
