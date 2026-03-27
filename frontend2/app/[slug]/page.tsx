import { notFound } from "next/navigation"
import { HospitalWorkbench } from "@/components/hospital-os/workbench"
import { pageMeta, type PageSlug } from "@/lib/hospital-data"

function isPageSlug(value: string): value is PageSlug {
  return value in pageMeta
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isPageSlug(slug)) notFound()

  return <HospitalWorkbench slug={slug} />
}
