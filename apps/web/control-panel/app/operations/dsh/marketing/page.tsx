import { redirect } from 'next/navigation';

export default function DshMarketingPage() {
  redirect('/operations?workspace=marketing');
}
