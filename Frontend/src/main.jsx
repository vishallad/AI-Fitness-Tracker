import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { AuthProvider } from 'react-oauth2-code-pkce';
import { authConfig } from './config/authConfig.js';
import Activities from './pages/activities/index.jsx';
import ActivityDetails from './pages/activities/details.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/activities",
    element: <Activities/>
  },
  {
    path:"/activities/:id",
    element: <ActivityDetails/>
  }
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <AuthProvider authConfig={authConfig}>
        <RouterProvider router={
          router
        } />
      </AuthProvider>
    </Provider>
)
