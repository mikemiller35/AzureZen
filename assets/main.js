$(function () {
    // Set Zendesk SDK
    var client = ZAFClient.init();
    
    // Garbage that will be tossed...Wait.
    function renderText(text) {
        var mainSectionEl = document.querySelector('section[data-main]');
        mainSectionEl.innerText = text;
    }
    
    // Get current use...More or less used for testing...
    function getCurrentUser() {
        return client.get('currentUser').then(function (data) {
            return data['currentUser'];
        });
    }
    
    // Set AzureID in Zendesk
    // User still must submit the case - This *doesn't* auto save
    function setAzureID(ID) {
        client.set('ticket.customField:custom_field_360024830992', ID);
        return ID;
    }
    
    // Let's get the current Azure ID Tied to this ticket
    function azureID() {
        return client.get('ticket.customField:custom_field_360024830992').then(function (data) {
            var aid = data['ticket.customField:custom_field_360024830992'];
            console.log('Azure ID is ' + aid);
            if (aid !== null && aid !== '0' && aid !== '') {
                var mainSectionEl = document.getElementById('CurrentLinkedInfo');
                mainSectionEl.innerText = aid;
                getTicket(aid);
                var x = document.getElementById("Input");
                if (x.style.display === "none") {
                    x.style.display = "block";
                } else {
                    x.style.display = "none";
                }
            } else {
                var y = document.getElementById("LinkedTicket");
                if (y.style.display === "none") {
                    y.style.display = "block";
                } else {
                    y.style.display = "none";
                }
            }
        });
    }
    
    // This gets the data from Azure
    // Need to work on getting more elements brought over. Only ticket type is done below for testing
    // I only get tickets under engineering..I could see this becoming an issue
    function getTicket(adticket) {
        let token = "TOKEN";
        let org = "ORG";
        let base64Pat = btoa(":" + token);
        let request = new XMLHttpRequest;
        console.log('Ticket data for ' + adticket);
        request.open("GET", "https://dev.azure.com/" + org + "/engineering/_apis/wit/workitems?ids=" + adticket + "&api-version=2.0", true);
        let b = "Basic " + base64Pat;
        request.setRequestHeader("Authorization", b);
        
        request.onload = function () {
            var data = JSON.parse(JSON.stringify(this.response));
            var obj = JSON.parse(this.response);
            var mainSectionEl = document.getElementById('azureData-Type');
            mainSectionEl.innerText = JSON.stringify(obj.value[0].fields["System.WorkItemType"]).replace(/['"]+/g, '');
            var mainSectionEl1 = document.getElementById('azureData-Title');
            mainSectionEl1.innerText = JSON.stringify(obj.value[0].fields["System.Title"]).replace(/['"]+/g, '');
            var mainSectionEl2 = document.getElementById('azureData-Status');
            mainSectionEl2.innerText = JSON.stringify(obj.value[0].fields["System.State"]).replace(/['"]+/g, '');
            console.log(data);
        };
        request.send();
    }
    
    function azurePatch(aticket) {
        console.log("Im azurePatch..");
        return client.get('ticket.id').then(function (zid) {
            console.log("Im azurePatch..I stop after this...");
            var zticket = zid['ticket.id'];
            zticket = '\"' + zticket;
            console.log(zticket);
            // var json = [
            //     {
            //         "op": "add",
            //         "path": "/fields/Custom.ZenDeskTicketNumber",
            //         "value": zticket
            //     }
            // ];
            // [ 
            //     {
            //       "op": "add",
            //       "path": "/fields/Custom.ZenDeskTicketNumber",
            //       "value": "Does This Work"
            //     }
            //   ]
            var data = "[\n                {\n                    \"op\": \"add\",\n                    \"path\": \"/fields/Custom.ZenDeskTicketNumber\",\n                    \"value\": " + zticket + "\n                }\n            ]";
            //json = JSON.stringify(json);
            // Put request
            let token = "TOKEN";
            let org = "ORG";
            let base64Pat = btoa(":" + token);
            let request = new XMLHttpRequest;
            console.log('Ticket data for ' + aticket);
            request.open("PATCH", "https://dev.azure.com/" + org + "/_apis/wit/workitems/" + aticket + "/?bypassRules=true&api-version=5.1", true);
            let b = "Basic " + base64Pat;
            request.setRequestHeader("Authorization", b);
            request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            request.onload = function () {
                console.log(this.response);
            }
            request.send(json);
            
        })
    }
    
    //This does a thing right now. Still needs lots of love
    function init() {
        getCurrentUser().then(function (currentUser) {
            renderText('Hi ' + currentUser.name + ', trying to link to Azure? \n');
        });
        
        var button = document.getElementById('submit');
        button.addEventListener('click', function () {
            let ticket = document.getElementById('Ticket').value;
            console.log("Running setAzureID");
            azurePatch(setAzureID(ticket));
            window.location.reload(true);
        });
        azureID();
        
    }
    
    // Size the widget
    client.on('app.registered', function () {
        client.invoke('resize', {width: '100%', height: '250px'});
        init();
    });
}

);