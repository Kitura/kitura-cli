// Copyright © 2019 NAME HERE <EMAIL ADDRESS>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
	"log"
	"os"

	"github.com/spf13/cobra"
)

// initCmd represents the init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize a Kitura project",
	Long: `A CLI tool for quickly and easily creating Kitura Applications:

	Example:
	- Create a Kitura Application in the specified directory 
	kitura init --dir MyDirectory

	- Create a Kitura Application but do not build the project
	kitura init --skip-build

	- Create a simple Kitura Application (Swift Application that only contains Kitura)
	kitura init --basic

	- Create a cloud-ready Kitura Application that includes OpenAPI Support
	kitura init --openapi

	Flags can be combined:
	- Create a cloud-ready Kitura Application that includes OpenAPI Support, in the specified directory and do not build the project
	kitura init --openapi --dir MyDirectory --skip-build
	`,
	Run: func(cmd *cobra.Command, args []string) {

		directory, _ := cmd.Flags().GetString("dir")
		api, _ := cmd.Flags().GetBool("openapi")
		basic, _ := cmd.Flags().GetBool("basic")
		build, _ := cmd.Flags().GetBool("skip-build")

		if basic == true && api == true {
			println("'kitura init' can not be provided both the 'basic' and 'api' flags. Please remove one or both and try again.")
			os.Exit(1)
		}

		var err error
		if api == true {
			err = createProjectFor("openAPI", directory, build)
		} else if basic == true {
			err = createProjectFor("basic", directory, build)
		} else {
			err = createProjectFor("init", directory, build)
		}
		if err != nil {
			log.Printf("Error: %v", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(initCmd)

	initCmd.Flags().StringP("dir", "d", ".", "Specify a directory for your project")
	initCmd.Flags().BoolP("openapi", "o", false, "Add OpenAPI support to your Kitura application")
	initCmd.Flags().BoolP("basic", "b", false, "Create a barebones Kitura application")
	initCmd.Flags().BoolP("skip-build", "s", false, "Skip running swift build on project")

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// initCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// initCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
