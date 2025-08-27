import "./styles/global.css";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./contexts/NotificationContext";
import ToastContainer from "./components/ToastContainer";

function App() {
  return (
    <NotificationProvider>
      <AppRoutes />
      <ToastContainer />
    </NotificationProvider>
  );
}

export default App;
