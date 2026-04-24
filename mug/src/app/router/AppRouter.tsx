import {BrowserRouter, Routes, Route} from "react-router-dom";
import { HomePage } from "../../pages/HomePage/HomePage";
import { AuthPage } from "../../pages/AuthPage/AuthPage";
import { NavBar } from "../../widgets/navbar/NavBar";
import { TestPage } from "../../pages/TestPage/TestPage";

export const AppRouter = () => (
    <BrowserRouter>
        <NavBar/>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/Auth" element={<AuthPage/>}/>
            <Route path="/test" element={<TestPage/>}/>
        </Routes>
    </BrowserRouter>
);
