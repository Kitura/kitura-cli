BREWCMD=brew
BREWGET=$(BREWCMD) install

BINARY_NAME=kitura
PACKAGE_NAME=kitura-cli
LINUX_DIR=linux-amd64
LINUX_PATH=/usr/local/bin
LINUX_BINARY=$(LINUX_DIR)$(LINUX_PATH)/$(BINARY_NAME)
MACOS_DIR=darwin-amd64
MACOS_PATH=/
MACOS_BINARY=$(MACOS_DIR)$(MACOS_PATH)/$(BINARY_NAME)

GOPATH=$(HOME)/kitura-cli-$(RELEASE)
KITURA_SRC=$(GOPATH)/src/kitura

# Handle additional param for sed -i on Darwin
SED_FLAGS=
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
    SED_FLAGS := ""
endif

all: build package

build: build-linux build-darwin

package: package-linux package-darwin

clean:
	swift package clean
	rm -f install.sh
	rm -f $(LINUX_DIR)/DEBIAN/control
	rm -rf $(LINUX_DIR)/usr
	rm -rf $(MACOS_DIR)

setup:
	# Check RELEASE is set
ifndef RELEASE
	$(error RELEASE is not set)
endif
	
	# Replace release placeholders in sources
	cp install.sh.ver install.sh
	cp kitura.rb.ver kitura.rb
	cp $(LINUX_DIR)/DEBIAN/control.ver $(LINUX_DIR)/DEBIAN/control
	sed -i $(SED_FLAGS) -e"s#@@RELEASE@@#$(RELEASE)#g" install.sh $(LINUX_DIR)/DEBIAN/control kitura.rb
deps:
	# Install dependencies
	#$(BREWGET) swift-sh

build-linux: setup deps
	swift build -c release
	mkdir -p "$(LINUX_DIR)$(LINUX_PATH)/"
	cp -p ".build/release/${BINARY_NAME}" "${LINUX_BINARY}"

build-darwin: setup deps
	swift build -c release
	mkdir -p "$(MACOS_DIR)$(MACOS_PATH)/"
	cp -p ".build/release/${BINARY_NAME}" "${MACOS_BINARY}"

test:
	# test not implemented
	#
	#cd $(KITURA_SRC)
	#$(GOTEST) kitura/cmd

package-linux: build-linux
	cp -R -p $(LINUX_DIR) $(PACKAGE_NAME)_$(RELEASE)
	chmod -R 755 $(LINUX_DIR)$(LINUX_PATH)
	dpkg-deb --build $(PACKAGE_NAME)_$(RELEASE)
	mv $(PACKAGE_NAME)_$(RELEASE).deb $(PACKAGE_NAME)_$(RELEASE)_amd64.deb
	rm -r $(PACKAGE_NAME)_$(RELEASE)

package-darwin-tar: build-darwin
	tar -czf $(PACKAGE_NAME)_$(RELEASE)_darwin.tar.gz $(MACOS_DIR)

package-darwin: package-darwin-tar
	# This syntax defines SHA_VALUE at rule execution time.
	# Note: separate rule to delay evaluation until tar.gz has been written
	$(eval SHA_VALUE := $(shell shasum -a 256 $(PACKAGE_NAME)_$(RELEASE)_darwin.tar.gz | cut -d' ' -f1))
	sed -i $(SED_FLAGS) -e"s#@@SHA256@@#$(SHA_VALUE)#" kitura.rb
