# Persian Date Picker integration

Avan is integrated at the shared UI boundary.

- Dependencies live in `@super-app/shared` because the picker is a cross-app UI capability.
- Avan CSS is loaded through the shared theme stylesheet, which every app already imports.
- `PersianDatePickerProvider` provides one consistent `rtl` + `fa-IR` configuration for all apps.
- Feature code should consume the Avan picker only inside Client Components.

This keeps `web-app`, `ml-app`, and `admin-app` from owning separate date-picker setup and locale configuration.
