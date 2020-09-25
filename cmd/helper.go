package cmd

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"gopkg.in/src-d/go-git.v4"
	"gopkg.in/src-d/go-git.v4/plumbing"
)

/*
	Runs all the methods required to create a Kitura project in order and handles any errors caught.
	This is the method used my `kitura init`
*/
func createProjectFor(branch, directory string, skipBuild bool) error {

	var projectName string
	var projectNameLower string
	var err error

	if directory == "." {
		projectName, projectNameLower, err = getCurrentDirectory()
		if err != nil {
			return err
		}

		isEmpty, err := isDirectoryEmpty(".")
		if err != nil {
			return err
		}

		if isEmpty == false {
			return error(fmt.Errorf("directory can't be empty"))
		}
	} else {
		err = doesDirectoryExist(directory)
		if err != nil {
			return err
		}

		newString := strings.Split(directory, "/")
		index := len(newString) - 1
		value := newString[index]
		projectName = strings.ReplaceAll(value, " ", "-")
		projectNameLower = strings.ToLower(projectName)
		err = nil
	}

	err = validateProjectName(projectName)
	if err != nil {
		return err
	}

	err = cloneProjectFor(branch, directory)
	if err != nil {
		return err
	}

	err = renameSourceDir(directory, projectName)
	if err != nil {
		return err
	}

	if branch != "basic" {
		err = renameChartDir(directory, projectNameLower)
		if err != nil {
			return err
		}
	}

	err = renameFileContents(directory, projectName, projectNameLower)
	if err != nil {
		return err
	}
	if skipBuild == false {
		err = buildProject(directory)
		if err != nil {
			return err
		}
	} else {
		if directory == "." {
			fmt.Println("Project successfully created. Run 'swift build' to build project.")
		} else {
			fmt.Printf("Project successfully created. Navigate to the '%v' directory and run 'swift build' to build project.\n", directory)
		}

	}

	return nil
}

/*
	Checks that a directory exists. If a custom directory is provided we need ensure it doesn't exist.
*/
func doesDirectoryExist(directory string) error {
	if _, err := os.Stat(directory); !os.IsNotExist(err) {
		return error(fmt.Errorf("Error: The directory %v already exists", directory))
	}
	return nil
}

/*
	Gets the name of the current directory, this is the default case for the `kitura init` command where no custom directory is provided.
*/
func getCurrentDirectory() (string, string, error) {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		return "", "", err
	}

	projectName := filepath.Base(dir)

	projectName = strings.ReplaceAll(projectName, " ", "-")

	projectNameLower := strings.ToLower(projectName)

	return projectName, projectNameLower, nil
}

/*
	Validates that the provided directory is empty
*/
func isDirectoryEmpty(dir string) (bool, error) {
	log.Printf("Checking if %v is an empty directory\n", dir)
	file, err := os.Open(dir)
	if err != nil {
		return false, err
	}

	defer file.Close()

	_, err = file.Readdirnames(1)
	if err == io.EOF {
		return true, nil
	}

	return false, err
}

/*
	Validates that the provided project name doesn't start with `.` or contain any invalid characters.
*/
func validateProjectName(name string) error {
	log.Printf("Checking if %v is a valid project name\n", name)
	if strings.HasPrefix(name, ".") {
		return error(fmt.Errorf("Project name can not start with '.' rename your directory and try again"))
	}
	invalidChars := [11]string{"%", ":", ";", "=", "\"", ">", "<", "”", "|", "\\", "/"}

	for _, char := range invalidChars {
		if strings.Contains(name, char) {
			return error(fmt.Errorf("Project name can not contain %v", char))
		}
	}

	return nil
}

/*
	Uses go-git to clone a specified branch of the Kitura/generator-swiftserver-projects repo to a specified directory.
*/
func cloneProjectFor(branch, directory string) error {
	log.Printf("Cloning kitura project into %v\n", directory)
	_, err := git.PlainClone(directory, false, &git.CloneOptions{
		URL:           "https://github.com/Kitura/generator-swiftserver-projects",
		Progress:      os.Stdout,
		ReferenceName: plumbing.ReferenceName(fmt.Sprintf("refs/heads/%v", branch)),
		SingleBranch:  true,
	})

	if err != nil {
		return err
	}

	rmGitErr := removeGit(directory)

	return rmGitErr
}

/*
	Renames the project directory name placeholders to the provided project names.
*/
func renameSourceDir(directory, projName string) error {
	oldPath := directory + "/Sources/Generator-Swiftserver-Projects"
	newPath := directory + "/Sources/" + projName

	err := os.Rename(oldPath, newPath)

	return err
}

func renameChartDir(directory, projNameLower string) error {
	err := os.Rename(directory+"/chart/generatorswiftserverprojects", directory+"/chart/"+projNameLower)
	return err
}

/*
	Loops over the files in a provided directory and replaces any instances of the placeholders inserted by the Generator with the new project name.
*/
func renameFileContents(directory, currentDir, currentDirLower string) error {
	log.Println("Configuring project files...")
	var files []string

	err := filepath.Walk("./"+directory, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		return err
	}

	for _, file := range files {
		originalFileContents, _ := ioutil.ReadFile(file)

		upperCaseReplaced := bytes.Replace(originalFileContents, []byte("Generator-Swiftserver-Projects"), []byte(currentDir), -1)
		lowerCaseReplaced := bytes.Replace(upperCaseReplaced, []byte("generatorswiftserverprojects"), []byte(currentDirLower), -1)
		upperCaseCleanReplaced := bytes.Replace(lowerCaseReplaced, []byte("GeneratorSwiftserverProjects"), []byte(currentDir), -1)
		err := ioutil.WriteFile(file, upperCaseCleanReplaced, 0666)
		if err != nil {
			return err
		}
	}

	return nil
}

/*
	Runs `swift build` in the specified directory and pipes the resulting output to the console.
*/
func buildProject(directory string) error {
	log.Println("Running 'swift build'...")

	cmd := exec.Command("swift", "build")

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return err
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	cmd.Dir = directory
	err = cmd.Start()
	if err != nil {
		return err
	}

	content := io.MultiReader(stdout, stderr)
	scanner := bufio.NewScanner(content)
	for scanner.Scan() {
		text := scanner.Text()
		fmt.Println(text)
	}

	err = cmd.Wait()
	if err != nil {
		return err
	}

	return nil
}

/*
	Removes the `.git` directory from a specified directory path.
*/
func removeGit(directory string) error {
	gitPath := directory + "/.git"
	removeGit := exec.Command("rm", "-rf", gitPath)
	err := removeGit.Run()

	return err
}
