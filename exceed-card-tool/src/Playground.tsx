import { useState, useEffect } from "react";

export function Component() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount((c) => c + 1);
  }

  useEffect(() => console.log(count), [count]);

  const [jsonText, setJsonText] = useState<string>("");

  useEffect(() => {
    setJsonText("");

    fetch("/templates/SeventhCross/SeventhCross.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((jsonData) => setJsonText(jsonData))
      .catch((error) => console.error("Failed to fetch:", error));
  }, []);

  return (
    <div className="m-2">
      <button
        onClick={handleClick}
        className="bg-white text-black rounded-xs cursor-pointer px-1"
      >
        Click Me!
      </button>
      <span> Count: {count}</span>
      <div>{jsonText}</div>
    </div>
  );
}
