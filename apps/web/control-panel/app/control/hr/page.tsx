import { redirect } from 'next/navigation';

export default function ControlHrPage() {
  redirect('/control?tab=hr');
}
