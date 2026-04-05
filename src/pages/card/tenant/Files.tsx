import FilesTab from "@/features/files/FilesTab";
import { useIntegrations } from "@/lib/useIntegrations";

export default function Files({ data }: { data?: any }) {
  const integrations = useIntegrations();
  const tenantId = data?.tenant?.id;

  if (!tenantId) {
    return (
      <div className="space-y-3" data-testid="tab-files">
        <div className="text-sm opacity-70">Tenant file context unavailable.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="tab-files">
      <FilesTab
        doorloop={Boolean(integrations?.doorloop)}
        dropbox={Boolean(integrations?.dropbox)}
        entity="tenants"
        refId={tenantId}
      />
    </div>
  );
}
