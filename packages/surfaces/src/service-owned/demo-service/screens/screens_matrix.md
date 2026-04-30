# Screens Matrix — demo-service

قالب ربط الشاشات بالمسارات والحالة والـevidence.

- Screen: `DemoListScreen`
  - Route: `/demo`
  - Surface: `app-client`
  - Owner: TBD
  - States: loading / empty / success / error / offline
  - Flow: `demo.list`
  - API: `GET /demo`
  - Visual Evidence: `evidence/screens/demo-list/before.png`, `evidence/screens/demo-list/after.png`

- Screen: `DemoDetailScreen`
  - Route: `/demo/:id`
  - Surface: `app-client`
  - Owner: TBD
  - States: loading / success / error
  - Flow: `demo.detail`
  - API: `GET /demo/{id}`
