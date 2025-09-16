import {} from '@/lib/ecc-resolvers';
import CardPanel from "@/components/cardkit/CardPanel";

export default function Legal() {
  return (
    <div className="space-y-3">
      <CardPanel title="Assessor & APN">
        <div className="text-sm opacity-70">APN & GIS links (CoreLogic) will appear here.</div>
      </CardPanel>
      <CardPanel title="Linked Cases">
        <div className="text-sm opacity-70">No cases linked.</div>
      </CardPanel>
    </div>
  );
}