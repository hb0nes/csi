#!/bin/bash
# Create user/admin
USERNAMES=(     b0nes           epicfail    user           user2           hackerman"'"'`"`' hackerman        hackerman        hackerman           hackerman               )
PASSWORDS=(     12345678        87654321    18273645       12341234        hackerman         "'"'`"`'         123456789        123456789           12341234                )
EMAILS=(        herman@mail.nl  tom@mail.nl user@mail.nl   user2@mail.nl   bla@mail.nl       "'"'`"`'@mail.nl "'"'`"`'@mail.nl regularmail@mail.nl bla@mail.               )
FIRSTNAMES=(    herman          tom         userfirstname  firstnameuser   bla               bla              bla               "'"'`"`'           hacker                  )
LASTNAMES=(     bonnes          hagen       userlastname   lastnameuser    bla               bla              bla               "'"'`"`'           man                     )

SERVER=localhost:3000/api/v1
# SERVER=https://cysedm.herokuapp.com/api/v1

for (( i=0; i<${#USERNAMES[*]}; i++ )); do
    echo "Creating user. ${USERNAMES[$i]}|${PASSWORDS[$i]}|${EMAILS[$i]}|${FIRSTNAMES[$i]}|${LASTNAMES[$i]}"
    http POST ${SERVER}/user/create \
    username=${USERNAMES[$i]} \
    password=${PASSWORDS[$i]} \
    email=${EMAILS[$i]} \
    firstName=${FIRSTNAMES[$i]} \
    lastName=${LASTNAMES[$i]} 
done

# Login test
for (( i=0; i<${#USERNAMES[*]}; i++ )); do
    echo "Logging in with username. ${USERNAMES[$i]}|${PASSWORDS[$i]}"
    http POST ${SERVER}/user/login username=${USERNAMES[$i]} password=${PASSWORDS[$i]} 
    echo "Logging in with email. ${EMAILS[$i]}|${PASSWORDS[$i]}"
    http POST ${SERVER}/user/login email=${EMAILS[$i]} password=${PASSWORDS[$i]} 
done
    echo "Logging in with only password. ${EMAILS[$i]}|${PASSWORDS[$i]}"
    http POST ${SERVER}/user/login password=${PASSWORDS[$i]} 

# Login and store tokens
ADMIN_TOKEN=$(http POST ${SERVER}/user/login username=b0nes password=12345678 )
[ "$ADMIN_TOKEN" ] ||  echo "Token test failed."
USER_TOKEN=$(http POST ${SERVER}/user/login username=user password=18273645 )
[ "$USER_TOKEN" ] || echo "Username Token test failed."
echo "Admin Token: ${ADMIN_TOKEN}"
echo "User Token: ${USER_TOKEN}"

# Delete a user
echo "Deleting user epicfail without admin credentials."
http DELETE ${SERVER}/user/epicfail Authorization:${USER_TOKEN} 
echo "Deleting user epicfail with admin credentials."
http DELETE ${SERVER}/user/epicfail Authorization:${ADMIN_TOKEN} 

# Update a user
echo "Updating user \"user\", logged in as \"user\"."
http PUT ${SERVER}/user/user Authorization:${USER_TOKEN} firstName=Tommieboy lastName=Hagendasz 
echo "Updating user \"user2\", logged in as \"user\"."
http PUT ${SERVER}/user/user2 Authorization:${USER_TOKEN} firstName=bla 
echo "Updating user \"user\", logged in as \"b0nes\" (admin)."
http PUT ${SERVER}/user/user2 Authorization:${ADMIN_TOKEN} email=user2@supermail.nl password=Welkom2018 
echo "Updating user \"user\", logged in as \"b0nes\" (admin) with bogus data."
http PUT ${SERVER}/user/user2 Authorization:${ADMIN_TOKEN} bla=user2@supermail.nl wtfEvenIsThis=Welkom2018 


# Get a user
echo "Getting user \"user2\", logged in as \"user\" (admin)"
http GET ${SERVER}/user/user2 Authorization:${USER_TOKEN} 
echo "Getting user \"user2\", logged in as \"b0nes\" (admin)"
http GET ${SERVER}/user/user2 Authorization:${ADMIN_TOKEN} 
echo "Getting user \"user2\" with field firstname, logged in as \"user\" (admin)"
http GET ${SERVER}/user/user2/firstName Authorization:${USER_TOKEN} 
echo "Getting user \"user2\" with field firstname, logged in as \"b0nes\" (admin)"
http GET ${SERVER}/user/user2/firstName Authorization:${ADMIN_TOKEN} 
echo "Getting user \"user2\" with field password, logged in as \"b0nes\" (admin)"
http GET ${SERVER}/user/user2/PasSwoRd Authorization:${ADMIN_TOKEN} 

# Get a message 
http GET ${SERVER}/message/load Authorization:$USER_TOKEN 
# Get a message 
http POST ${SERVER}/message/create Authorization:$USER_TOKEN sender=b0nes receiver=user content=bladiebladiebla  
http POST ${SERVER}/message/create Authorization:$USER_TOKEN sender=b0nes receiver=user content=  
http POST ${SERVER}/message/create Authorization:$USER_TOKEN sender=b0nes receiver=user content=bladiebladiebla extraparameter=bullshit  

