import { useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import PredictionForm, { PredictionData } from "@/components/PredictionForm";
import ResultsSection, { PredictionResult } from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import BackgroundVideo from "@/components/BackgroundVideo";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<string>("");

  const handlePredict = async (data: PredictionData) => {
    setIsLoading(true);

    try {
      // Format DateTime to ISO string (e.g., "2025-05-07T08:00:00Z")
      const formattedData = {
        ...data,
        DateTime: new Date(data.DateTime).toISOString(),
      };

      console.log("Sending request:", formattedData);

      // Make API call to the backend
      const response = await axios.post<PredictionResult>(
        "http://127.0.0.1:8001/predict",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      setWeatherCondition(data.Weather_Condition);
      setResult(response.data);
      toast.success("Traffic prediction generated successfully!");
    } catch (error: any) {
      console.error("Prediction error:", error);
      if (error.response) {
        toast.error(
          error.response.data?.detail || "Failed to generate prediction."
        );
      } else if (error.request) {
        toast.error("Unable to reach the server. Please ensure the backend is running.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundVideo />
      <div className="max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-card rounded-xl border border-border/50 shadow-lg p-6 md:p-8">
          <Header />

          <PredictionForm onPredict={handlePredict} isLoading={isLoading} />

          {result && (
            <div className="mt-8">
              <ResultsSection result={result} weather={weatherCondition} />
            </div>
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;