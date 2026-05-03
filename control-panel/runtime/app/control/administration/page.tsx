import { redirect } from 'next/navigation';

export default function ControlAdministrationPage() {
  redirect('/control?tab=administration');
}
