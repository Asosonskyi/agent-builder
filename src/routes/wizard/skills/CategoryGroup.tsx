import type { CategoryGroup as CategoryGroupData } from "@/api/schemas"
import { CategoryAccordion } from "./CategoryAccordion"

export function CategoryGroup({ group }: { group: CategoryGroupData }) {
  return (
    <section aria-labelledby={`group-${group.id}`} className="mt-10 first:mt-0 sm:mt-12">
      <h2
        id={`group-${group.id}`}
        className="text-sm font-semibold tracking-wide text-ink uppercase"
      >
        {group.title}
      </h2>
      <div className="mt-2 flex flex-col">
        {group.categories.map((category) => (
          <CategoryAccordion key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
