import { redirect } from 'next/navigation';

export default function DshBellPage() {
  redirect('/operations?workspace=bell');
}
