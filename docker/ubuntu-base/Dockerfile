FROM ubuntu:16.04

## General package configuration
RUN apt-get -y update && apt-get -y install \
        sudo \
        unzip \
        curl \
        xmlstarlet \
        git \
        netcat-traditional \
        software-properties-common \
        debconf-utils \
        uuid-runtime \
        ncurses-bin \
        iputils-ping \
        jq \
        zip \
        apt-transport-https \
        openjdk-8-jdk \
    && rm -rf /var/lib/apt/lists/*
