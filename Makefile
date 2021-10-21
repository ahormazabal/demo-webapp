ACR ?= rodacrvariacode
VERSION := $(shell ./gradlew getVer -q)

default: build

clean:
	./gradlew clean

buildjar:
	./gradlew build

docker:
	docker build -t variacode/demo-webapp .

tag:
	docker tag variacode/demo-webapp $(ACR).azurecr.io/demo-webapp:$(VERSION)

push: docker
	az acr login --name $(ACR)
	docker tag variacode/demo-webapp $(ACR).azurecr.io/demo-webapp:$(VERSION)
	docker push $(ACR).azurecr.io/demo-webapp:$(VERSION)
