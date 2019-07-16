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
	"bufio"
	"fmt"
	"os/exec"

	"github.com/spf13/cobra"
)

// runCmd represents the run command
var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Run the project in a local container.",
	Long: `Runs your project in a local container. You must have the IBM Developer Tools installed to run this command.
If you do not have the IBM Developer Tools installed you can run 'kitura idt' to install them.`,
	Run: func(cmd *cobra.Command, args []string) {
		devRun := exec.Command("ibmcloud", "dev", "run")

		stdOut, _ := devRun.StdoutPipe()
		devRun.Start()

		scanner := bufio.NewScanner(stdOut)

		for scanner.Scan() {
			m := scanner.Text()
			fmt.Println(m)
		}

		err := devRun.Wait()
		if err != nil {
			println("Error: failed to run IBM Cloud Developer Tools")
			println("Run 'kitura idt' to install")
		}
	},
}

func init() {
	rootCmd.AddCommand(runCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// runCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// runCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
