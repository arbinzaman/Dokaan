import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color, onClick }) => {
	return (
		<motion.div
			onClick={onClick}
			className='bg-white dark:bg-black text-black dark:text-white bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl cursor-pointer'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium text-black dark:text-white'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p className='mt-1 text-3xl font-semibold text-black dark:text-white'>{value}</p>
			</div>
		</motion.div>
	);
};

export default StatCard;
