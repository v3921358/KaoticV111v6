@echo off
@title Dump
set CLASSPATH=.;dist\*;dist\lib\*
java -client -Dnet.sf.odinms.wzpath=wz/ tools.wztosql.DumpMobSkills
pause