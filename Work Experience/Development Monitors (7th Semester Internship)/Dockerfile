FROM continuumio/miniconda3:latest

# Set the working directory to /app
WORKDIR /app

# Copy the environment.yml file into the container
COPY environment.yml ./

# Create a new Conda environment based on the environment.yml file
RUN conda env create -f environment.yml

# Activate the Conda environment
SHELL ["conda", "run", "-n", "gis", "/bin/bash", "-c"]

# Install package Opencv
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY app.py .
COPY . .

EXPOSE 8080

ENV FLASK_ENV=development

# The code to run when container is started:
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "gis", "python", "app.py"]