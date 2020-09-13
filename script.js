// Converts data from input (table) into and object - assumess predefined structure from Google Sheets
function convertToReportObj(input) {
  let reportObj = {};
  let inputSplitted = input.split(/\r\n|\r|\n/); // Split input (table) by new line (row) and put into and array

  inputSplitted.forEach((element) => {
    let currSplitted = element.split(/\t/); // Split each element (row) by tab (cell)

    for (let i = 2; i < currSplitted.length; i++) {
      // Fills reportObj with names (keys) and corresponding array of dates

      if (currSplitted[i]) {
        if (reportObj[currSplitted[i]] == undefined) {
          reportObj[currSplitted[i]] = [];
          reportObj[currSplitted[i]].push(currSplitted[0]);
        } else {
          reportObj[currSplitted[i]].push(currSplitted[0]);
        }
      }
    }
  });

  delete reportObj["--"]; // Removes irrelevant data
  return reportObj;
}

function generatePdf(reportObj, month, year) {
  const doc = new jspdf.jsPDF({ orientation: "landscape" });

  for (const key in reportObj) {
    // Generates multipages based on number of keys (names) in data object
    addPageElements(doc, key, month, year);
    generateTable(doc, key, reportObj, month, year);
    doc.addPage();
  }
  let pageCount = doc.internal.getNumberOfPages();
  doc.deletePage(pageCount); // Deletes last empty page
  doc.save("a4.pdf");
}

function addPageElements(doc, userName, month, year) {
  doc.addFileToVFS("MyFont.ttf", myFont); // myFont is a font.tff converted to js and put as global variable in font.js
  doc.addFont("MyFont.ttf", "MyFont", "normal");
  doc.setFont("MyFont", "normal");
  doc.setFontSize(14);
  doc.text("Godziny nadliczbowe (dyżury medyczne)", 100, 20);
  doc.text(`za MIESIĄC ${getMonthName(month)} ${year}r.`, 112, 30);
  doc.setFontSize(12);
  doc.text(`${userName} / Zaklad TK i MR`, 10, 45);
  doc.text(".............................................", 10, 160);
  doc.text(".............................................", 100, 160);
  doc.text(".............................................", 200, 160);
  doc.text("podpis lekarza", 20, 170);
  doc.text("podpis Ordynatora", 110, 170);
  doc.text("KADRY", 215, 170);
}

// Returns Polish name for selected month
function getMonthName(month) {
  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  const currMonth = +month - 1;
  return months[currMonth];
}

function generateTable(doc, userName, reportObj, month, year) {
  doc.autoTable({
    startY: 60,
    styles: {
      fontStyle: "normal",
      font: "MyFont",
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      halign: "center",
      fillColor: [255, 255, 255],
    },
    head: [
      [
        { content: "", colSpan: 1 },
        { content: "WYPEŁNIA LEKARZ", colSpan: 3 },
        { content: "GODZINY NADLICZBOWE wypełniają kadry", colSpan: 5 },
      ],
    ],
    body: generateTableBody(userName, reportObj, month, year),
    theme: "grid",
  });
}

function generateTableBody(userName, reportObj, month, year) {
  let table = [
    [
      "L.p.",
      "Dzień / data dyżuru",
      "Godz. od",
      "Godz.do",
      "Miesięczny wymiar czasu",
      "Ilość godz. razem",
      "W tym godz. nocne",
      "Godziny świąteczne",
      "Godziny zwykłe",
    ],
  ];

  for (let i = 0; i < reportObj[userName].length; i++) {

    let currRow = [
      `${i + 1}`,
      `${reportObj[userName][i]}.${month}.${year}`,
      "15:05",
      `${i % 2 == 0 ? "20:05" : "20:10"}`,
      " ",
      " ",
      " ",
      " ",
      " ",
    ];
    table.push(currRow);
  }

  return table;
}

// Event Listeners
document.querySelector("#main-generate").addEventListener("click", runApp);
document.querySelector("#modal-generate").addEventListener("click", generateReport);

// UI
function runApp(event) {
  event.preventDefault();

  const month = document.querySelector("#month").value;
  const year = document.querySelector("#year").value;
  const reportInput = document.querySelector("#shiftsInput").value;
  const reportObj = convertToReportObj(reportInput);
  
  const users = Object.keys(reportObj);

  setSelectOptions(users);

  showModal();  
  
}

function generateReport() {
  
  
  // Verify input TODO
  const userSelevtion = document.querySelector("#users").value;
  
  console.log(reportObj);
  // generate selection accrding to reportObjs
  // get user selection
  // generate new reportObj accrding to user input
  // hideModal();

  // const reportPdf = generatePdf(reportObj, month, year);

}

function showModal() {
  document.querySelector(".modal").classList.remove("hidden");
}

function hideModal() {
  document.querySelector(".modal").classList.add("hidden");
}

function setSelectOptions(users) {
  let selectElement = document.querySelector("#users");
  users.forEach(user => {
    let optionElement = document.createElement("option");
    optionElement.value = user;
    optionElement.innerHTML = user;
    selectElement.appendChild(optionElement);
  }) 
}
