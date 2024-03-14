TEMPLATE_NAME="release_template.md"
cd bookmarklet
printf '```\n' >> ../.github/$TEMPLATE_NAME
node condense.js >> ../.github/$TEMPLATE_NAME
printf '```' >> ../.github/$TEMPLATE_NAME
cat ../.github/$TEMPLATE_NAME
