#!/bin/bash
# Create user/admin
USERNAMES=(     b0nes           epicfail    user           user2         ) # hackerman"'"'`"`' hackerman        hackerman        hackerman           hackerman               )
PASSWORDS=(     12345678        87654321    18273645       12341234      ) # hackerman         "'"'`"`'         123456789        123456789           12341234                )
EMAILS=(        herman@mail.nl  tom@mail.nl user@mail.nl   user2@mail.nl ) # bla@mail.nl       "'"'`"`'@mail.nl "'"'`"`'@mail.nl regularmail@mail.nl bla@mail.               )
FIRSTNAMES=(    herman          tom         userfirstname  firstnameuser ) # bla               bla              bla               "'"'`"`'           hacker                  )
LASTNAMES=(     bonnes          hagen       userlastname   lastnameuser  ) # bla               bla              bla               "'"'`"`'           man                     )

for (( i=0; i<${#USERNAMES[*]}; i++ )); do
    echo "Creating user. ${USERNAMES[$i]}|${PASSWORDS[$i]}|${EMAILS[$i]}|${FIRSTNAMES[$i]}|${LASTNAMES[$i]}"
    http POST https://cysedm.herokuapp.com/api/v1/user/create \
    username=${USERNAMES[$i]} \
    password=${PASSWORDS[$i]} \
    email=${EMAILS[$i]} \
    firstName=${FIRSTNAMES[$i]} \
    lastName=${LASTNAMES[$i]} --verify=no -b
done

# Login test
for (( i=0; i<${#USERNAMES[*]}; i++ )); do
    echo "Logging in with username. ${USERNAMES[$i]}|${PASSWORDS[$i]}"
    http POST https://cysedm.herokuapp.com/api/v1/user/login username=${USERNAMES[$i]} password=${PASSWORDS[$i]} --verify=no -b
    #echo "Logging in with email. ${EMAILS[$i]}|${PASSWORDS[$i]}"
    #http POST https://cysedm.herokuapp.com/api/v1/user/login email=${EMAILS[$i]} password=${PASSWORDS[$i]} --verify=no -b
done

# Login and store tokens
ADMIN_TOKEN=$(http POST https://cysedm.herokuapp.com/api/v1/user/login username=b0nes password=12345678 --verify=no -b)
[ "$ADMIN_TOKEN" ] ||  echo "Token test failed."
USER_TOKEN=$(http POST https://cysedm.herokuapp.com/api/v1/user/login username=user password=18273645 --verify=no -b)
[ "$USER_TOKEN" ] || echo "Username Token test failed."
echo "Admin Token: ${ADMIN_TOKEN}"
echo "User Token: ${USER_TOKEN}"

# Delete a user
echo "Deleting user epicfail without admin credentials."
http DELETE https://cysedm.herokuapp.com/api/v1/user/epicfail Authorization:${USER_TOKEN} --verify=no -b
echo "Deleting user epicfail with admin credentials."
http DELETE https://cysedm.herokuapp.com/api/v1/user/epicfail Authorization:${ADMIN_TOKEN} --verify=no -b

# Update a user
echo "Updating user \"user\", logged in as \"user\"."
http PUT https://cysedm.herokuapp.com/api/v1/user/user Authorization:${USER_TOKEN} firstName=Tommieboy lastName=Hagendasz --verify=no -b
echo "Updating user \"user2\", logged in as \"user\"."
http PUT https://cysedm.herokuapp.com/api/v1/user/user2 Authorization:${USER_TOKEN} firstName=bla --verify=no -b
echo "Updating user \"user\", logged in as \"b0nes\" (admin)."
http PUT https://cysedm.herokuapp.com/api/v1/user/user2 Authorization:${ADMIN_TOKEN} email=user2@supermail.nl password=Welkom2018 --verify=no -b
echo "Updating user \"user\", logged in as \"b0nes\" (admin) with bogus data."
http PUT https://cysedm.herokuapp.com/api/v1/user/user2 Authorization:${ADMIN_TOKEN} bla=user2@supermail.nl wtfEvenIsThis=Welkom2018 --verify=no -b


# Get a user
echo "Getting user \"user2\", logged in as \"user\" (admin)"
http GET https://cysedm.herokuapp.com/api/v1/user/user2 Authorization:${USER_TOKEN} --verify=no -b
echo "Getting user \"user2\", logged in as \"b0nes\" (admin)"
http GET https://cysedm.herokuapp.com/api/v1/user/user2 Authorization:${ADMIN_TOKEN} --verify=no -b
echo "Getting user \"user2\" with field firstname, logged in as \"user\" (admin)"
http GET https://cysedm.herokuapp.com/api/v1/user/user2/firstName Authorization:${USER_TOKEN} --verify=no -b
echo "Getting user \"user2\" with field firstname, logged in as \"b0nes\" (admin)"
http GET https://cysedm.herokuapp.com/api/v1/user/user2/firstName Authorization:${ADMIN_TOKEN} --verify=no -b
echo "Getting user \"user2\" with field password, logged in as \"b0nes\" (admin)"
http GET https://cysedm.herokuapp.com/api/v1/user/user2/PasSwoRd Authorization:${ADMIN_TOKEN} --verify=no -b

# Get a message 
http GET https://cysedm.herokuapp.com/api/v1/message/load Authorization:$USER_TOKEN --verify=no -b
# Get a message 
http POST https://cysedm.herokuapp.com/api/v1/message/create Authorization:$USER_TOKEN sender=b0nes receiver=user content=bladiebladiebla --verify=no -b 
http POST https://cysedm.herokuapp.com/api/v1/message/create Authorization:$USER_TOKEN sender=b0nes receiver=user content= --verify=no -b 
http POST https://cysedm.herokuapp.com/api/v1/message/create Authorization:$USER_TOKEN sender=b0nes receiver=user content=bladiebladiebla extraparameter=bullshit --verify=no -b 

