import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeftIcon, ArrowRightIcon, LoaderCircleIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useCategories, useGoals } from "@/api/queries"
import { contactSchema, type Contact, type EstimatePayload } from "@/api/schemas"
import { submitEstimate } from "@/api/submit"
import { FormField } from "@/components/common/FormField"
import { ButtonLink } from "@/components/common/ButtonLink"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SummaryPanel } from "@/routes/wizard/components/SummaryPanel"
import { WizardFooter } from "@/routes/wizard/components/WizardFooter"
import { WizardLayout } from "@/routes/wizard/components/WizardLayout"
import { useWizardStore } from "@/store/wizard"
import type { SkillsLocationState } from "@/routes/wizard/guards"

const FORM_ID = "contact-form"

export default function ContactStep() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // RequireGoal + RequireSkills guarantee a goal with selections here.
  const goalId = useWizardStore((s) => s.goalId) ?? ""
  const savedContact = useWizardStore((s) => s.contact)
  const setContact = useWizardStore((s) => s.setContact)
  const resetWizard = useWizardStore((s) => s.resetWizard)

  const goal = useGoals().data?.find((g) => g.id === goalId)
  const catalog = useCategories(goalId).data

  const form = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: savedContact,
    mode: "onTouched",
  })
  const { errors } = form.formState

  // Persist typed values so a reload on Step 3 keeps them.
  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => setContact(values),
      }),
    [form, setContact],
  )

  const submit = useMutation({
    mutationFn: submitEstimate,
    onSuccess: async () => {
      // Commit the navigation first (flushSync bypasses the router's transition): resetting
      // while /contact is still rendered would trip its guard and redirect to /skills.
      await navigate("/success", { state: { submitted: true }, replace: true, flushSync: true })
      resetWizard()
    },
  })

  const onSubmit = form.handleSubmit((contact) => {
    const { locale, selections } = useWizardStore.getState()
    const payload: EstimatePayload = {
      locale,
      goalId,
      skills: Object.entries(selections).map(([skillId, s]) => ({
        skillId,
        connectorIds: s.connectorIds,
      })),
      contact: { ...contact, company: contact.company || undefined },
    }
    submit.mutate(payload)
  })

  const goToCategory = (categoryId: string) =>
    void navigate("/skills", {
      state: { focusCategoryId: categoryId } satisfies SkillsLocationState,
    })

  return (
    <WizardLayout
      step={3}
      title={t("contact.title")}
      subtitle={t("contact.subtitle")}
      aside={<SummaryPanel goal={goal} catalog={catalog} onChangeCategory={goToCategory} />}
      footer={
        <WizardFooter
          back={
            <ButtonLink variant="back" size="xl" to="/skills" className="max-sm:px-4">
              <ArrowLeftIcon />
              <span className="max-sm:sr-only">{t("contact.back")}</span>
            </ButtonLink>
          }
          next={
            <Button size="xl" type="submit" form={FORM_ID} disabled={submit.isPending}>
              {submit.isPending ? t("common.sending") : t("contact.submit")}
              {submit.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <ArrowRightIcon />
              )}
            </Button>
          }
        />
      }
    >
      <form
        id={FORM_ID}
        noValidate
        onSubmit={onSubmit}
        className="mt-8 flex flex-col gap-6 lg:mt-14"
      >
        <FormField label={t("contact.name")} error={errors.name}>
          {(props) => <Input autoComplete="name" {...props} {...form.register("name")} />}
        </FormField>
        <FormField label={t("contact.email")} error={errors.email}>
          {(props) => (
            <Input type="email" autoComplete="email" {...props} {...form.register("email")} />
          )}
        </FormField>
        <FormField label={t("contact.company")} error={errors.company}>
          {(props) => (
            <Input autoComplete="organization" {...props} {...form.register("company")} />
          )}
        </FormField>
        {submit.isError && (
          <p role="alert" className="text-base text-danger">
            {t("common.submitError")}
          </p>
        )}
      </form>
    </WizardLayout>
  )
}
