#!/bin/bash
  
sudo docker build -t dckreg:5000/monolith:1.1 .
sudo docker push dckreg:5000/monolith:1.1
