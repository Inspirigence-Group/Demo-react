# Project Architecture: Kommo Real Estate Widget

## Overview
This project is a **Kommo CRM (formerly AmoCRM) Widget** designed for Real Estate management. It integrates directly into the Kommo CRM interface to allow agents to manage properties, scrape listings from external sites (Mubawab, Avito, etc.), match properties to leads using AI, and generate PDF brochures.

## Tech Stack
- **Framework**: React 18 (with TypeScript)
- **Build Tool**: Webpack
- **Styling**: CSS (PostCSS)
- **State Management**: React `useState` / `useEffect` + Local Services
- **Storage**: 
  - Kommo `products` list (Cloud Sync)
  - `IndexedDB` (Local Cache)
  - `localStorage` (Settings/Fallback)

---

## 1. Entry Points & Lifecycle
The widget follows the standard Kommo Widget architecture using a factory pattern defined in `window.define`.

### `src/index.ts`
- The main entry point that determines if the environment is **Development** (localhost) or **Production**.
- Loads module aliases and requires `integration.ts`.

### `src/integration.ts`
- Initializes the `Integration` class.
- Registers the standard Kommo callbacks:
  - `render` -> `renderCallback`
  - `init` -> `initCallback`
  - `bind_actions` -> `bindActionsCallback`
  - `settings` -> `settingsCallback`
  - `onSave` -> `onSaveCallback`
  - `destroy` -> `destroyCallback`
  - `advancedSettings` -> `advancedSettingsCallback`

---

## 2. Core Callbacks (The "Controller" Layer)
Located in `src/callbacks/`, these functions bridge the Kommo Event Loop with the React Application.

| Callback | File Path | Description |
|----------|-----------|-------------|
| **render** | `src/callbacks/renderCallback/renderCallback.tsx` | **CRITICAL**. Mounts the React application into the Kommo UI. It detects the context (Lead Detail, Contact Detail, or Settings) and renders either `LeadRealEstatePage` or `RealEstatePage`. |
| **bind_actions** | `src/callbacks/bindActionsCallback/bindActionsCallback.tsx` | Handles DOM event binding when the user navigates between pages within Kommo without a full reload. |
| **settings** | `src/callbacks/settingsCallback/settingsCallback.tsx` | Renders the Widget Settings modal (`SettingsModalPage`) where API keys and configurations are managed. |
| **onSave** | `src/callbacks/onSaveCallback/onSaveCallback.tsx` | Triggered when the user saves widget settings. Persists configuration. |
| **init** | `src/callbacks/initCallback/initCallback.ts` | Runs once when the widget initializes. Setup logic goes here. |

---

## 3. UI Architecture (Pages & Components)
The UI is built with React and located in `src/pages` and `src/components`.

### `src/pages/RealEstatePage/RealEstatePage.tsx`
- **Context**: Main Dashboard (Lists/Contacts).
- **Functionality**:
  - Displays a list of all properties.
  - CRUD operations for properties.
  - Triggering the Scraper Modal.
  - Exporting to CSV/PDF.
  - Duplicate detection.
  - State management for the property list.

### `src/pages/LeadRealEstatePage/LeadRealEstatePage.tsx`
- **Context**: Inside a specific Deal/Lead card.
- **Functionality**:
  - Shows properties specifically attached to *this* lead.
  - **Auto-Matching**: Uses `PropertyMatchingService` to find properties that match the lead's criteria.
  - **AI Matching**: Displays AI-suggested properties based on chat logs/notes.
  - Attach/Detach properties to the lead.

### `src/components/`
- **RealEstate/PropertyForm**: Form for creating/editing properties.
- **RealEstate/PhotoManager**: Drag-and-drop photo management.
- **RealEstate/PropertyScraperModal**: Interface for inputting URLs to scrape.
- **RealEstate/LeadPropertyCard**: The card view shown inside a Lead.

---

## 4. Services (The "Model" & Logic Layer)
Located in `src/services/`, these singletons handle business logic, data persistence, and external APIs.

### `src/services/kommoRealEstateService.ts`
- **Role**: The "Repository" for Property data.
- **Key Functions**:
  - `createProperty`, `updateProperty`, `deleteProperty`: Manage property entities.
  - **Sync Strategy**: 
    1. Saves immediately to `IndexedDB` (via `indexedDBStorageService`) for instant UI feedback.
    2. Syncs to Kommo's "Products List" (Catalog) in the background for cloud storage.
- **Dependencies**: `kommoAPIService`, `indexedDBStorageService`.

### `src/services/propertyScrapingService.ts`
- **Role**: Handles scraping logic.
- **Supported Sites**: Mubawab, Avito.ma, Claren Luxury, Custom.
- **Logic**: Fetches HTML (often via proxy to avoid CORS), parses DOM using standard selectors, extracts fields (Price, Title, Location, Photos), and returns normalized `ScrapedProperty` objects.

### `src/services/kommoAPIService.ts`
- **Role**: Wrapper around Kommo's AJAX API (`AMOCRM.ajax`, `$authorizedAjax`).
- **Key Functions**:
  - `getDeal(id)`: Fetches full deal details.
  - `extractLeadRequirements(deal)`: Parses custom fields from a deal to determine what the client is looking for (Budget, City, Type).

### `src/services/propertyMatchingService.ts`
- **Role**: The "Brain" for matching Leads <-> Properties.
- **Logic**:
  - **Rule-Based**: Compares structured fields (Price range vs Budget, City vs City).
  - **AI-Based**: Uses `openAIService` (if key is present) to analyze unstructured data (notes, chat logs) and find semantic matches.

### `src/services/pdfService.ts`
- **Role**: Generates PDF brochures for properties.
- **Tech**: `jspdf`, `jspdf-autotable`.

---

## 5. Data Flow Diagram

1.  **User Action**: User opens a Lead card.
2.  **Render**: `renderCallback` fires -> Mounts `LeadRealEstatePage`.
3.  **Data Fetching**:
    - `kommoAPIService` fetches Deal data (Budget, Requirements).
    - `kommoRealEstateService` fetches available Properties (from IndexedDB/Cloud).
4.  **Matching**:
    - `propertyMatchingService` compares Deal Requirements vs Properties.
    - (Optional) `openAIService` reads chat logs for nuance.
5.  **Display**: Matched properties are shown in `LeadPropertyCard`.
6.  **Action**: User clicks "Attach".
7.  **Persistence**: `kommoRealEstateService` updates the link between Deal ID and Property ID in storage.

## 6. Key Configuration & Constants
- **Aliases**: `crmModuleAliases.ts` defines how the widget interacts with Kommo's requireJS system.
- **Manifest**: `manifest.json` (root) defines widget permissions and locations (leads, contacts, settings).
