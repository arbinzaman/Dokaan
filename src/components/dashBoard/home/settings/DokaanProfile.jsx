import { useState } from "react";
import SettingSection from "./SettingSection";
import { useUser } from "../../../../contexts/AuthContext";
import { GiShop } from "react-icons/gi";
import DokaanUpdateModal from "../../Profile/DokaanUpdateModal";
const DokaanProfile = () => {
	const { dokaan } = useUser();
	console.log(dokaan);
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
			<SettingSection icon={GiShop} title={"Dokaan Profile"}>
				<div className='flex flex-col sm:flex-row items-center mb-6'>
					<img
						src={dokaan?.dokaan_imageUrl}
						alt='Profile Picture'
						className='rounded-full w-20 h-20 object-cover mr-4'
					/>
					<div>
						<h3 className='text-lg font-semibold text-gray-100'>{dokaan?.dokaan_name}</h3>
						<p className='text-gray-400'>{dokaan?.dokaan_email}</p>
						<p className='text-gray-400'>{dokaan?.dokaan_phone}</p>
						<p className='text-gray-400'>Dokaan Type: {dokaan?.dokaan_type}</p>
						<p className='text-gray-400'>{dokaan?.dokaan_location}</p>
						<p className='text-gray-400'>{dokaan?.dokaan_phone}</p>
					</div>
				</div>
				<button
					className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'
					onClick={handleEditProfile} // Open the modal
				>
					Edit Dokaan Profile
				</button>
			</SettingSection>

			{/* Profile Update Modal */}
			{isModalOpen && (
				<DokaanUpdateModal
					isOpen={isModalOpen}
					onClose={handleCloseModal} // Pass the close function here
					user={dokaan?.user}
				/>
			)}
		</>
	);
};

export default DokaanProfile;
