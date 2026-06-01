// app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'MindMesh',
  description: 'Your private AI knowledge intelligence system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
