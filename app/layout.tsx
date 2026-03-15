import "./globals.css";
import Chatbot from "../components/chatbot/Chatbot";
import { ChatbotProvider } from "../components/chatbot/ChatbotProvider";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative antialiased">
        <ChatbotProvider>
          {children}
          <Footer />
          <Chatbot />
        </ChatbotProvider>
      </body>
    </html>
  );
}
