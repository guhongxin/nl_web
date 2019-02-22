#!/usr/bin/env bash

declare version=$1
declare build_date=$(date "+%Y%m%d")

if [[ "$version" == "" ]]
then 
    version=$(cat ./version 2>/dev/null | sed -ne '1p')
else 
    echo $version > ./version
fi

function checkGit()
{
    git checkout -f $GIT_TAG
    checkRst=$?
    
    if [ $checkRst -ne 0 ]; then
        echo "tag $GIT_TAG no exist in repository $1 !!!"
        exit -1
    fi
}

function docker_version()
{
    declare version=$1

    if [[ "$build_env" = "dev" ]]  #开发构建
    then
        build_time=$(date "+%Y%m%d-%H%M")
        version=$version-dev-$build_time 
    elif [[ "$build_env" = "test" ]] #测试构建
    then
        version=$GIT_TAG
    else 
        declare build_date=$(date "+%Y%m%d")
        version=$version-daily-$build_date # 日构建
    fi 
    echo $version
}

function tar_dist()
{
    declare version=$1
    tar -czf "saas_web-$version.tar.gz" dist 
    rm -rf dist/vendor/js/*.js.map
    mv "saas_web-$version.tar.gz" $HOME/web_dist_map/
}

if [[ "$GIT_TAG" == "" ]]; then
    if [[ "$build_env" == "dev" ]]; then 
        GIT_TAG='origin/dev'
    elif [[ "$build_env" == "test" ]]; then 
        echo "构建测试镜像，GIT_TAG不能为空!!!"
        exit -1
    fi
fi 

if [[ "$GIT_TAG" != "" ]]; then
    checkGit
fi

version=$(docker_version $version)

echo "start build version: $version"

echo 'config npm'
npm config set prefix '~/.nodejs/node_global'
npm config set cache '~/.nodejs/node_cache'

echo 'npm install'
npm install

echo 'npm run build:prod'
npm run build:prod
buildRst=$?

if [[ $buildRst -ne 0  ]]
then
    echo "npm run build:prod 失败！！！"
    exit 1
fi

# 压缩带js.map版本，删除后再进行镜像构建
tar_dist $version 

docker build -t registry.cn-beijing.aliyuncs.com/nl_app/web:$version ./
buildRst=$?

if [[ $buildRst -ne 0  ]]
then
    echo "build $app $version failed!!! errno " $buildRst
else
    echo "end build $app $version"
    docker push registry.cn-beijing.aliyuncs.com/nl_app/web:$version
    buildRst=$?
fi
	
exit $buildRst
