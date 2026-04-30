import { redirect } from 'next/navigation';

type DshRoutePageProps = {
  readonly params: Promise<{
    readonly id: string;
  }>;
};

export default async function DshSheinProxySchedulePage({ params }: DshRoutePageProps) {
  const { id } = await params;

  redirect(`/operations/dsh/sheinproxy/${id}`);
}
