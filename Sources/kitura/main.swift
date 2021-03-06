//
//  main.swift
//  
//
//  Created by Sung, Danny on 2/1/21.
//

import Foundation
import ArgumentParser
import KituraCommandCore
import Rainbow

let command = KituraCommandCore()

struct KituraCommand: ParsableCommand {
    struct Options: ParsableArguments {
        @Flag(name: .shortAndLong, help: "Enable verbose mode")
        var verbose: Bool = false
    }

    static var configuration = CommandConfiguration(
        commandName: "kitura",
        abstract: "A utility for initializing a Kitura project",
        subcommands: [Init.self])

    enum ProjectType: String, ExpressibleByArgument {
        case simpleWebServer
    }

    struct Init: ParsableCommand {
        static var configuration = CommandConfiguration(
            abstract: "Initialize a new kitura project")
        
        @Argument(help: "Name of project")
        var name: String

        @Argument(help: "Output directory name (Default is the same as the name of the project)")
        var directory: String?
        
        @Flag(name: .shortAndLong, help: "Overwrite files if directory exists")
        var overwrite: Bool = false
        
        @Argument(help: "Type of project")
        var type: ProjectType = .simpleWebServer

        @OptionGroup var options: Options
        
        mutating func run() throws {
            command.isVerbose = options.verbose
            command.allowOverwrite = overwrite
            
            try command.cloneStarterWebServer(name: name, directory: directory ?? name)
        }
    }

    mutating func run() throws {
        print("main run".lightYellow)
        
    }
}

KituraCommand.main()
