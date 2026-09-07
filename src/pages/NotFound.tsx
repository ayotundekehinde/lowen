import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-6xl font-semibold text-line-strong">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          Off the fretboard
        </h1>
        <p className="mt-2 text-ink-muted">
          That page doesn't exist. Let's get you back in the pocket.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
