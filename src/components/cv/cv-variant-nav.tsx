import Link from "next/link";
import type { CVVariant } from "@/data/cv-data";

const variantLabels: Record<CVVariant, string> = {
  fullstack: "Full-Stack",
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
};

interface CVVariantNavProps {
  currentVariant: CVVariant;
}

export function CVVariantNav({ currentVariant }: CVVariantNavProps) {
  return (
    <nav
      className="no-print mx-auto w-[780px] mb-4 flex items-center gap-1 p-1 rounded-lg"
      style={{ background: "#e5e7eb" }}
    >
      {(Object.entries(variantLabels) as [CVVariant, string][]).map(
        ([key, label]) => (
          <Link
            key={key}
            href={`/cv/${key}`}
            className={`flex-1 text-center py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              currentVariant === key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {label}
          </Link>
        )
      )}
    </nav>
  );
}
