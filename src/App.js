import React, { useState, useEffect } from "react";
import "./App.css";

const Calculator = () => {
  const [system, setSystem] = useState("10"); // Default to base 10
  const [operand1, setOperand1] = useState("");
  const [operand2, setOperand2] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // State to control history visibility

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
    setHistory(savedHistory);
  };
  const clearHistory = () => {
    setHistory([]); 
    localStorage.removeItem("calculatorHistory"); 
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const saveToHistory = (entry) => {
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("calculatorHistory", JSON.stringify(updatedHistory));
  };

  // Handle operand input based on selected number system
  const handleOperandChange = (e, setOperand) => {
    const value = e.target.value.toUpperCase();
    let isValid = false;

    // Define regex patterns for each base
    const patterns = {
      "2": /^[0-1]*$/,         // Binary
      "8": /^[0-7]*$/,         // Octal
      "10": /^\d*$/,           // Decimal
      "16": /^[0-9A-F]*$/      // Hexadecimal
    };

    // Check if value matches the pattern for the current base
    if (patterns[system].test(value)) {
      isValid = true;
    }

    if (isValid) {
      setOperand(value); // Set the operand only if input is valid
    }
  };

  const handleCalculation = (operation) => {
    const base = parseInt(system);
    let op1 = parseInt(operand1, base);
    let op2 = parseInt(operand2, base);
    let res;
  
    switch (operation) {
      case "+":
        res = op1 + op2;
        break;
      case "-":
        res = op1 - op2;
        break;
      case "*":
        res = op1 * op2;
        break;
      case "/":
        res = op2 !== 0 ? op1 / op2 : "∞"; // Perform division without Math.floor() for decimal result
        break;
      default:
        res = null;
    }
  
    setResult(res);
    saveToHistory({
      operand1,
      operand2,
      operation,
      system,
      result: res,
      resultsInBases: {
        binary: res.toString(2),
        octal: res.toString(8),
        decimal: res.toString(10),
        hex: res.toString(16).toUpperCase(),
      },
    });
  };
  

  const handleSystemChange = (e) => {
    setSystem(e.target.value);
    setOperand1("");
    setOperand2("");
    setResult(null);
  };

  return (
    <div className="calculator">
      <h1>Calculator</h1>

      {/* System selection */}
      <label>Choose Number System</label>
      <select value={system} onChange={handleSystemChange}>
        <option value="2">Binary (2)</option>
        <option value="8">Octal (8)</option>
        <option value="10">Decimal (10)</option>
        <option value="16">Hexadecimal (16)</option>
      </select>

      {/* Input fields with validation */}
      <div className="inputs">
        <input
          type="text"
          value={operand1}
          placeholder="Operand 1"
          onChange={(e) => handleOperandChange(e, setOperand1)}
        />
        <input
          type="text"
          value={operand2}
          placeholder="Operand 2"
          onChange={(e) => handleOperandChange(e, setOperand2)}
        />
      </div>

      {/* Operation buttons */}
      <div className="operations">
        {["+", "-", "*", "/"].map((op) => (
          <button key={op} onClick={() => handleCalculation(op)}>
            {op}
          </button>
        ))}
      </div>

      {/* Result display */}
      {result !== null && (
        <div className="result">
          <p>Result: {result}</p>
          <p>Binary: {result.toString(2)}</p>
          <p>Octal: {result.toString(8)}</p>
          <p>Decimal: {result}</p>
          <p>Hexadecimal: {result.toString(16).toUpperCase()}</p>
        </div>
      )}

      {/* Toggle History Button */}
      <button className="toggle-history" onClick={toggleHistory}>
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {/* History */}
      {showHistory && (
        <div className="history">
          <h2>Calculation History</h2>
          <button className="clear-history" onClick={clearHistory}>
            Clear History
          </button>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {entry.operand1} {entry.operation} {entry.operand2} (Base {entry.system}) ={" "}
                {entry.result} | Binary: {entry.resultsInBases.binary} | Octal:{" "}
                {entry.resultsInBases.octal} | Decimal: {entry.resultsInBases.decimal} |
                Hex: {entry.resultsInBases.hex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calculator;
