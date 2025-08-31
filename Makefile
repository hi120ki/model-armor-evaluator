all: help

help: ## Print this help message
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: hello
hello: ## Print "Hello, World!"
	echo "Hello, World!"

.PHONY: setup
setup: ## Install dependencies
	brew install bufbuild/buf/buf

.PHONY: generate
generate: ## Generate code from protobuf files
	cd proto && buf generate --include-imports
	prettier . -w
