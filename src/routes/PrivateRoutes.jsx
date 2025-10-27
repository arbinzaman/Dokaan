import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/AuthContext';


const PrivateRoute = ({children}) => {
    const {user,loading} = useUser();
    const location = useLocation();

    if(loading){
        return 
    }
    if(!user){
        return <Navigate to ="/login"
         state={{from: location}}
         replace></Navigate>
    }
    return children;
};

export default PrivateRoute;