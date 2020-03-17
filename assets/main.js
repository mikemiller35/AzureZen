$(function() {
    // Set Zendesk SDK
    var client = ZAFClient.init();
    // Garbage that will be tossed...Wait.
    function renderText(text) {
        var mainSectionEl = document.querySelector('section[data-main]');
        mainSectionEl.innerText = text;
    }
    // Get current use...More or less used for testing...
    function getCurrentUser() {
        return client.get('currentUser').then(function(data) {
            return data['currentUser'];
        });
    }
    // Set AzureID in Zendesk
    // User still must submit the case - This *doesn't* auto save
    function setAzureID(ID) {
        client.set('ticket.customField:custom_field_360024830992', ID);
    }
    
    // Let's get the current Azure ID Tied to this ticket
    function azureID() {
        return client.get('ticket.customField:custom_field_360024830992').then(function(data) {
            var aid = data['ticket.customField:custom_field_360024830992'];
            console.log('Azure ID is ' + aid );
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
    function getTicket(ticket) {
        var token ="TOKEN";
        var org = "ORG";
        var base64Pat = btoa(":"+token);
        var request = new XMLHttpRequest;
        console.log('Ticket data for ' + ticket);
        request.open("GET","https://dev.azure.com/"+ org + "/engineering/_apis/wit/workitems?ids=" + ticket + "&api-version=2.0", true);
        var b = "Basic " + base64Pat;
        request.setRequestHeader("Authorization", b);
        
        request.onload = function() {
            var data = JSON.parse(JSON.stringify(this.response));
            var obj = JSON.parse(this.response);
            var mainSectionEl = document.getElementById('azureData-Type');
            mainSectionEl.innerText = JSON.stringify(obj.value[0].fields["System.WorkItemType"]).replace(/['"]+/g, '');
            var mainSectionEl1 = document.getElementById('azureData-Title');
            mainSectionEl1.innerText = JSON.stringify(obj.value[0].fields["System.Title"]).replace(/['"]+/g, '');
            var mainSectionEl2 = document.getElementById('azureData-Status');
            mainSectionEl2.innerText = JSON.stringify(obj.value[0].fields["System.State"]).replace(/['"]+/g, '');
            console.log(data);
        }
        request.send();
    }
    
    //This does a thing right now. Still needs lots of love
    function init() {
        getCurrentUser().then(function(currentUser) {
            renderText('Hi ' + currentUser.name + ', trying to link to Azure? \n');
        });
        
        var button = document.getElementById('submit')
        button.addEventListener('click', function(){
            var ticket = document.getElementById('Ticket').value;
            setAzureID(ticket);
            window.location.reload(true);
        });
        
        azureID();
    }
    // Size the widget
    client.on('app.registered', function() {
        client.invoke('resize', { width: '100%', height: '250px' });
        init();
    });
});