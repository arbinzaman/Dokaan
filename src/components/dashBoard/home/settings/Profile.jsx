import { useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useUser } from "../../../../contexts/AuthContext";
import ProfileUpdateModal from "../../Profile/ProfileUpdateModal";

const Profile = () => {
	const { user } = useUser();
	// console.log(user);
	const [isModalOpen, setModalOpen] = useState(false);

	// Function to open the modal
	const handleEditProfile = () => {
		setModalOpen(true);
	};

	// Function to close the modal
	const handleCloseModal = () => {
		setModalOpen(false);
	};

	return (
		<>
			<SettingSection icon={User} title={"Profile"}>
				<div className='flex flex-col sm:flex-row items-center mb-6'>
					<img
						src={user?.profileImageUrl}
						alt='Profile Picture'
						className='rounded-full w-20 h-20 object-cover mr-4'
					/>
					<div>
						<h3 className='text-lg font-semibold text-black dark:text-white'>{user?.name}</h3>
						<p className='text-black dark:text-white'>{user?.email}</p>
					</div>
				</div>
				<button
					className='bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'
					onClick={handleEditProfile} // Open the modal
				>
					Edit Profile
				</button>
			</SettingSection>

			{/* Profile Update Modal */}
			{isModalOpen && (
				<ProfileUpdateModal
					isOpen={isModalOpen}
					onClose={handleCloseModal} // Pass the close function here
					user={user?.user}
				/>
			)}
		</>
	);
};

export default Profile;
