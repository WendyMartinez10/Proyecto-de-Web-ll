import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../shared/context/AuthContext.jsx';
import { AppRouter } from '../navigation/AppRouter.jsx';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
