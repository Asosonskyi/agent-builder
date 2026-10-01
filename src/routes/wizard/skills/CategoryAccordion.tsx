import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Category } from "@/api/schemas"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"
import { AccordionItem } from "@/components/ui/accordion"
import { isCategoryFullySelected } from "@/store/selectors"
import { useWizardStore } from "@/store/wizard"
import { SkillCard } from "./SkillCard"

export function CategoryAccordion({ category }: { category: Category }) {
  const { t } = useTranslation()
  const allSelected = useWizardStore((s) => isCategoryFullySelected(category, s.selections))
  const selectAllInCategory = useWizardStore((s) => s.selectAllInCategory)
  const clearCategory = useWizardStore((s) => s.clearCategory)

  return (
    <AccordionItem
      value={category.id}
      id={`category-${category.id}`}
      className="scroll-mt-6 border-b border-line py-6 not-last:border-b"
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-start gap-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <ImagePlaceholder src={category.icon} className="size-20 shrink-0" />
          <span className="flex flex-1 flex-col gap-2 pt-1">
            <span className="text-xl text-ink">{category.title}</span>
            <span className="text-base text-ink-muted">{category.description}</span>
          </span>
          <span className="self-center text-ink">
            <PlusIcon className="size-6 group-data-panel-open:hidden" />
            <MinusIcon className="hidden size-6 group-data-panel-open:block" />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Panel className="pt-5">
        <button
          type="button"
          onClick={() => (allSelected ? clearCategory(category.id) : selectAllInCategory(category))}
          className="text-base text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {allSelected ? t("skills.unselectAll") : t("skills.selectAll")}
        </button>
        <ul className="mt-4 flex flex-col gap-2">
          {category.skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} categoryId={category.id} />
          ))}
        </ul>
      </AccordionPrimitive.Panel>
    </AccordionItem>
  )
}
