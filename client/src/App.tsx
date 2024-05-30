import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import MainPage from './pages/mainPage/MainPage';
import SignUp from './pages/SignUp/SignUp';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <MainPage /> },
        {
          path: '/register',
          element: <SignUp />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
