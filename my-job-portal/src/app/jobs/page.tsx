import AuthGuard from '@/components/auth/AuthGuard';
import JobList from '@/components/jobs/JobList';

export default function JobsPage() {
  return (
    <AuthGuard>
      <JobList />
    </AuthGuard>
  );
}

export const metadata = {
  title: 'Jobs - Nexora',
  description: 'Browse and search for job opportunities on Nexora.',
};