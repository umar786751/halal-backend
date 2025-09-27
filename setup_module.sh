#!/bin/bash
set -e  # Exit on error

echo "Creating empty DTO directories and files..."

# Define the components that need DTOs
components=("users" "customers" "products" "stores" "categories" "suppliers" "transactions" "payments" "brands" "tags" "taxes" "inventory_logs" "discounts" "auth")

# Loop through each component and create the DTO directory & files
for component in "${components[@]}"; do
    mkdir -p src/components/$component/dto
    touch src/components/$component/dto/create-${component}.dto.ts
    touch src/components/$component/dto/update-${component}.dto.ts
    touch src/components/$component/dto/${component}-response.dto.ts
    echo "Empty DTO files created for $component"
done

echo "All DTO files initialized successfully!"
