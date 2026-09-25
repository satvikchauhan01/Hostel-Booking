import { RefreshCw, WifiOff, TriangleAlert } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

export function ErrorState({ title = "Couldn't load rooms.", error, message, onRetry, retrying }) {
  const isNetwork = error?.kind === 'network';
  return (
    <EmptyState
      tone="danger"
      icon={isNetwork ? <WifiOff size={26} /> : <TriangleAlert size={26} />}
      title={title}
      message={message ?? (isNetwork ? 'Please check your connection and try again.' : (error?.message ?? 'Please try again in a moment.'))}
      action={
        onRetry && (
          <Button variant="primary" icon={<RefreshCw size={16} />} onClick={onRetry} loading={retrying}>
            Retry
          </Button>
        )
      }
    />
  );
}
