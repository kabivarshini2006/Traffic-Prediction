
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PredictionFormProps {
  onPredict: (data: PredictionData) => void;
  isLoading: boolean;
}

export interface PredictionData {
  DateTime: string;
  Junction: number;
  Weather_Condition: string;
  Speed_Limit: number;
}

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [formData, setFormData] = useState<PredictionData>({
    DateTime: "",
    Junction: -1,
    Weather_Condition: "",
    Speed_Limit: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    
    if (id === "junction") {
      setFormData({ ...formData, Junction: parseInt(value) });
    } else if (id === "speed") {
      setFormData({ ...formData, Speed_Limit: parseInt(value) });
    } else if (id === "weather") {
      setFormData({ ...formData, Weather_Condition: value });
    } else if (id === "datetime") {
      setFormData({ ...formData, DateTime: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.DateTime) {
      toast.error("Please select a date and time");
      return;
    }
    
    if (formData.Junction < 0) {
      toast.error("Please select a junction type");
      return;
    }
    
    if (!formData.Weather_Condition) {
      toast.error("Please select weather condition");
      return;
    }
    
    const speed = formData.Speed_Limit;
    if (!speed || isNaN(speed) || speed < 10 || speed > 100) {
      toast.error("Speed limit must be between 10 and 100 mph");
      return;
    }
    
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="datetime" className="block text-sm font-medium">
            Future Date and Time
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <input
              type="datetime-local"
              id="datetime"
              onChange={handleChange}
              className="w-full bg-muted pl-10 pr-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              aria-label="Future date and time"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="junction" className="block text-sm font-medium">
            Junction Type
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <RoadIcon className="h-5 w-5" />
            </span>
            <select
              id="junction"
              onChange={handleChange}
              className="w-full bg-muted pl-10 pr-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none"
              aria-label="Junction type"
              required
            >
              <option value="-1" disabled selected>
                Select junction type
              </option>
              <option value="0">No Junction</option>
              <option value="1">Junction Present</option>
            </select>
            <span className="absolute right-3 top-3 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="weather" className="block text-sm font-medium">
            Weather Condition
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <CloudSunIcon className="h-5 w-5" />
            </span>
            <select
              id="weather"
              onChange={handleChange}
              className="w-full bg-muted pl-10 pr-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none"
              aria-label="Weather condition"
              required
            >
              <option value="" disabled selected>
                Select weather
              </option>
              <option value="Clear">Clear</option>
              <option value="Rain">Rain</option>
              <option value="Snow">Snow</option>
              <option value="Fog">Fog</option>
              <option value="Cloudy">Cloudy</option>
            </select>
            <span className="absolute right-3 top-3 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="speed" className="block text-sm font-medium">
            Speed Limit (mph)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <GaugeIcon className="h-5 w-5" />
            </span>
            <input
              type="number"
              id="speed"
              onChange={handleChange}
              min="10"
              max="100"
              placeholder="Enter speed limit (10-100)"
              className="w-full bg-muted pl-10 pr-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              aria-label="Speed limit"
              required
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full py-6 text-base bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-0.5 transition-all duration-200"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="mr-2 h-5 w-5 animate-spin" />
            Predicting...
          </>
        ) : (
          <>
            <LineChartIcon className="mr-2 h-5 w-5" />
            Predict Traffic & Rules
          </>
        )}
      </Button>
    </form>
  );
};

// Icons 
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const RoadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 22h8" />
    <path d="M10 22V2" />
    <path d="M14 22V2" />
  </svg>
);

const CloudSunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="M20 12h2" />
    <path d="m19.07 4.93-1.41 1.41" />
    <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
    <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
  </svg>
);

const GaugeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const LineChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" x2="12" y1="2" y2="6" />
    <line x1="12" x2="12" y1="18" y2="22" />
    <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
    <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
    <line x1="2" x2="6" y1="12" y2="12" />
    <line x1="18" x2="22" y1="12" y2="12" />
    <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
    <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
  </svg>
);

export default PredictionForm;
