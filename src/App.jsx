import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";

const App = () => {
  return (
    // <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
    // {/* BG */}
		// 	<div className='fixed inset-0 z-0'>
		// 		<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
		// 		<div className='absolute inset-0 backdrop-blur-sm' />
		// 	</div>
 <div>
     <RouterProvider router={router}/>
 </div>  
    // </div>
  );
};

export default App;
