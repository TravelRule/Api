# IVMS101 mapping: implemented vs. full spec

[IVMS101](https://intervasp.org/) is the interVASP messaging standard most
travel-rule implementations reference. This API implements a **small,
institution-level subset** of it — this doc is a field-by-field account of
what's here and what a production system would still need to add.

## Implemented

| This API's field | IVMS101 concept | Notes |
|---|---|---|
| `originatorInstitution.name` | `originatingVASP.name` | Institution-level only |
| `originatorInstitution.lei` | `originatingVASP.legalPersonIdentification` (LEI variant) | Not validated against the real GLEIF LEI registry in this version |
| `originatorInstitution.country` | `originatingVASP.country` | ISO 3166-1 alpha-2 |
| `beneficiaryInstitution.*` | `beneficiaryVASP.*` | Mirrors originator fields |
| `paymentReference` | Not a standard IVMS101 field | Added so a message can be tied back to the on-chain transfer it accompanies |

## Explicitly NOT implemented

- **Originator/beneficiary *customer* data.** IVMS101's core purpose is
  identifying the actual sender/receiver *individuals or entities* behind
  a transfer (name, address, date of birth, national ID, etc) — not just
  the institutions. This reference version deliberately excludes all of
  this, because handling it correctly requires PII-handling
  infrastructure (encryption at rest, access controls, retention/deletion
  policy, jurisdiction-specific rules) that's a substantial project in its
  own right, and getting it subtly wrong has real legal consequences. See
  the root playbook's risk note: "don't present this as legal/compliance
  advice."
- **Legal person vs. natural person branching.** Real IVMS101 has different
  required fields depending on whether the originator/beneficiary is a
  legal entity or a natural person. Not modeled here.
- **Multiple identification document types.** Real IVMS101 supports
  passport, national ID, etc as alternatives to LEI. Only LEI is modeled
  here, and only as a well-formed-string check (20 characters), not a real
  GLEIF lookup.
- **Message-level encryption / signing.** Real travel-rule networks (TRP,
  Sygna Bridge, Notabene, etc) build in cryptographic message integrity
  and often mutual authentication between VASPs. This reference API relies
  entirely on whatever transport security you put in front of it.

## If you're extending this for a real deployment

Start by deciding, explicitly and in writing, which of the above gaps you
actually need to close for your jurisdiction and counterparties — travel-
rule requirements vary meaningfully by regulator (FATF Travel Rule
implementation differs across the US, EU, and elsewhere). Don't treat this
mapping as a checklist to blindly complete; treat it as a map of what
decisions still need to be made by someone with actual compliance
expertise, per the "person owning compliance-domain accuracy" role in the
root playbook.
