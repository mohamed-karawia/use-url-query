# use-query-data

A **React custom hook** for managing URL queries in **Next.js** applications. This hook allows you to sync multiple types of data (**numbers, arrays, objects**) with the URL and parse them back into state, making it easy to manage **state-based navigation**.

> **Note:** This package is specifically designed for **Next.js** and requires `next/navigation`.

---

## 🚀 Installation

```sh
npm install use-query-data
```

---

## 📌 Usage

### **Basic Example** (Sync a single query parameter)
```tsx
import React, { useState } from "react";
import useURLQuery from "use-query-data";

const App = () => {
    const [page, setPage] = useState(1);

    useURLQuery({
        queries: { page },
        onURLChange: (params) => {
            if (params.page) {
                setPage(+params.page);
            }
        },
    });
    
    return <div>App</div>;
};

export default App;
```

---

### **Handling Multiple Queries**
```tsx
const App = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useURLQuery({
        queries: { page, pageSize },
        onURLChange: (params) => {
            if (params.page) {
                setPage(+params.page);
            }
            if (params.pageSize) {
                setPageSize(+params.pageSize);
            }
        },
    });
    
    return <div>App</div>;
};

export default App;
```

---

### **Handling Complex Queries (Objects & Arrays)**
```tsx
const App = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        range: [0, 100],
        status: "active",
    });

    useURLQuery({
        queries: { page, filters },
        onURLChange: (params) => {
            if (params.page) {
                setPage(+params.page);
            }
            if (params.filters) {
                setFilters(params.filters);
            }
        },
    });
    
    return <div>App</div>;
};

export default App;
```

---

## ⚡ Features
✅ Works **only with Next.js** (`next/navigation` required).  
✅ Syncs **numbers, arrays, and objects** to the URL.  
✅ Automatically parses and restores values on navigation.  
✅ Keeps the URL clean by removing empty values.  
✅ Ideal for **pagination, filtering, and preserving state** in the URL.  

---

## 📜 API Reference

### **useURLQuery**
```ts
useURLQuery({
  queries: Record<string, any>,
  onURLChange: (params: Record<string, any>) => void
});
```

#### **Parameters:**
| Name          | Type                        | Description |
|--------------|---------------------------|-------------|
| `queries`    | `Record<string, any>`      | Object containing state values to sync with the URL. |
| `onURLChange` | `(params: Record<string, any>) => void` | Callback function triggered when the URL changes. |

---

## 📄 License
This project is licensed under the **MIT License**.

