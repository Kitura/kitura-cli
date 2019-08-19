package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"testing"
)

func TestCreateProject(t *testing.T) {
	invalidBranch := "badBranch"
	validBranch := "basic"
	removeTestDirs := exec.Command("rm", "-rf", "ValidTest")

	err := createProjectFor(invalidBranch, "InvalidTest", false)
	if err == nil {
		t.Errorf(fmt.Sprintf("Expected an error as specified branch: %v shouldn't exist", invalidBranch))
	}

	err = createProjectFor(validBranch, "ValidTest", true)
	if err != nil {
		t.Errorf(fmt.Sprintf("Unexpected error: %v", err))
	}

	defer removeTestDirs.Run()
}

func TestGetCurrentDir(t *testing.T) {
	currentDir, _, _ := getCurrentDirectory()

	expected := "cmd"

	if currentDir != expected {
		t.Errorf(fmt.Sprintf("Expected %q but got %s", expected, currentDir))
	}
}

func TestIsDirectoryEmpty(t *testing.T) {
	//Test current directory - Should not be empty
	isEmpty, err := isDirectoryEmpty("./")

	if err != nil {
		t.Errorf(fmt.Sprintf("Error: %v", err))
	}

	if isEmpty == true {
		t.Errorf("Error")
	}

	//Test newly created directory - Should be empty
	testDir := "Test"

	os.Mkdir(testDir, 0777)
	isEmpty, err = isDirectoryEmpty("./" + testDir)
	if err != nil {
		t.Errorf(fmt.Sprintf("Error: %v", err))
	}

	if isEmpty == false {
		t.Errorf("Error")
	}

	//Remove created directory
	removeTest := exec.Command("rm", "-rf", testDir)
	removeTest.Run()
}

func TestValidateProjectName(t *testing.T) {

	invalidProjName1 := ".MyProject"

	err := validateProjectName(invalidProjName1)

	if err == nil {
		t.Errorf(fmt.Sprintf("Invalid project name used, expected an error but got: %v", err))
	}

	invalidProjName2 := "My=Proj"

	err = validateProjectName(invalidProjName2)

	if err == nil {
		t.Errorf(fmt.Sprintf("Invalid project name used, expected an error but got: %v", err))
	}
}

func TestCloneProject(t *testing.T) {

	directory := "MyProject"

	err := cloneProjectFor("init", directory)

	if err != nil {
		t.Errorf(fmt.Sprintf("Error: %v", err))
	}

	if _, err := os.Stat(directory); os.IsNotExist(err) {
		t.Errorf("Error: Expected project directory doesn't exist")
	}

	gitPath := directory + "/.git"
	if stat, err := os.Stat(gitPath); !os.IsNotExist(err) && stat.IsDir() {
		//.git shouldn't exist
		t.Errorf("Error: .git directory shouldn't exist")
	}

	if _, err := os.Stat(directory); !os.IsNotExist(err) {
		//Remove created directory
		removeProj := exec.Command("rm", "-rf", directory)
		removeProj.Run()
	}

}
