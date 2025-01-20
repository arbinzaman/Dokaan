import { useUser } from "../../../contexts/AuthContext";

const DokaanProfile = () => {
    const{dokaan} = useUser();
    return (
        <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 bg-gray-900 text-gray-100">
        <img src={dokaan.dokaan_imageUrl} alt="" className="w-32 h-32 mx-auto rounded-full bg-gray-500 aspect-square" />
        <div className="space-y-4 text-center divide-y divide-gray-700">
            <div className="my-2 space-y-1">
                <h2 className="text-xl font-semibold sm:text-2xl">{dokaan.dokaan_name}</h2>
                <p className="px-5 text-xs sm:text-base text-gray-400">{dokaan.dokaan_phone}</p>
                <p className="px-5 text-xs sm:text-base text-gray-400">{dokaan.dokaan_email}</p>
                <p className=" text-xs sm:text-base text-gray-400">Dokaan Type: {dokaan.dokaan_type}</p>
                <p className=" text-xs sm:text-base text-gray-400">{dokaan.dokaan_location}</p>
            </div>
        
        </div>
    </div>
    );
};

export default DokaanProfile;