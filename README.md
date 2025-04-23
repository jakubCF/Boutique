
# Boutique

Inventory software for poshmark sellers

# Run Locally

Clone the project

## App

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd app
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

## Server

Go to the project directory

```bash
    cd server
```

Add db URL to a new .env in the servers root

```bash
    DATABASE_URL = "your_pg_server"
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn watch
  yarn dev
```

## Authors

- [Scott Duby](https://www.github.com/Scott-Duby)

# 📦 Boutique API Reference

Base URL: `http://localhost:3000/v1`

## 🧺 Items

### Get All Items

**GET** `/items`  
**Description:** Retrieve all items from the inventory.

---

### Get Item by ID

**GET** `/items/:id`  
**Description:** Retrieve a single item by its ID.  
**Params:**

- `id`: ID of the item (e.g., `9`)

---

### Create Item

**POST** `/items/create/:name`  
**Description:** Create a new item with a name.  
**Params:**

- `name`: Name of the item (e.g., `"Green Shirt"`)

---

### Delete Item

**DELETE** `/items/delete/:id`  
**Description:** Delete an item by its ID.  
**Params:**

- `id`: ID of the item (e.g., `21`)

---

### Update Item Name

**PATCH** `/items/update/name/:id/:name`  
**Description:** Update the name of an item.  
**Params:**

- `id`: ID of the item
- `name`: New name (e.g., `"Purple Sweater"`)

---

### Update Item Sold Status

**PATCH** `/items/update/sold/:id/:name`  
**Description:** Update the sold status of an item.  
**Params:**

- `id`: ID of the item
- `name`: Sold flag (`0` or `1`)

---

### Bulk Add Items

**POST** `/items/bulk/create`  
**Description:** Add multiple items in a single request.  
**Body Example:**

```json
{
  "items": [
    { "name": "Item 1", "binId": 1, "sold": true },
    { "name": "Item 2", "binId": 2 },
    { "name": "Item 3" }
  ]
}
```

---

## 🗃️ Bins

### Get All Bins

**GET** `/bins/`  
**Description:** Retrieve all storage bins.

---

### Get Bin by ID

**GET** `/bins/:id`  
**Description:** Retrieve a specific bin by ID.  
**Params:**

- `id`: ID of the bin (e.g., `2`)

---

### Create Bin

**POST** `/bins/create/:name`  
**Description:** Create a new bin with a name.  
**Params:**

- `name`: Name of the bin (e.g., `"Long Sleeves 2"`)

---

### Delete Bin

**DELETE** `/bins/delete/:id`  
**Description:** Delete a bin by its ID.  
**Params:**

- `id`: ID of the bin (e.g., `14`)

---

### Update Bin Name

**PATCH** `/bins/update/:id/name/:value`  
**Description:** Update the name of a bin.  
**Params:**

- `id`: Bin ID
- `value`: New name (e.g., `"Shoes 4"`)

---

### Update Bin "is_full" Flag

**PATCH** `/bins/update/:id/is_full/:bool`  
**Description:** Update the "is_full" status of a bin.  
**Params:**

- `id`: Bin ID
- `bool`: `0` or `1`

---

### Add Item to Bin

**PATCH** `/bins/update/:id/add/item/:item_id`  
**Description:** Add an item to a bin.  
**Params:**

- `id`: Bin ID
- `item_id`: Item ID

---

### Remove Item from Bin

**PATCH** `/bins/update/:id/remove/item/:item_id`  
**Description:** Remove an item from a bin.
**Note:** If you are trying to connect an item to another bin you only need to call the add route, it is redundant to call both as prisma disconnects old bin and connects new one on mutation call.
**Params:**

- `id`: Bin ID
- `item_id`: Item ID

---

# Appendix

This project is meant to run locally on home software with no issues, provide your own postgres database and ports to make this run.
I created this project for my mother, and with all the other thrifters/resellers in mind. This software is for you to do as you please, and if you find any potential issues or improvements please feel free to open an issue on your refactors.

Peace!
Scott Duby
