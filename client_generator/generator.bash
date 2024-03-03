#!/bin/bash

# Polyglot madness.

wget -r -np "https://ei.jhu.edu/truss-simulator/"

wget -P "ei.jhu.edu/cdn-cgi/scripts/5c5dd728/cloudflare-static" "https://ei.jhu.edu/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"
wget -P "ei.jhu.edu/cdn-cgi/scripts/7d0fa10a/cloudflare-static" "https://ei.jhu.edu/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js"

# Note: Take care to only use double quotes inside the embedded script, or escape single quotes with '\''.
# Probably could have also the -c cmd option.

python3 <(echo '

fin = open("ei.jhu.edu/truss-simulator/index.html", "r")
raw_content = fin.read()
modified_content = raw_content.replace("/cdn-cgi", "../cdn-cgi").replace("</body>", "<script>window.__cfRLUnblockHandlers = true;</script><script src=\"../../../bookmarklet/save_extension.js\"></script></body>")
fin.close()

fout = open("ei.jhu.edu/truss-simulator/index.html", "w")
fout.write(modified_content)
fout.close()

')
