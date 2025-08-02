import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";



function App() {
  const [items, setItems] = useState([
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Orange" }
  ]);

  return (
    <ReactSortable
      list={items}
      setList={setItems}

    >
      {items.map(item => (
        <div key={item.id} style={{
          padding: "10px",
          margin: "5px",
          backgroundColor: "lightgray"
        }}>
          {item.name}
        </div>
      ))}
    </ReactSortable>
  );
}

export default App;
