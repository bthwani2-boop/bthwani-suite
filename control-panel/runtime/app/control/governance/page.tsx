import { redirect } from 'next/navigation';

export default function ControlGovernancePage() {
  redirect('/control?tab=governance');
}
