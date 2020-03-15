### Install Zendesk Things For Dev Work

Find some more info [here](https://develop.zendesk.com/hc/en-us/articles/360001075048)

```
$ gem install rake
$ gem install rake
# Do this once in a while
$ gem update zendesk_apps_tools
```

### Testing

Once you get this git repo cloned, can do some testing

```
$ /usr/local/lib/ruby/gems/2.6.0/bin/zat server --path /Users/mike/Projects/azure_zendesk
== Sinatra (v1.4.8) has taken the stage on 4567 for development with backup from Thin
Thin web server (v1.7.2 codename Bachmanity)
Maximum connections set to 1024
Listening on localhost:4567, CTRL+C to stop
::1 - - [15/Mar/2020:13:31:43 -0600] "GET /app.js?locale=en&subdomain=reachengine HTTP/1.1" 200 981 0.2594
::1 - - [15/Mar/2020:13:31:45 -0600] "GET /logo-small.png HTTP/1.1" 200 1448 0.0006
```

Once you run that server above, open an existing Zendesk ticket.  Then append this to the end of the URL `?zat=true`

You'll then see what you're working with!