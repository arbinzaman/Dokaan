import { useUser } from "../../../contexts/AuthContext";

const DokaanProfile = () => {
    const { dokaan } = useUser();

    return (
        <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800 text-gray-100">
            {/* Profile Image */}
            <img 
                src={dokaan.dokaan_imageUrl} 
                alt="Dokaan Profile" 
                className="w-16 h-16 rounded-full bg-gray-700 object-cover mb-3" 
            />

            {/* Profile Information */}
            <div className="text-center">
                <h2 className="text-sm font-medium truncate">{dokaan.dokaan_name}</h2>
                <p className="text-xs text-gray-400 truncate">{dokaan.dokaan_phone}</p>
                <p className="text-xs text-gray-400 truncate">{dokaan.dokaan_email}</p>
                <p className="text-xs text-gray-400 truncate">Type: {dokaan.dokaan_type}</p>
                <p className="text-xs text-gray-400 truncate">{dokaan.dokaan_location}</p>
            </div>
        </div>
    );
};

export default DokaanProfile;
