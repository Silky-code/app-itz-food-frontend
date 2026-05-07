import { Navigate, Route, Routes} from 'react-router';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import AuthCallBackPage from './pages/AuthCallBackPage';
import {QueryClientProvider} from '@tanstack/react-query';
import queryClient from './api/queryClient';
import UserProfilePage from './pages/UserProfilePage';
import Hero from './components/Hero';
import ProtectedRoute from './auth/ProtectedRoute';

const AppRoutes = ()=>{
    return (
        <QueryClientProvider client={queryClient}>
        <Routes>
            <Route path="/" element={<Layout showHero={true}><HomePage/></Layout>}/>
            <Route path="/auth-callback" element={<AuthCallBackPage/>}/>

            {/*Proteccion de rutas*/}
            <Route element={<ProtectedRoute/>} > 
            <Route path='/user-profile' element={
                <Layout>
                    <UserProfilePage/>
                </Layout>}/>
            </Route>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
        </QueryClientProvider>
    )
}//fin de app routes

export default AppRoutes;