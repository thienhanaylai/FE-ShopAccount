#!/bin/bash
# Script to update all colors in the project

# Color mapping:
# from-purple-600 to-blue-600 → from-[#5D0E41] to-[#FF204E]
# hover:from-purple-700 hover:to-blue-700 → hover:from-[#5D0E41] hover:to-[#A0153E]
# from-[#27005D] to-[#9400FF] → from-[#5D0E41] to-[#FF204E]
# text-purple-600, text-[#9400FF] → text-[#FF204E]
# bg-purple-600, bg-[#9400FF] → bg-[#FF204E]
# All purple colors to new red theme

echo "Updating colors across all TSX files..."
echo "This will change the color scheme to #FF204E, #A0153E, #5D0E41, #00224D"
