# 🛍️ Boutique

![License](https://img.shields.io/github/license/Scott-Duby/Boutique?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/Scott-Duby/Boutique?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/Scott-Duby/Boutique?style=flat-square)
![Issues](https://img.shields.io/github/issues/Scott-Duby/Boutique?style=flat-square)
![ShadCN UI](https://img.shields.io/badge/ui-shadcn/ui-blueviolet?logo=tailwindcss&style=flat-square)

> Inventory management app for organizing items and bins with inline editing, filters, and state persistence.

---

## 🧠 Features

- 🔍 Filterable & sortable item table
- ✏️ Inline editing (name, sold status, bin assignment)
- 📦 Bin management modal
- ♻️ Zustand state management
- 🪄 Table state persistence (filters, pagination)
- 💅 Built with ShadCN UI, TanStack Table, and Tailwind CSS
- 💾 Bulk item creation via modal dialog

---

## 🛠️ Tech Stack

- **React 18**
- **Zustand** – global state
- **TanStack Table** – table rendering
- **ShadCN/UI** – component library
- **Tailwind CSS** – styling
- **TypeScript** – type safety

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Scott-Duby/Boutique.git
cd Boutique
2. Install dependencies
bash
Copy
Edit
npm install
3. Start the dev server
bash
Copy
Edit
npm run dev
4. Visit the app
Go to http://localhost:3000 in your browser.
```

🧪 API Reference

```bash

Bin
type Bin = {
  id: number
  name: string
  is_full: boolean
  items: Item[]
}

Item

type Item = {
  id: number
  name: string
  sold: boolean
  web_url: string
  binId: number
  bin: Bin
}

```

```bash
🧠 Zustand Store (useBoutiqueStore)
```

```bash

const useBoutiqueStore = create<TBoutiqueStore>(() => ({
  bins: [],
  activeBin: null,
  items: [],
  setBins, setActiveBin, clearActiveBin, addBin, removeBin, updateBin, clearBins,
  setItems, addItem, removeItem, clearItems, updateItem, getItemsForTable
}));
```

🙏 Credits
💅 ShadCN/UI

🧠 TanStack Table

⚡ Zustand

🎨 Tailwind CSS

📄 License
MIT © Scott Duby

yaml
Copy
Edit
