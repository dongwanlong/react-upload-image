#!/bin/sh


# #############################################
# Copyright (c) 2016-2026 letv Inc. All rights reserved.
# #############################################
#
# Name:  autoDeploy.sh
# Date:  2016-08-18 16:47
# Author:   zhangjie
# Email:   zhangjie@letv.com
# Desc:  
#
#

LOCAL_ADDR=${1}
CMD=$(basename ${0})

LOCAL_DIR=`pwd`
LOG_FILE="/var/log/${CMD}.log"
TIME=`date "+%Y-%m-%d_%H_%M_%S"`

Error=1
OK=0


function ERROR() {
    # Red
    echo -e "\e[31m$@\e[m" 2>&1 | tee -a $LOG_FILE
    exit ${Error}
}

function WARN() {
    # Red
    echo -e "\e[31m$@\e[m" 2>&1 | tee -a $LOG_FILE
}

function INFO() {
    # Yellow
    echo -e "\e[33m$@\e[m" 2>&1 | tee -a $LOG_FILE
}

function DEBUG() {
    # Green
    echo -e "\e[32m$@\e[m" 2>&1 | tee -a $LOG_FILE
}

function WAIT() {
    sleep 2
    DEBUG "
    


    "
}

# $?
# badmsg
function CHECK_CMD_RESULT() {

    if [ "$?" != "0" ]; then
        ERROR "$@ Error ..."
    else
        DEBUG "$@ Success ..."
    fi
}

function deploy() {

    git pull |grep "Already up-to-date"
    
    if [ "$?" == "0" ]; then
        # 说明当前是最新代码
	WARN "当前是最新代码，无需更新 ..."
	return 
    fi
    
    #说明pull 了最新代码
    
    rm -rf ./build/
    CHECK_CMD_RESULT "rm -rf ./build/"
    

    gulp apps-build
    CHECK_CMD_RESULT "gulp apps-build"
    
    
    rm -rf /usr/local/node/front/production/*

    cp -rf build/production/* /usr/local/node/front/production/
    CHECK_CMD_RESULT "cp -rf build/production/* /usr/local/node/front/production/"

}

while [ "1" = "1" ]
do
# do something
    deploy
    sleep 2 
done

