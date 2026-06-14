
---

## 1. Project Snapshot

| Item               | Value                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| App                | Yalini Mobile — multi-role business operations admin (UI-only today)  |
| Framework          | **Expo SDK 54** (`expo ~54.0.35`)                                     |
| Language           | **TypeScript** (`~5.9.3`)                                             |
| Routing            | **React Navigation v7** (NOT Expo Router for in-app navigation)       |
| Tabs               | `@react-navigation/bottom-tabs`                                       |
| Stacks             | `@react-navigation/native-stack`                                      |
| Icons              | `@expo/vector-icons` (Ionicons + Feather only — pick one per surface) |
| Package manager    | **yarn 1.22** (declared in `packageManager` field — respect it)       |
| Backend            | Not wired yet · `EXPO_PUBLIC_BACKEND_URL` is present in `.env`        |
| Status             | UI-only · backend wiring is the next milestone                        |

### Boot sequence

```
expo-router shell (app/_layout.tsx)
        └── app/index.tsx
                └── src/navigation/RootNavigator.tsx   ← React Navigation owns everything from here
                        ├── Tab: Dashboard      → src/screens/adminScreens/Dashboard/DashboardScreen.tsx
                        ├── Tab: DailyRecords   → PlaceholderScreen
                        ├── Tab: Finance        → PlaceholderScreen
                        ├── Tab: Employees      → PlaceholderScreen
                        └── Tab: More           → src/navigation/MoreNavigator.tsx (native stack)
                                                        ├── Settings  (SettingsScreen.tsx)
                                                        ├── MyBusiness     → PlaceholderScreen
                                                        ├── EmployeesAdmin → PlaceholderScreen
                                                        ├── Vehicles       → PlaceholderScreen
                                                        ├── Hotels         → PlaceholderScreen
                                                        └── AssignAssets   → PlaceholderScreen
```

`app/index.tsx` wraps `RootNavigator` in `NavigationIndependentTree` so the
expo-router shell (kept only because the platform requires it) doesn't fight
the React Navigation tree.

**Do not touch** `app/_layout.tsx` icon-font prewarm logic — it prevents an
Expo Go Android crash when `@expo/vector-icons` mounts before fonts register.

---

## 2. Folder Layout (source of truth)

```
/app/frontend/
├── app/                                  # expo-router shell ONLY
│   ├── _layout.tsx                       # icon font prewarm — do not modify the hook usage
│   └── index.tsx                         # renders <RootNavigator />
│
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx             # bottom tabs root
│   │   ├── MoreNavigator.tsx             # native stack under \"More\" tab
│   │   ├── AppTabBar.tsx                 # custom blurred/solid bottom bar
│   │   ├── AdminNavigator.tsx            # reserved for admin role split
│   │   ├── DriverNavigator.tsx           # reserved
│   │   ├── StaffNavigator.tsx            # reserved
│   │   └── types.ts                      # *ParamList declarations live here
│   │
│   ├── screens/
│   │   ├── PlaceholderScreen.tsx         # reusable until-feature-lands screen
│   │   └── adminScreens/
│   │       ├── Dashboard/
│   │       │   └── DashboardScreen.tsx
│   │       └── Settings/                 # ← canonical feature folder shape
│   │           ├── SettingsScreen.tsx
│   │           ├── types.ts
│   │           ├── data/
│   │           │   └── settingsItems.ts  # declarative blueprint
│   │           └── components/
│   │               ├── SettingsHeader.tsx
│   │               ├── SettingsSectionLabel.tsx
│   │               ├── SettingsRowCard.tsx
│   │               └── LogoutConfirmSheet.tsx
│   │
│   ├── components/
│   │   ├── common/                       # cross-feature reusables (SectionHeader, StatusPill…)
│   │   └── dashboard/                    # feature-scoped components
│   │
│   ├── hooks/
│   │   ├── use-icon-fonts.ts             # do not touch
│   │   └── useDashboard.ts               # data hook pattern (initial / refresh / stale-guard)
│   │
│   ├── services/
│   │   └── dashboardService.ts           # API boundary — mock today, fetch tomorrow
│   │
│   ├── data/                             # mock datasets (kept until backend lands)
│   ├── types/                            # shared domain types (DashboardData, Submission, …)
│   ├── theme/
│   │   └── index.ts                      # SINGLE source of truth for tokens
│   └── utils/
│       ├── format.ts                     # date / number helpers
│       └── storage/                      # do NOT bypass — use `@/src/utils/storage`
│
├── assets/                               # images & fonts shipped with the app
├── app.json
├── package.json                          # respect `packageManager
└── tsconfig.json
```

### Feature-folder shape (always use this)

```
src/screens/<role>Screens/<Feature>/
├── <Feature>Screen.tsx        # one screen-level file, orchestrates state
├── types.ts                   # local types
├── data/                      # declarative blueprints, mock seeds
└── components/                # screen-only sub-components (<50 lines each)
```

Anything reused by 2+ features is promoted to `src/components/common/`.

---

## 3. Design Tokens (`src/theme/index.ts`)

Use tokens, never hex literals (except inside `theme/index.ts` itself).

| Token group | Examples                                                                 |
| ----------- | ------------------------------------------------------------------------ |
| `colors`    | `surface`, `surfaceSecondary`, `textPrimary`, `textSecondary`, `brand`…  |
| `tones`     | `purple`, `green`, `orange`, `blue`, `teal`, `red` — each has `{ cardBg, iconBg, accent }` |
| `spacing`   | `xs:4`, `sm:8`, `md:12`, `lg:16`, `xl:24`, `xxl:32`                      |
| `radius`    | `sm:6`, `md:12`, `lg:20`, `pill:999`                                     |
| `fontSize`  | `xs:11`, `sm:12`, `base:14`, `lg:16`, `xl:20`, `xxl:24`                  |
| `cardShadow`| Tier-1 soft shadow for white cards on grey surfaces                      |

**Page heading colour is `#0B1F3F`** (deep navy) — used by titles like
"Settings" and card titles. Defined inline today; promote to `colors.heading`
when used in 3+ places.

When a new visual tint is needed (e.g. teal for Assign Assets) **add it as a
new `tones` entry** rather than hardcoding. That's how `teal` and `red`
landed.

---

## 4. Navigation Conventions

1. **All `*ParamList` types live in `src/navigation/types.ts`.**
   Add the new screen there first.
2. Tab-level screens go directly in `RootNavigator`.
3. Anything reached from inside a tab goes into a **native stack navigator**
   for that tab (see `MoreNavigator` as the reference).
4. Use the typed navigation prop inside screens:
   ```ts
   const navigation = useNavigation<NativeStackNavigationProp<MoreStackParamList, \"Settings\">>();
   navigation.navigate(\"MyBusiness\"); // type-safe — typo fails to compile
   ```
5. Placeholder destinations use `PlaceholderScreen` until the real screen
   exists. Always wire **typed** destinations so the stack stays compile-safe.

---

## 5. Screen-Building Recipe

The Settings screen is the canonical example. Follow these steps when adding
a new screen.

### Step 1 — Add the route type
Edit `src/navigation/types.ts`:
```ts
export type MoreStackParamList = {
  Settings: undefined;
  MyBusiness: undefined;
  /* + your new screen */
  Vendors: undefined;
};
```

### Step 2 — Create the feature folder
```
src/screens/adminScreens/Vendors/
├── VendorsScreen.tsx
├── types.ts
├── data/vendorsMock.ts
└── components/...
```

### Step 3 — Build the screen scaffold

```tsx
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../../../theme";

const TAB_BAR_CLEARANCE = 72; // matches AppTabBar height

export default function VendorsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      testID="vendors-screen"
    >
      <ScrollView
        testID="vendors-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
        }}
      >
        {/* content */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSecondary },
});
```

### Step 4 — Register the screen in the appropriate navigator
```tsx
<Stack.Screen name="Vendors" component={VendorsScreen} />
```

### Step 5 — Split into sub-components in `components/`
Each sub-component should:
- Be **< 50 lines** of JSX where possible
- Receive primitives (string/number/colour) + callbacks — not slices of global state
- Define its own `StyleSheet.create({...})` at the bottom
- Expose a `testID` (or a `testID` prop on the container)

### Step 6 — Move static config out of JSX
If the screen renders a list, the list **data** lives in
`data/<feature>Items.ts` as a typed array. The screen stays declarative:
```tsx
{ITEMS.map((row) => <RowCard key={row.key} {...row} onPress={…} />)}
```

---

## 6. Component Patterns

### Tappable card with tinted icon tile (canonical row)

Use the `SettingsRowCard` shape:
- Outer: `Pressable` with `cardShadow`, `borderRadius: radius.lg`, white bg
- Left: square 56×56 tile, `borderRadius: 16`, background from `tones[x].iconBg`
- Middle: title (`fontWeight: 700`, heading colour) + subtitle (`textSecondary`)
- Right: `Ionicons name="chevron-forward"` in `#2563EB`
- For destructive rows pass a `destructive` prop and repaint to the `tones.red` palette

### Section label with accent bar

`<SettingsSectionLabel label="ACCOUNT" accentColor={tones.red.accent} />`
— short coloured pill + uppercase tracked label.

### Header block

Big title (38pt / 800), secondary subtitle (22pt / 500), 16pt description.
See `SettingsHeader`.

---

## 7. Bottom Sheets · Toasts · Modals (no `Alert`)

- **Never use `Alert.alert`.** Always use a styled `Modal` (with a transparent
  backdrop) or a custom bottom sheet. See `LogoutConfirmSheet`.
- Confirmation sheets follow this shape:
  - Grabber handle (40×4 pill, `colors.border`)
  - Tinted icon circle (56×56)
  - Title (`fontSize.xl`, 700) + body (`fontSize.base`, `textSecondary`)
  - Two CTAs: secondary (ghost) + primary (filled). Destructive primary uses `tones.red.accent`.
- Sheets must respect `insets.bottom` so the home indicator never overlaps the CTA.
- The backdrop `Pressable` must dismiss; the inner `Pressable` must swallow
  taps via `onPress={() => {}}`.

---

## 8. testID Rules (zero tolerance)

Every interactive element and every key info element gets a kebab-case
`testID` that describes its **role**, not its style.

Good: `settings-row-logout`, `logout-confirm-button`, `dashboard-retry-button`
Bad: `red-button`, `card1`, `btn`

Existing prefixes you should reuse:
- `tab-<routename>` — bottom tab buttons
- `<feature>-screen` — root container
- `<feature>-scroll` — main scroll view
- `<feature>-row-<id>` — list items
- `<feature>-<action>-button` — CTAs

---

## 9. Safe Area & Layout Rules

- Wrap every screen container with `paddingTop: insets.top`
  (or use `SafeAreaView edges={['top']}` if no custom header).
- Bottom-tab screens add `paddingBottom: insets.bottom + 72`
  (72 = `AppTabBar` height) to their `ScrollView` content.
- Sticky headers live **outside** the `ScrollView` (see `DashboardScreen`).
- Horizontal chip / filter rows are `ScrollView horizontal` with
  `showsHorizontalScrollIndicator={false}` and **never** wrap to a second
  line. Each chip gets `flexShrink: 0`. Add spacing via `contentContainerStyle.gap`.

---

## 10. Data, Hooks & Services

Today the codebase is UI-only — every screen reads from mocks. The contract
to backend goes through `src/services/<feature>Service.ts`:

```ts
// Mock today
export async function fetchVendors(): Promise<Vendor[]> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_VENDORS;
}

// Tomorrow — replace body, keep signature
// const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/vendors`);
// if (!res.ok) throw new Error(\"…\");
// return (await res.json()) as Vendor[];
```

UI never calls services directly — it goes through a hook (see `useDashboard`
for the canonical pattern: `loading` / `refreshing` / `error` / `refresh()` +
stale-response guard with `requestId.current`).

---

## 11. Icons — what to use

| Family   | When                                                                   |
| -------- | ---------------------------------------------------------------------- |
| Ionicons | Default for content surfaces — broader catalogue (`*-outline` variants)|
| Feather  | Reserved for chrome (tab bar, section headers, small UI affordances)   |

Do **not** mix Ionicons + Feather inside the same row/card; pick one and stick with it.

Reusable icon names already in use:
- `storefront-outline`, `people-outline`, `car-outline`, `business-outline`,
  `swap-horizontal-outline`, `log-out-outline`, `chevron-forward` (Ionicons)
- `home`, `calendar`, `credit-card`, `users`, `more-horizontal`,
  `chevron-right` (Feather)

---

## 12. Storage

Always go through `@/src/utils/storage` for key/value persistence.
Never import `@react-native-async-storage/async-storage`, `expo-secure-store`,
`expo-sqlite/kv-store`, or `react-native-mmkv` directly.

---

## 13. Environment Variables

| Key                        | Owner    | Notes                                  |
| -------------------------- | -------- | -------------------------------------- |
| `EXPO_PUBLIC_BACKEND_URL`  | platform | Use for all API calls                  |
| `EXPO_PACKAGER_HOSTNAME`   | platform | **Do not modify**                      |
| `EXPO_PACKAGER_PROXY_URL`  | platform | **Do not modify**                      |
| `MONGO_URL`                | platform | Backend only — never imported in app   |

Access via `process.env.EXPO_PUBLIC_BACKEND_URL`. No fallback values — let
missing config fail fast.

---

## 14. Adding Dependencies

Always:
```bash
cd /app/frontend && yarn expo install <package-name>
```

This pins the version against Expo SDK 54. Never edit `package.json` by hand.

Forbidden libs (web-only or deprecated):
- `react-router-dom`, `@mui/material`, `antd`, `chakra-ui`, `framer-motion`
- `expo-av`, `expo-barcode-scanner`, `expo-background-fetch`, `@expo-google-fonts/*`
- Any `tailwindcss` / CSS-file based styling

---

## 15. Quality Gate Before Finishing Any Feature

1. `cd /app/frontend && npx tsc --noEmit` passes.
2. `sudo supervisorctl restart expo` and tail
   `/var/log/supervisor/expo.out.log` — no red errors.
3. Screenshot the new screen at **412×915** (mobile width) and confirm the
   layout matches the design (no clipping, no overlap with the bottom tab bar).
4. Every interactive element has a `testID`.
5. No `Alert.alert` anywhere — confirmation flows go through a custom Modal.
6. No new hex literals in screen files — token everything via `src/theme`.

---

## 16. Quick Reference: \"Add a new tab destination\" (5-minute checklist)

- [ ] Add screen to `MoreStackParamList` in `src/navigation/types.ts`
- [ ] Create `src/screens/adminScreens/<Feature>/<Feature>Screen.tsx`
- [ ] Register screen in `src/navigation/MoreNavigator.tsx`
- [ ] If the entry point is Settings, add a row to
      `src/screens/adminScreens/Settings/data/settingsItems.ts`
- [ ] Run `npx tsc --noEmit` — green
- [ ] Restart expo, screenshot, confirm
