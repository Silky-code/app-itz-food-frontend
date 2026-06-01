import { Link } from "react-router"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"

export default function MobileNavLinks(){
    const {logout} = useAuth0();
    return (
       <>
       <Link to="/user-profile"
            className="flex items-center px-3 font-bold hover:text-orange-500 mx-4">
            Perfil
       </Link>
       <Link 
        to="/order-status" 
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Ordenes
      </Link>
      <Link 
        to="/manage-restaurant" 
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Administrar Restaurante
      </Link>
       <Button onClick={() => logout()}
        className="flex items-center px-3 font-bold hover:text-orange-500 mx-4">
            Cerrar Sesión
       </Button>
       </>
    )
}