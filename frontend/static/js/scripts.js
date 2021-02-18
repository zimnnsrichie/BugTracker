// Set defaults

const date = new Date();
const hour = date.getHours();
const minute = date.getMinutes();

document.getElementById("iDate").valueAsDate = new Date();
document.getElementById("iTime").value = hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0');

const reportIssueWithFormLoad = () => {
    alert("Issue with form load");
}

const reportInputValidationError = (input) => {
    alert("Please fill the " + input);
}

const httpRequestGET = () => {
    var httpClient = function () {
        this.get = (url, callback) => {
            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    callback(httpRequest.responseText);
                }
            }

            httpRequest.open('GET', url, true);
            httpRequest.send();
        }
    };

    const url = "http://localhost:3000/";
    const client = new httpClient();
    client.get(url, (response) => {
        document.getElementById("lblResponse").innerText = response;
    });
}

const httpRequestPOST = (body) => {
    const httpRequest = new XMLHttpRequest();
    const url = "http://localhost:3000/createBug";
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.send(body);

    httpRequest.onreadystatechange = processRequest;

    function processRequest(e) {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            document.getElementById("lblResponse").innerText = httpRequest.responseText;
        }
    }
}

function submitRequest() {
    const title = document.getElementById("iTitle");
    if (title == null) { reportIssueWithFormLoad();; return };
    if (title.value == "") { reportInputValidationError("Title"); return };

    const description = document.getElementById("iDescription");
    if (description == null) { reportIssueWithFormLoad();; return };
    if (description.value == "") { reportInputValidationError("Description"); return };

    const assignee = document.getElementById("iAssignee");
    if (assignee == null) { reportIssueWithFormLoad();; return };
    if (assignee.value == "") { reportInputValidationError("Assignee"); return };

    const time = document.getElementById("iTime");
    const date = document.getElementById("iDate");

    const body = JSON.stringify({
        title: title.value,
        description: description.value,
        time: time.value,
        date: date.value,
        assignee: assignee.value
    });

    httpRequestPOST(body);

}
