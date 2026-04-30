#!/bin/bash
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
NEXT_CONFIG_FILE="$SCRIPT_DIR/next.config.ts"
NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE="output: 'export', // used for next build only (ng_build.sh uncomments it when doing build)"

WATCH_SLUG_TSX_FILE="$SCRIPT_DIR/app/watch/[...slug]/page.tsx"
WATCH_SLUG_TSX_FILE_BUILD_DYNAMIC_PARAMS_TRUE_LINE="export const dynamicParams = true;"
WATCH_SLUG_TSX_FILE_BUILD_DYNAMIC_PARAMS_FALSE_LINE="export const dynamicParams = false;"


grep -q "//$NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE" "$NEXT_CONFIG_FILE" && COMMENTED_OUT_LINE_FOUND=1 || COMMENTED_OUT_LINE_FOUND=0
grep -q "$NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE" "$NEXT_CONFIG_FILE" && UNCOMMENTED_OUT_LINE_FOUND=1 || UNCOMMENTED_OUT_LINE_FOUND=0

escape_sed() {
  # Escape backslash first, then other special regex and replacement chars
  local escaped="${1//\\/\\\\}"
  escaped="${escaped//[./*^$[]/\\&}"
  escaped="${escaped//&/\\&}"
  # Escape the delimiter you plan to use (e.g., #)
  echo "${escaped//#/\\#}"
}

ESCAPED_NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE=$(escape_sed "$NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE")

if [ "$COMMENTED_OUT_LINE_FOUND" -eq 1 ]; then
  echo "Uncommending export:output in the next.config.ts"
  sed -i "s#\/\/$ESCAPED_NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE#$ESCAPED_NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE#g" "$NEXT_CONFIG_FILE"
  sed -i "s#$WATCH_SLUG_TSX_FILE_BUILD_DYNAMIC_PARAMS_TRUE_LINE#$WATCH_SLUG_TSX_FILE_BUILD_DYNAMIC_PARAMS_FALSE_LINE#g" "$WATCH_SLUG_TSX_FILE"
  npm run build
  echo "Commending export:output back in the next.config.ts"
  sed -i "s#$ESCAPED_NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE#\/\/$ESCAPED_NEXT_CONFIG_FILE_BUILD_OUTPUT_ENABLE_LINE#g" "$NEXT_CONFIG_FILE"
  sed -i "s#$WATCH_SLUG_TSX_FILE_BUILD_DYNAMIC_PARAMS_FALSE_LINE#$WATCH_SLUG_TSX_FILE_BUILD_DYNAMIC_PARAMS_TRUE_LINE#g" "$WATCH_SLUG_TSX_FILE"
else
  echo "Error code 01: Perhaps next build is already in progress"
fi