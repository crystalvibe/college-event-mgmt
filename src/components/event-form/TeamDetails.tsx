import { Input } from "@/components/ui/input";

interface TeamDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function TeamDetails({ formData, setFormData }: TeamDetailsProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="w-full">
        <label className="text-sm font-medium block mb-1.5">Coordinator</label>
        <Input
          value={formData.coordinator}
          onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
          placeholder="Enter coordinator name"
          className="w-full"
        />
      </div>

      <div className="w-full">
        <label className="text-sm font-medium block mb-1.5">Team Members</label>
        <Input
          value={formData.teamMembers}
          onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
          placeholder="Enter team members"
          className="w-full"
        />
      </div>

      <div className="w-full">
        <label className="text-sm font-medium block mb-1.5">Resource Persons</label>
        <Input
          value={formData.resourcePersons}
          onChange={(e) => setFormData({ ...formData, resourcePersons: e.target.value })}
          placeholder="Enter resource persons"
          className="w-full"
        />
      </div>
    </div>
  );
}