## authentication

post /signup
post /login
post /logout

## profile

get /profile
patch /profile/edit
patch /profile/edit/forgetpassword
delete /profile

## connection request

post /request/:status/:touserId
post /request/review/:status/:requestId

## user

get /user/request/received
get /user/connections
get /user/feed
