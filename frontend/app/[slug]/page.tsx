import { HospitalAiWorkbench } from "@/components/ai-os/HospitalAiWorkbench";
import { pageMeta, type PageSlug } from "@/lib/ai-hospital-data";
import { notFound } from "next/navigation";

function isPageSlug(value: string): value is PageSlug {
  return value in pageMeta;
}

export default function AppPage({ params }: { params: { slug: string } }) {
  if (!isPageSlug(params.slug)) notFound();
  return <HospitalAiWorkbench slug={params.slug} />;
}
