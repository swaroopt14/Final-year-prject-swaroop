import { notFound, redirect } from "next/navigation"
import { HospitalWorkbench } from "@/components/hospital-os/workbench"
import { isNavVisible } from "@/lib/auth"
import { pageMeta, type PageSlug } from "@/lib/hospital-data"
import { getSessionUser } from "@/lib/server-auth"

function isPageSlug(value: string): value is PageSlug {
  return value in pageMeta
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const { slug } = await params
  if (!isPageSlug(slug)) notFound()
  if (!isNavVisible(user.role, slug)) redirect("/dashboard")

  return <HospitalWorkbench slug={slug} user={user} />
}
