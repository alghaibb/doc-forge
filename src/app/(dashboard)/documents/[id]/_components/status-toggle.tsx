"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleDocumentStatus } from "../../_actions";
import type { DocumentStatus } from "@/generated/prisma/enums";

interface StatusToggleProps {
  documentId: string;
  status: DocumentStatus;
}

export function StatusToggle({ documentId, status }: StatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleDocumentStatus(documentId);
      } catch (error) {
        console.error("Toggle document status error:", error);
      }
    });
  }

  const isCompleted = status === "COMPLETED";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : isCompleted ? (
        <Circle className="size-4" />
      ) : (
        <CheckCircle2 className="size-4" />
      )}
      {isCompleted ? "Mark as draft" : "Mark as completed"}
    </Button>
  );
}
