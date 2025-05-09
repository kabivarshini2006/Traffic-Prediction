
import React, { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export interface PredictionResult {
  traffic_condition: string;
  traffic_rule: string;
  history: { traffic_condition: string }[];
}

interface ResultsSectionProps {
  result: PredictionResult;
  weather: string;
}

const ResultsSection: FC<ResultsSectionProps> = ({ result, weather }) => {
  const { traffic_condition, traffic_rule, history } = result;

  const getTrafficClass = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "low":
        return "traffic-low";
      case "moderate":
        return "traffic-moderate";
      case "high":
        return "traffic-high";
      default:
        return "";
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case "rain":
        return "🌧️";
      case "snow":
        return "❄️";
      case "fog":
        return "🌫️";
      case "cloudy":
        return "☁️";
      case "clear":
      default:
        return "☀️";
    }
  };

  const trafficClass = getTrafficClass(traffic_condition);
  const weatherIcon = getWeatherIcon(weather);

  const trafficCounts = { Low: 0, Moderate: 0, High: 0 };
  
  history.forEach((h) => {
    if (trafficCounts.hasOwnProperty(h.traffic_condition)) {
      trafficCounts[h.traffic_condition as keyof typeof trafficCounts]++;
    }
  });
  
  const chartData = [
    { name: "Low", value: trafficCounts.Low },
    { name: "Moderate", value: trafficCounts.Moderate },
    { name: "High", value: trafficCounts.High },
  ];
  
  const barColors = {
    Low: "#10b981",
    Moderate: "#fbbf24",
    High: "#ef4444",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Traffic Prediction Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Traffic Prediction</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${trafficClass}`}>
              {traffic_condition}
            </div>
            <p className="mt-4 text-muted-foreground">
              The predicted traffic condition based on the parameters you provided.
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Weather Condition</h3>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{weatherIcon}</span>
              <span>{weather}</span>
            </div>
            <p className="mt-4 text-muted-foreground">
              Weather conditions can significantly impact traffic flow.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Safety Rules</h3>
          <p className="text-muted-foreground">{traffic_rule}</p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Traffic Distribution</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {chartData.map((entry, index) => (
                  <Bar 
                    key={index} 
                    dataKey="value" 
                    fill={barColors[entry.name as keyof typeof barColors]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsSection;
