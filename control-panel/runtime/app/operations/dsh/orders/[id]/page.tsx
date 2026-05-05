import { redirect } from 'next/navigation';

type DshRoutePageProps = {
  readonly params: Promise<{
    readonly id: string;
  }>;
};

export default async function DshOrderDetailPage({ params }: DshRoutePageProps) {
  const { id } = await params;

  redirect(`/operations?workspace=orders&orderId=${encodeURIComponent(id)}&panel=detail`);
}
