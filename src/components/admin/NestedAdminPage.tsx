import type { ReactNode } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { DetailShell, type DetailCrumb } from "@/components/admin/DetailShell";

type NestedAdminPageProps = {
  backHref: string;
  backLabel: string;
  crumbs: DetailCrumb[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/** Breadcrumb + back link + PageHeader for nested admin list/detail pages */
export default function NestedAdminPage({
  backHref,
  backLabel,
  crumbs,
  title,
  subtitle,
  actions,
  children,
}: NestedAdminPageProps) {
  return (
    <DetailShell backHref={backHref} backLabel={backLabel} crumbs={crumbs}>
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </DetailShell>
  );
}
