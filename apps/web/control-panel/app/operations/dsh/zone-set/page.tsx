import { redirect } from 'next/navigation';

export default function DshZoneSetPage() {
  redirect('/operations?workspace=zone-set');
}
