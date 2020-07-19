let transactions = [];
let myChart;

fetch("/api/transaction")
  .then(response => response.json())
  .then(data => {
    // save db data on global variable
    transactions = data;

    populateTotal();
    populateTable();
    populateChart();
  });

function populateTotal() {
  // reduce transaction amounts to a single total value
  const total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  document.querySelector("#total").textContent = total;
}

function populateTable() {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach( ({name,value}) => {
    // create and populate a table row
    let tr = document.createElement("tr");
    tr.innerHTML = 
    `<td>${name}</td>
    <td>${value}</td>`

    tbody.appendChild(tr);
  });
}

function populateChart() {
  // copy array and reverse it
  let reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  const labels = reversed.map( t => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  const data = reversed.map( ({value}) => {
    return sum += parseInt(value);
  });

  // remove old chart if it exists
  if (myChart) myChart.destroy();

  const ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}

function sendTransaction(isAdding) {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".form .error");

  // validate form
  const condition = (nameEl.value === "" || amountEl.value === "")
  errorEl.textContent = condition? "Missing Information" : ""
  if (condition) return

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  transaction.value *= (isAdding) - (!isAdding)
  

  // add to beginning of current array of data
  transactions = [transaction,...transactions]

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();
  

  console.log(transaction)
  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(({errors}) => {
    errorEl.textContent = errors? "Missing Information" : "";
    nameEl.value = errors? null : "";
    amountEl.value = errors? null : "";
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = () => {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = () => {
  sendTransaction(false);
};
