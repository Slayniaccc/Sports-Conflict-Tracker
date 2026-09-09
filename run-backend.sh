#!/bin/bash
export $(cat .env | xargs)
cd backend
mvn spring-boot:run
