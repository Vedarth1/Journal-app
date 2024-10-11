import { useRouteError ,Link} from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-400 to-indigo-900 flex flex-col justify-center items-center">
      <main className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Sorry, an unexpected error has occurred.</p>
        <p className="text-lg mb-8"><i>{error.statusText || error.message}</i></p>
        <Link to='/' className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
          Go Back Home
        </Link>
      </main>
    </div>
  );
}