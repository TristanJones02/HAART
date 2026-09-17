/**
 * Forms entry point. `DynamicForm` is a client component; the prefill and
 * status helpers are plain functions safe to call from server components:
 *
 *   const prefill = prefillFromSearchParams(await searchParams);
 *   <DynamicForm definition={getFormDefinition('preAdoptionDogs')} prefill={prefill} initialStatus={formStatusFromSearchParams(await searchParams)} />
 */
export { DynamicForm } from './DynamicForm';
export type { DynamicFormProps } from './DynamicForm';
export { prefillFromSearchParams, formStatusFromSearchParams } from '@/lib/forms/prefill';
export type { FormPrefill } from '@/lib/forms/prefill';
