ACR ?= rodacrvariacode
VERSION := $(shell ./gradlew getVer -q)

default: pack

clean:
	./gradlew clean

buildjar:
	./gradlew build

pack: buildjar
	docker build -t variacode/demo-webapp .

tag:
	docker tag variacode/demo-webapp $(ACR).azurecr.io/demo-webapp:$(VERSION)

push:
	docker tag variacode/demo-webapp $(ACR).azurecr.io/demo-webapp:$(VERSION)
	docker push $(ACR).azurecr.io/demo-webapp:$(VERSION)
