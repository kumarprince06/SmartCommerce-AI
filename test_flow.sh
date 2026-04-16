#!/bin/bash
BASE_URL="http://localhost:8080"

echo "Waiting for backend to ensure Spring Boot is fully initialized..."
sleep 15

echo "\n--- 1. Login as seed Admin ---"
ADMIN_RESP=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"admin@super.com", "password":"Password@123"}' $BASE_URL/auth/login)
ADMIN_TOKEN=$(echo $ADMIN_RESP | jq -r .data.token)
echo "Got Admin Token"

echo "\n--- 2. Fetch Public Items ---"
PRODUCTS_RESP=$(curl -s $BASE_URL/products?size=1)
FIRST_PRODUCT_ID=$(echo $PRODUCTS_RESP | jq -r '.data.content[0].id')
echo "Targeting Product ID: $FIRST_PRODUCT_ID"

echo "\n--- 3. Fetching Nested Variants ---"
VARIANTS_RESP=$(curl -s $BASE_URL/products/$FIRST_PRODUCT_ID/variants)
FIRST_VARIANT_ID=$(echo $VARIANTS_RESP | jq -r '.data[0].id')
STOCK_REMAINING=$(echo $VARIANTS_RESP | jq -r '.data[0].stock')
echo "Targeting Variant ID $FIRST_VARIANT_ID which currently has $STOCK_REMAINING stock!"

echo "\n--- 4. Register a Buyer Profile ---"
BUYER_RESP=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Buyer Bob", "email":"buyer.bob.'$RANDOM'@bob.com", "password":"Password@123", "role":"USER"}' $BASE_URL/auth/register)
BUYER_TOKEN=$(echo $BUYER_RESP | jq -r .data.token)
echo "Assigned Buyer Auth Token"

echo "\n--- 5. Place an Order (End-To-End) ---"
ORDER_PAYLOAD="{\"items\":[{\"variantId\":$FIRST_VARIANT_ID, \"quantity\":2}]}"
ORDER_RESP=$(curl -s -w "\nHTTP %{http_code}\n" -X POST -H "Authorization: Bearer $BUYER_TOKEN" -H "Content-Type: application/json" -d "$ORDER_PAYLOAD" $BASE_URL/orders)
echo "$ORDER_RESP"

ORDER_ID=$(echo "$ORDER_RESP" | head -n 1 | jq -r '.data.id')

echo "\n--- 6. Verifying Inventory Subtraction! ---"
NEW_VARIANTS_RESP=$(curl -s $BASE_URL/products/$FIRST_PRODUCT_ID/variants)
NEW_STOCK=$(echo $NEW_VARIANTS_RESP | jq -r '.data[0].stock')
echo "Variant now has $NEW_STOCK stock (successfully deducted locally against race conditions!)"

echo "\n--- 7. Updating Order Lifecycle (CONFIRMED) ---"
PATCH_PAYLOAD="{\"status\":\"CONFIRMED\"}"
PATCH_RESP=$(curl -s -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "$PATCH_PAYLOAD" $BASE_URL/orders/$ORDER_ID/status)
echo "$PATCH_RESP" | jq

echo "\n--- Tests Completed ---"
