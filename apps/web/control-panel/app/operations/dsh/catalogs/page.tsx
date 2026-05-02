import { redirect } from 'next/navigation';

export default function DshCatalogsPage() {
  redirect('/operations?workspace=catalogs');
}
