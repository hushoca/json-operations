import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import tokenize, { Tokenizer } from "./tokenize";

function Test(){
  const [code, setCode] = useState(`{\n"test": 123\n}`);
  const res = tokenize(code);
  const stateMachine = new Tokenizer(`0.2.5`);
  let e = "";
  try {
    stateMachine.optionalNumber();
  } catch(ee) {
    e = JSON.stringify(ee);
  } 
  return (
    <div>
      Input: {e}
      <div>
        <textarea defaultValue={code} onChange={ev => setCode(ev.target.value)}></textarea>
      </div>
      {
        res.success ? 
          <>
            Success
            <pre>
              {JSON.stringify(res.result, null, 2)}
            </pre>
          </>
        :
          <>
            Success
            <pre>
              {JSON.stringify(res.errors, null, 2)}
            </pre>
          </>
      }
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>
);
