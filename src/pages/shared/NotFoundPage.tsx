import { Button } from '@/components/ui/button'; 
import { Frown } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
      style={{ backgroundColor: '#F8F8F8' }} 
    >
      <div
        className="relative p-8 rounded-lg shadow-xl max-w-lg mx-auto"
        style={{
          backgroundColor: 'white',
          border: '1px solid #E0E0E0',
        }}
      >
        {/* Decorative background element (optional, adds flair) */}
        <div
          className="absolute inset-0 rounded-lg opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, #4D37B3, transparent 70%)`,
          }}
        ></div>

        <div className="relative z-10">
          <Frown
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: '#4D37B3' }}
          />

          <h1
            className="text-6xl font-extrabold mb-4"
            style={{ color: '#4D37B3' }}
          >
            404
          </h1>

          <p
            className="text-2xl font-semibold mb-3"
            style={{ color: '#333333' }}
          >
            Page Not Found
          </p>

          <p className="text-lg text-gray-600 mb-8">
            Oops! It seems like the page you're looking for doesn't exist.
          </p>

          <Button
            onClick={() => window.history.back()}
            className="px-8 py-3 text-lg font-medium transition-transform transform hover:scale-105"
            style={{
              backgroundColor: '#4D37B3',
              color: 'white',
              boxShadow: '0 4px 15px rgba(77, 55, 179, 0.3)',
            }}
          >
            Go Back
          </Button>

          <Button
            onClick={() => window.location.href = '/'} // Or your home route
            variant="link"
            className="ml-4 text-lg"
            style={{ color: '#4D37B3' }}
          >
            Return to Home
          </Button>
        </div>
      </div>

      <p className="mt-10 text-gray-500 text-sm">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default NotFoundPage;