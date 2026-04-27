import { redirect } from 'next/navigation';

type DshRoutePageProps = {
  readonly params: Promise<{
    readonly id: string;
  }>;
};

export default async function DshSheinProxyOfferPage({ params }: DshRoutePageProps) {
  const { id } = await params;

  redirect(`/operations/dsh/sheinproxy/${id}`);
}
