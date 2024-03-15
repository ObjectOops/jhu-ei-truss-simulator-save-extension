#!/bin/sh

ACT_VERSION="v0.2.60"

mkdir nektos_act
cd nektos_act
wget "https://github.com/nektos/act/releases/download/${ACT_VERSION}/act_Linux_x86_64.tar.gz"
tar -xzf act_Linux_x86_64.tar.gz
