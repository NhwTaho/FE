# Coffee Admin Front-end Rules

## UI
Use shadcn/ui whenever possible.
Do not create custom primitive UI components if shadcn already provides one.

## Icons
Use Lucide React only.

## Language
Code: English.
UI copy: Vietnamese.

## Styling
Use Tailwind CSS.
Use semantic tokens.
Never hardcode random HEX colors inside page components.

## Components
Shared business-independent components belong in /components/shared.
Module-specific components belong inside the module.

## Data
Never hardcode datasets inside JSX.
All mock data must live in data/mocks.

## Forms
React Hook Form + Zod.

## Tables
Use the project DataTable component.
Do not create a different table implementation for every page.

## Status
Status color and labels must use centralized mappings.

## Domain
Equipment is serial-managed.
Consumables are quantity-managed.

Machine serial lifecycle:
Inventory → Sale → Delivery → Installation → Warranty → Maintenance.

## Architecture
Do not modify shared components without checking their impact on existing screens.

## UX
Every data page must consider:
Loading
Empty
Error
Success
Permission denied when relevant

## Scope
Do not invent features that are not present in the approved requirements.
