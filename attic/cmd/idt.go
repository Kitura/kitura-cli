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
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

// idtCmd represents the idt command
var idtCmd = &cobra.Command{
	Use:   "idt",
	Short: "Install IBM Cloud Developer Tools",
	Long:  `Installs the IBM Cloud Developer Tools, useful if you are wanting to deploy your application to IBM Cloud.`,

	Run: func(cmd *cobra.Command, args []string) {
		curlCmd := exec.Command("curl", "-sL", "https://ibm.biz/idt-installer")
		bashCmd := exec.Command("bash")

		bashCmd.Stdin, _ = curlCmd.StdoutPipe()
		bashCmd.Stdout = os.Stdout

		bashCmd.Start()
		curlCmd.Run()
		bashCmd.Wait()
	},
}

func init() {
	rootCmd.AddCommand(idtCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// idtCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// idtCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
