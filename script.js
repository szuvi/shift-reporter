function generateReportObj(input) {
    let reportObj = {};
    let inputSplitted = input.split(/\r\n|\r|\n/);
    inputSplitted.forEach(element => {
        let currSplitted = element.split(/\t/);
        if (reportObj[currSplitted[2]] == undefined) {
            reportObj[currSplitted[2]] = [];
            reportObj[currSplitted[2]].push(currSplitted[0]);
        } else {
            reportObj[currSplitted[2]].push(currSplitted[0]);
        }
    });
    return reportObj;
}


// Event Listener
document.querySelector('#generate').addEventListener('click', tempGen);

// UI
function tempGen(event) {
    event.preventDefault();
    const reportInput = document.querySelector('#shiftsInput').value;
    const report = generateReportObj(reportInput);
    console.log(report);
}
