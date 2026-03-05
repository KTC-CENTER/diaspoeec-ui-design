import { Suspense } from 'react';
import EvenementDetailPage from './client-page';

export async function generateStaticParams() {
  return [{ id: '_' }];
}

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
    </div>
  );
}

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <EvenementDetailPage params={props.params} />
    </Suspense>
  );
}
