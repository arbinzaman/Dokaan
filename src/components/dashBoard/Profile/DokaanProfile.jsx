import { useUser } from "../../../contexts/AuthContext";

const DokaanProfile = () => {
    const { dokaan } = useUser();

    return (
        <div className="flex flex-col items-center bg-transparent dark:bg-transparent text-black dark:text-white ">
            {/* Profile Image */}
            <img 
                src={dokaan.dokaan_imageUrl} 
                alt="Dokaan Profile" 
                className="w-10 h-10 rounded-full   mb-3" 
            />

            {/* Profile Information */}
            <div className="text-center">
                <h2 className="text-xs font-medium ">{dokaan.dokaan_name}</h2>
                {/* <p className="text-xs text-gray-400 truncate">{dokaan.dokaan_phone}</p>
                <p className="text-xs text-gray-400 truncate">{dokaan.dokaan_email}</p>
                <p className="text-xs text-gray-400 truncate">Type: {dokaan.dokaan_type}</p>
                <p className="text-xs text-gray-400 truncate">{dokaan.dokaan_location}</p> */}
            </div>
        </div>
    );
};

export default DokaanProfile;
