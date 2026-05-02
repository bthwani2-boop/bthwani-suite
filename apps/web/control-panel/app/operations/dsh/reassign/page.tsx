import { redirect } from 'next/navigation';

export default function DshReassignPage() {
  redirect('/operations?workspace=reassign');
}
