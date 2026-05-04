import ControlPanelSurfaceHost from '../../../shell/web-entry';

type ControlSubsectionId = 'platform' | 'administration' | 'hr';

type ControlPageProps = {
  readonly searchParams?: Promise<{
    readonly tab?: string;
  }>;
};

const controlSubsectionIds = new Set<ControlSubsectionId>(['platform', 'administration', 'hr']);

export default async function ControlPage({ searchParams }: ControlPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const subsection = resolvedSearchParams?.tab && controlSubsectionIds.has(resolvedSearchParams.tab as ControlSubsectionId)
    ? (resolvedSearchParams.tab as ControlSubsectionId)
    : undefined;

  return <ControlPanelSurfaceHost section="control" subsection={subsection} />;
}
