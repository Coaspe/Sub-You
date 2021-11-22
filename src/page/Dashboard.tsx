import { signOut } from "../helpers/auth-OAuth2";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";

const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <div className="cursor-pointer" onClick={() => {
            signOut()
            navigate("/login")
        }}>
            <Header />
        </div>
    );
}

export default Dashboard;