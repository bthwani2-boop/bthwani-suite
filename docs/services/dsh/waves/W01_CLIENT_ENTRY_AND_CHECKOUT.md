# W01_CLIENT_ENTRY_AND_CHECKOUT

## Objective

Open the customer entry funnel from discovery to cart and checkout confirmation.

## Included Screens

- `dsh_client_entry_discovery_home`
- `dsh_client_category_or_store_detail`
- `dsh_client_cart_review`
- `dsh_client_checkout_confirm`

## Required Before Open

- discovery page shell and discovery cards
- cart and checkout UI bundle
- explicit loading, empty, retry, validation, and submit-failure states

## Forbidden Scope Drift

- no WLT ownership leakage
- no proxy path inside the mainline checkout flow
- no partner or captain screens opened here

## Closure Rule

W01 closes only when the four screens form one readable customer entry chain with no hidden runtime dependency.