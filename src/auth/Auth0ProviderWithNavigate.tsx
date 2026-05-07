
import { Auth0Provider, type AppState, User } from "@auth0/auth0-react";
import { useCreateUser } from "@/api/UserApi";
import { useNavigate } from "react-router";

type Props ={
  children: React.ReactNode
}

export function Auth0ProviderWithNavigate({ children }: Props) {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !redirectUri || !audience) {
    throw new Error('Error al inicializar Auth0');
  }

  const onRedirectCallback = (appState?: AppState, user?: User) => {
    //console.log('USER:', user);
    //if (user?.sub && user?.email) {
    //  createUser.mutate({auth0Id: user.sub, email: user.email});
    //}
    navigate('/auth-callback');
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
} 

export default Auth0ProviderWithNavigate
