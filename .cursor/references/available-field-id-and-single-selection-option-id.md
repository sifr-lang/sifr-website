# Available field-id and single-selection-option-id

These are the available field-id and single-selection-option-id for the **sifr-lang** project (project number **1**):

```
{
  "field_id": "PVTSSF_lADOD7GYsM4BQXzizg-gvqs",
  "field_name": "Status",
  "options": [
    {
      "id": "f75ad846",
      "name": "Todo"
    },
    {
      "id": "47fc9ee4",
      "name": "In Progress"
    },
    {
      "id": "98236657",
      "name": "Done"
    }
  ]
}
{
  "field_id": "PVTSSF_lADOD7GYsM4BQXzizg-gvwo",
  "field_name": "Priority",
  "options": [
    {
      "id": "da922e20",
      "name": "P0"
    },
    {
      "id": "9bc1b2dd",
      "name": "P1"
    },
    {
      "id": "2700ea9d",
      "name": "P2"
    }
  ]
}
{
  "field_id": "PVTSSF_lADOD7GYsM4BQXzizg-gvws",
  "field_name": "Size",
  "options": [
    {
      "id": "93492018",
      "name": "XS"
    },
    {
      "id": "c6f01e52",
      "name": "S"
    },
    {
      "id": "03c3cb3d",
      "name": "M"
    },
    {
      "id": "53aa16f1",
      "name": "L"
    },
    {
      "id": "b5d5681a",
      "name": "XL"
    }
  ]
}
{
  "field_id": "PVTSSF_lADOD7GYsM4BQXzizg-gvxY",
  "field_name": "Ticket Type",
  "options": [
    {
      "id": "b0d09ed6",
      "name": "Epic"
    },
    {
      "id": "60afd93e",
      "name": "Task"
    }
  ]
}
```

**Workflow mapping:** For the board columns Backlog / Ready / In Progress / Review / Done, use **Todo** as Backlog for new tickets and **In Progress** for work in progress. To get full columns (Backlog, Ready, Review), add those options to the Status field in the project settings on GitHub (Project → … → Settings → Status), then re-run the command below to refresh this list.

If not found or after adding new Status options, use the following command to get all single-select fields and their options:

```
gh project field-list 1 --owner sifr-lang --format json | jq '.fields[] | select(.type == "ProjectV2SingleSelectField") | {field_id: .id, field_name: .name, options: .options}'
```
