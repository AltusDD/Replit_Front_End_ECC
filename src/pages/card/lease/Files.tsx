import FilesTab from "@/features/files/FilesTab";
import { useIntegrations } from "@/lib/useIntegrations";

export default function Files({ data }: { data?: any }) {
  const integrations = useIntegrations();
  const leaseId = data?.lease?.id;

  if (!leaseId) {
    return (
      <div className="space-y-3" data-testid="tab-files">
        <div className="text-sm opacity-70">Lease file context unavailable.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="tab-files">
      <FilesTab
        doorloop={Boolean(integrations?.doorloop)}
        dropbox={Boolean(integrations?.dropbox)}
        entity="leases"
        refId={leaseId}
      />
    </div>
  );
}
