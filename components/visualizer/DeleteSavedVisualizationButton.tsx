"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteSavedVisualizationButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <button
      type="button"
      disabled={isDeleting}
      onClick={async () => {
        setIsDeleting(true);

        try {
          await fetch(`/api/saved-visualizations/${id}`, {
            method: "DELETE",
          });
          router.refresh();
        } finally {
          setIsDeleting(false);
        }
      }}
      className="rounded-full border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
