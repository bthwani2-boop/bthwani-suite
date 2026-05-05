import { redirect } from 'next/navigation';

export default function DshPeakModePage() {
  redirect('/operations?workspace=peak-mode');
}
