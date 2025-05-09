
import { FC } from "react";

const Header: FC = () => {
  return (
    <header className="text-center mb-8 pb-6 border-b border-border/50">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent glow">
        Traffic Prediction & Safety
      </h1>
      <p className="text-muted-foreground">
        Plan ahead with AI-powered traffic forecasting
      </p>
    </header>
  );
};

export default Header;
