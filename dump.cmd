@echo off
set file_path=.\dumps
set host="localhost"
set port=5432
set username="sys"
set db_name="vnf-md-db"

for /r %file_path%  %%I in (#000_last_dump.tar) do set file_time=%%~tI

if exist %file_path%\#000_last_dump.tar rename %file_path%\#000_last_dump.tar %file_time:~6,4%%file_time:~3,2%%file_time:~0,2%-%file_time:~11,2%%file_time:~14,2%.tar

set file_name=%file_path%\#000_last_dump.tar

pg_dump -v -F t -f %file_name% -O -h %host% -p %port% -d %db_name% -U %username%