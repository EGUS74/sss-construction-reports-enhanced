"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  MapPin,
  ClipboardSignature,
  CloudSun,
  Users2,
  Truck,
  Package,
  TrendingUp,
  AlertTriangle,
  Camera,
  PenLine,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DailyReportFormData, SubmitReportResult } from "@/lib/actions";
import { submitDailyReport } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";

// ⬇️ Zod Schema
const formSchema = z.object({
  projectId: z.string().min(3),
  gpsLocation: z.string().min(5),
  date: z.date(),
  weather: z.string().min(3),
  manpower: z.string().min(10),
  equipmentHours: z.string().min(5),
  materialsUsed: z.string().min(5),
  progressUpdates: z.string().min(10),
  risksIssues: z.string().min(5),
  photoDataUri: z.string().optional().refine(val => !val || val.startsWith("data:image/"), {
    message: "Photo must be a valid data URI.",
  }),
  digitalSignature: z.string().min(2),
});

type DailyReportFormValues = z.infer<typeof formSchema>;

interface DailyReportFormProps {
  onFormSubmitSuccess?: (result: SubmitReportResult) => void;
}

export function DailyReportForm({ onFormSubmitSuccess }: DailyReportFormProps) {
  const { toast } = useToast();
  const { setIsLoading, isOffline } = useAppContext();
  const [isSubmitting, setIsSubmittingState] = useState(false);

  // ✅ MOVE useState INSIDE THE COMPONENT
  const [labors, setLabors] = useState([{ name: "", hours: "" }]);
  const handleLaborChange = (index: number, field: string, value: string) => {
    const updated = [...labors];
    updated[index][field as keyof typeof updated[0]] = value;
    setLabors(updated);
  };
  const addLabor = () => setLabors([...labors, { name: "", hours: "" }]);
  const removeLabor = (index: number) => {
    const updated = [...labors];
    updated.splice(index, 1);
    setLabors(updated);
  };

  const [equipment, setEquipment] = useState([{ name: "", hours: "", operator: "" }]);
  const handleEquipmentChange = (index: number, field: string, value: string) => {
    const updated = [...equipment];
    updated[index][field as keyof typeof updated[0]] = value;
    setEquipment(updated);
  };
  const addEquipment = () => setEquipment([...equipment, { name: "", hours: "", operator: "" }]);
  const removeEquipment = (index: number) => {
    const updated = [...equipment];
    updated.splice(index, 1);
    setEquipment(updated);
  };

  const form = useForm<DailyReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      gpsLocation: "",
      date: new Date(),
      weather: "",
      manpower: "",
      equipmentHours: "",
      materialsUsed: "",
      progressUpdates: "",
      risksIssues: "",
      photoDataUri: "",
      digitalSignature: "",
    },
  });

  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting, setIsLoading]);

  async function onSubmit(values: DailyReportFormValues) {
    setIsSubmittingState(true);

    const fullReport = {
      ...values,
      labors,
      equipment,
      date: format(values.date, "yyyy-MM-dd"),
      timestamp: new Date().toISOString(),
    };

    if (isOffline) {
      localStorage.setItem(`offlineReport_${Date.now()}`, JSON.stringify(fullReport));
      toast({
        title: "Offline Mode",
        description: "Report saved locally.",
      });
      setIsSubmittingState(false);
      form.reset();
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess({ success: true, message: "Offline", submittedData: fullReport });
      }
      return;
    }

    try {
      const result = await submitDailyReport(fullReport);
      if (result.success) {
        toast({ title: "Submitted", description: result.message });
        form.reset();
        if (onFormSubmitSuccess) onFormSubmitSuccess(result);
      } else {
        toast({ title: "Failed", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSubmittingState(false);
    }
  }

  const formFields = [
    { name: "projectId", label: "Project ID", placeholder: "e.g., PJ-1023-RiverCrossing", icon: ClipboardSignature },
    { name: "gpsLocation", label: "GPS Location", placeholder: "e.g., Site Marker 12B", icon: MapPin },
    { name: "date", label: "Date", icon: CalendarIcon, type: "date" },
    { name: "weather", label: "Weather", placeholder: "e.g., Sunny", icon: CloudSun, type: "textarea" },
    { name: "manpower", label: "Manpower", placeholder: "e.g., 3 Laborers", icon: Users2, type: "textarea" },
    { name: "equipmentHours", label: "Equipment Hours", placeholder: "e.g., Crane: 6hrs", icon: Truck, type: "textarea" },
    { name: "materialsUsed", label: "Materials Used", placeholder: "e.g., 5 tons gravel", icon: Package, type: "textarea" },
    { name: "progressUpdates", label: "Progress Updates", placeholder: "e.g., Completed trench", icon: TrendingUp, type: "textarea" },
    { name: "risksIssues", label: "Risks & Issues", placeholder: "e.g., None", icon: AlertTriangle, type: "textarea" },
    { name: "photoDataUri", label: "Photo (Data URI)", placeholder: "data:image/...", icon: Camera },
    { name: "digitalSignature", label: "Signature", placeholder: "Full Name", icon: PenLine },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((fieldInfo) => (
            <FormField
              key={fieldInfo.name}
              control={form.control}
              name={fieldInfo.name as keyof DailyReportFormValues}
              render={({ field }) => (
                <FormItem className={fieldInfo.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <FormLabel className="flex items-center text-base">
                    <fieldInfo.icon className="mr-2 h-5 w-5 text-primary" />
                    {fieldInfo.label}
                  </FormLabel>
                  <FormControl>
                    {fieldInfo.type === "date" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full text-left", !field.value && "text-muted")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value as Date} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    ) : fieldInfo.type === "textarea" ? (
                      <Textarea {...field} placeholder={fieldInfo.placeholder} className="min-h-[100px]" />
                    ) : (
                      <Input {...field} placeholder={fieldInfo.placeholder} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* ✅ LABOR INPUT SECTION */}
          <h3 className="text-md font-semibold mt-6 mb-2">Labor Entries</h3>
          {labors.map((labor, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border rounded w-1/2"
                value={labor.name}
                onChange={(e) => handleLaborChange(i, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Hours"
                className="p-2 border rounded w-1/4"
                value={labor.hours}
                onChange={(e) => handleLaborChange(i, 'hours', e.target.value)}
              />
              <button type="button" onClick={() => removeLabor(i)} className="text-red-600 font-bold">✕</button>
            </div>
          ))}
          <button type="button" onClick={addLabor} className="text-blue-600 text-sm underline">+ Add another labor</button>

          {/* ✅ EQUIPMENT INPUT SECTION */}
          <h3 className="text-md font-semibold mt-6 mb-2">Equipment Used</h3>
          {equipment.map((item, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Equipment Name"
                className="p-2 border rounded w-1/3"
                value={item.name}
                onChange={(e) => handleEquipmentChange(i, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Hours"
                className="p-2 border rounded w-1/6"
                value={item.hours}
                onChange={(e) => handleEquipmentChange(i, 'hours', e.target.value)}
              />
              <input
                type="text"
                placeholder="Operator (optional)"
                className="p-2 border rounded w-1/3"
                value={item.operator}
                onChange={(e) => handleEquipmentChange(i, 'operator', e.target.value)}
              />
              <button type="button" onClick={() => removeEquipment(i)} className="text-red-600 font-bold">✕</button>
            </div>
          ))}
          <button type="button" onClick={addEquipment} className="text-blue-600 text-sm underline">+ Add equipment</button>
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto text-lg py-3 px-6">
          {isSubmitting ? "Submitting..." : (<><Send className="mr-2 h-5 w-5" /> Submit Daily Report</>)}
        </Button>
      </form>
    </Form>
  );
}
