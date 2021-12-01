import Header from "../components/Header";
import Timeline from "./Timeline";
import Sidebar from "./Sidebar";
const Dashboard = () => {
    return (
        <div className="bg-main bg-opacity-20">
            <Header />
            <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
                <Timeline />
                <Sidebar />
            </div>
        </div>
    );
}

export default Dashboard;