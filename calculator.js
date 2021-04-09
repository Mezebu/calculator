const calculator = {
  screenValue: "0",
  leftOperand: "0",
  rightOperand: null,
  currArithmeticOperator: null,
  lastType: null,
};

const display = document.querySelector(".display");
const calculatorContainer = document.querySelector(".calculator");

const isArithmeticOperator = (symbol) => {
  return ["add", "subtract", "multiply", "divide", "percent"].includes(symbol);
};

const isLastCharDecimal = (str) => str.charAt(str.length - 1) === ".";
const hasDecimal = (str) => str.includes(".");

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const percent = (a, b) => (a / 100) * b;

const arithmeticFunc = {
  add,
  subtract,
  multiply,
  divide,
  percent,
};

const getCurrentTotal = () => {
  const { leftOperand, rightOperand, currArithmeticOperator } = calculator;
  if (rightOperand === null) {
    return leftOperand;
  }
  return arithmeticFunc[currArithmeticOperator](
    parseFloat(leftOperand),
    parseFloat(rightOperand)
  );
};

calculatorContainer.addEventListener("click", (e) => {
  const target = e.target;
  if (target.nodeName !== "BUTTON") {
    return;
  }

  const {
    screenValue,
    currArithmeticOperator,
    lastType,
    leftOperand,
    rightOperand,
  } = calculator;

  let newScreenValue;
  let currentType;

  const symbol = target.dataset.symbol;
  const buttonContent = target.textContent;
  // const inputValue = display.value;

  if (!symbol) {
    currentType = "number";
    if (currArithmeticOperator) {
      if (
        (rightOperand === null ||
          hasDecimal(rightOperand) ||
          isLastCharDecimal(rightOperand)) &&
        buttonContent === "."
      ) {
        newScreenValue = screenValue;
      } else {
        const newRightOperand =
          (rightOperand === "0" && buttonContent !== ".") ||
          rightOperand === null
            ? buttonContent
            : `${rightOperand}${buttonContent}`;
        calculator.rightOperand = newRightOperand;
        if (rightOperand === "0" && buttonContent !== ".") {
          newScreenValue = `${screenValue.slice(0, -1)}${buttonContent}`;
        } else {
          newScreenValue = `${screenValue}${buttonContent}`;
        }
      }
    } else {
      if (
        (hasDecimal(leftOperand) || isLastCharDecimal(leftOperand)) &&
        buttonContent === "."
      ) {
        newScreenValue = screenValue;
      } else {
        const newLeftOperand =
          leftOperand === "0" && buttonContent !== "."
            ? buttonContent
            : `${leftOperand}${buttonContent}`;
        calculator.leftOperand = newLeftOperand;
        newScreenValue = newLeftOperand;
      }
    }
  } else {
    // Can we create a function to find arithmetic operators?
    // if (
    //   operators === "add" ||
    //   operators === "subtract" ||
    //   operators === "percent" ||
    //   operators === "multiply" ||
    //   operators === "divide"
    // ) {
    if (isArithmeticOperator(symbol)) {
      currentType = "arithmeticOperator";
      if (lastType === "arithmeticOperator") {
        newScreenValue = `${screenValue.slice(0, -2)}${buttonContent} `;
      } else {
        newScreenValue = `${screenValue} ${buttonContent} `;

        if (lastType === "calculate") {
          calculator.leftOperand = screenValue;
        }

        if (currArithmeticOperator) {
          calculator.leftOperand = getCurrentTotal().toString();
          calculator.rightOperand = null;
        }
      }
      // display.value = inputValue + buttonContent;
      calculator.currArithmeticOperator = symbol;
    }

    if (symbol === "calculate") {
      if (lastType === "calculate") {
        return;
      }
      currentType = "calculate";
      newScreenValue = getCurrentTotal().toString();
      calculator.leftOperand = "0";
      calculator.rightOperand = null;
      calculator.currArithmeticOperator = null;
      // console.log("equal-to key");
    }

    if (symbol === "clear-all") {
      currentType = null;
      newScreenValue = "0";
      calculator.leftOperand = "0";
      calculator.rightOperand = null;
      calculator.currArithmeticOperator = null;
      // console.log("clear key");
    }
  }

  calculator.screenValue = newScreenValue;
  calculator.lastType = currentType;
  display.value = newScreenValue;
  console.log(calculator);
});
