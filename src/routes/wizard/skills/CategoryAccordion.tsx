import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Category } from "@/api/schemas"
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder"
import { AccordionItem } from "@/components/ui/accordion"
import { isCategoryFullySelected } from "@/store/selectors"
import { useWizardActions, useWizardStore } from "@/store/wizard"
import { SkillCard } from "./SkillCard"

export function CategoryAccordion({ category }: { category: Category }) {
  const { t } = useTranslation()
  const allSelected = useWizardStore((s) => isCategoryFullySelected(category, s.selections))
  const { selectAllInCategory, clearCategory } = useWizardActions()

  return (
    <AccordionItem
      value={category.id}
      id={`category-${category.id}`}
      className="scroll-mt-6 border-b border-line py-5 not-last:border-b sm:py-6"
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-start gap-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-4 cursor-pointer">
          <ImagePlaceholder src={category.icon} className="size-14 shrink-0 sm:size-20" />
          <span className="flex min-w-0 flex-1 flex-col gap-1 pt-1 sm:gap-2">
            <span className="text-lg font-semibold text-ink sm:text-xl">{category.title}</span>
            <span className="text-sm text-ink-muted sm:text-base">{category.description}</span>
          </span>
          <span className="self-center text-ink transition-colors group-hover:text-brand">
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
