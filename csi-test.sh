#!/bin/bash
# Create user/admin
http POST https://localhost:3000/api/v1/user/create username=b0nes password=12345678 email=h.bonnes@gmail.com firstName=herman lastName=bonnes --verify=no
http POST https://localhost:3000/api/v1/user/create username=user password=12345678 email=user@gmail.com firstName=herman lastName=bonnes --verify=no

# Login and store tokens, check email login
ADMIN_TOKEN=$(http POST https://localhost:3000/api/v1/user/login username=b0nes password=12345678 --verify=no | egrep -o ".{20,}"| cut -d":" -f2)
USER_TOKEN1=$(http POST https://localhost:3000/api/v1/user/login username=user password=12345678 --verify=no | egrep -o ".{20,}"| cut -d":" -f2)
USER_TOKEN2=$(http POST https://localhost:3000/api/v1/user/login email=h.bonnes@gmail.com --verify=no | egrep -o ".{20,}"| cut -d":" -f2)
[ "$ADMIN_TOKEN" ] || { echo "Token test failed."; exit 1; }
[ "$USER_TOKEN1" ] || { echo "Username Token test failed."; exit 1; }
[ "$USER_TOKEN2" ] || { echo "Email token test failed."; exit 1; }

# Echo tokens for debugging purposes
echo "Admin Token: $ADMIN_TOKEN"
echo "User Token: $USER_TOKEN1"

# Usertest

# Messages
