@echo off
@title Dump
set CLASSPATH=.;dist\*;dist\lib\*
java -server -Dnet.sf.odinms.wzpath=wz/ tools.wztosql.DumpQuests
pause