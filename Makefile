GOCMD=go
GOBUILD=$(GOCMD) build
GOGET=$(GOCMD) get
GOCLEAN=$(GOCMD) clean

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
	$(GOCLEAN)
	rm -f install.sh
	rm -f $(LINUX_DIR)/DEBIAN/control
	rm -rf $(LINUX_DIR)/usr
	rm -rf $(MACOS_DIR)

setup:
	# Check RELEASE is set
ifndef RELEASE
	$(error RELEASE is not set)
endif
	
	# Copy kitura/cmd module into GOPATH
	mkdir -p $(KITURA_SRC)
	cp -R -p cmd $(KITURA_SRC)
	# Replace release placeholders in sources
	cp install.sh.ver install.sh
	cp $(LINUX_DIR)/DEBIAN/control.ver $(LINUX_DIR)/DEBIAN/control
	sed -i $(SED_FLAGS) -e"s#@@RELEASE@@#$(RELEASE)#g" install.sh $(LINUX_DIR)/DEBIAN/control $(KITURA_SRC)/cmd/root.go
deps:
	# Install dependencies
	$(GOGET) github.com/spf13/cobra/cobra
	$(GOGET) gopkg.in/src-d/go-git.v4/...

build-linux: setup deps
	GOOS=linux GOARCH=amd64 $(GOBUILD) -o $(LINUX_BINARY) -v

build-darwin: setup deps
	GOOS=darwin GOARCH=amd64 $(GOBUILD) -o $(MACOS_BINARY) -v

package-linux: build-linux
	cp -R -p $(LINUX_DIR) $(PACKAGE_NAME)_$(RELEASE)
	chmod -R 755 $(LINUX_DIR)$(LINUX_PATH)
	dpkg-deb --build $(PACKAGE_NAME)_$(RELEASE)
	mv $(PACKAGE_NAME)_$(RELEASE).deb $(PACKAGE_NAME)_$(RELEASE)_amd64.deb
	rm -r $(PACKAGE_NAME)_$(RELEASE)

package-darwin: build-darwin
	tar -czf $(PACKAGE_NAME)-$(RELEASE)_darwin.tar.gz $(MACOS_DIR)
