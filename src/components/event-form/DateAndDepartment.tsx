import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface DateAndDepartmentProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function DateAndDepartment({ formData, setFormData }: DateAndDepartmentProps) {
  const [departments, setDepartments] = useState<string[]>(["CSE", "EEE", "ECE", "MECHANICAL", "CHEMICAL", "Other"]);
  const [customDepartment, setCustomDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(formData.department || "");

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    if (value !== "Other") {
      setFormData({ ...formData, department: value });
      setCustomDepartment("");
    }
  };

  const handleCustomDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomDepartment(value);
    setFormData({ ...formData, department: value });
  };

  const handleCustomDepartmentBlur = () => {
    if (customDepartment && !departments.includes(customDepartment)) {
      const newDepartments = [...departments];
      newDepartments.splice(departments.length - 1, 0, customDepartment);
      setDepartments(newDepartments);
      setSelectedDepartment(customDepartment);
      toast({
        title: "Department Added",
        description: `${customDepartment} has been added to the departments list.`
      });
      console.log("New department added:", customDepartment);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="w-full">
          <label className="text-sm font-medium block mb-1.5">Start Date</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <label className="text-sm font-medium block mb-1.5">End Date</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div className="w-full">
        <label className="text-sm font-medium block mb-1.5">Department</label>
        <Select 
          value={selectedDepartment}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedDepartment === "Other" && (
          <Input
            className="mt-2 w-full"
            placeholder="Enter new department"
            value={customDepartment}
            onChange={handleCustomDepartmentChange}
            onBlur={handleCustomDepartmentBlur}
          />
        )}
      </div>
    </div>
  );
}