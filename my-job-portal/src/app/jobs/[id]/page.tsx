import JobDetailClient from "./JobDetailClient";

export async function generateStaticParams() {
  const { MOCK_JOBS } = await import("@/lib/mockJobs");
  return MOCK_JOBS.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetailClient id={id} />;
}
