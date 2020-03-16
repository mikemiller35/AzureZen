$(function() {
    
    var client = ZAFClient.init();
    
    function azurecall() {
        var token ="token";
        var org = "org";
        var base64Pat = btoa(":"+token);
        var request = new XMLHttpRequest;
        request.open("GET","https://dev.azure.com/"+ org + "/_apis/projects?api-version=2.0", true);
        var b = "Basic " + base64Pat;
        request.setRequestHeader("Authorization", b);
        
        request.onload = function() {
            var data = JSON.parse(JSON.stringify(this.response));
            console.log(data);
            var obj = JSON.parse(this.response)
            var mainSectionEl = document.querySelector('section[data-main]');
            mainSectionEl.innerText = obj.value[1].name;
            console.log(obj.value[1].name)
        }
        request.send();
    }
    
    function renderText(text) {
        var mainSectionEl = document.querySelector('section[data-main]');
        mainSectionEl.innerText = text;
    }
    
    function getCurrentUser() {
        return client.get('currentUser').then(function(data) {
            return data['currentUser'];
        });
    }
    
    //This does a thing right now. Still needs lots of love
    function init() {
        getCurrentUser().then(function(currentUser) {
            renderText('Hi ' + currentUser.name + ', trying to link to Azure? \n');
        });
        azurecall();
    }

    function getTicket() {
        var token ="token";
        var org = "org";
        var base64Pat = btoa(":"+token);
        var request = new XMLHttpRequest;
        //var ticket = '63454';
        var ticket = document.getElementById('Ticket').value;
        console.log(ticket);
        request.open("GET","https://dev.azure.com/"+ org + "/engineering/_apis/wit/workitems?ids=" + ticket + "&api-version=2.0", true);
        var b = "Basic " + base64Pat;
        request.setRequestHeader("Authorization", b);
        
        request.onload = function() {
            var data = JSON.parse(JSON.stringify(this.response));
            console.log(data);
        }
        request.send();
    }
    var button = document.getElementById('submit')
    button.addEventListener('click', getTicket, false);
    
    client.on('app.registered', function() {
        client.invoke('resize', { width: '100%', height: '120px' });
        init();
    });
    
});