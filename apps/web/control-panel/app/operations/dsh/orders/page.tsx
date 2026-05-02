import { redirect } from 'next/navigation';

type DshOrdersPageProps = {
  readonly searchParams?: Promise<{
    readonly orderId?: string;
    readonly panel?: string;
  }>;
};

export default async function DshOrdersPage({ searchParams }: DshOrdersPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextSearchParams = new URLSearchParams({ workspace: 'orders' });

  if (typeof resolvedSearchParams?.orderId === 'string') {
    nextSearchParams.set('orderId', resolvedSearchParams.orderId);
  }

  if (resolvedSearchParams?.panel === 'chat' || resolvedSearchParams?.panel === 'detail') {
    nextSearchParams.set('panel', resolvedSearchParams.panel);
  }

  redirect(`/operations?${nextSearchParams.toString()}`);
}
