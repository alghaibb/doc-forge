import type { Metadata } from "next";
import { DashboardHeader } from "../../_components/dashboard-header";
import { TemplateForm } from "../_components/template-form";
import { createTemplate } from "../_actions";

export const metadata: Metadata = {
  title: "Create Template",
};

export default function NewTemplatePage() {
  return (
    <>
      <DashboardHeader title="Create Template" />
      <div className="mx-auto w-full max-w-4xl flex-1 p-6">
        <TemplateForm
          action={createTemplate}
          submitLabel="Create template"
          loadingLabel="Creating..."
        />
      </div>
    </>
  );
}
