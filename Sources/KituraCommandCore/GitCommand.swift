//
//  GitCommand.swift
//  
//
//  Created by Sung, Danny on 2/2/21.
//

import Foundation
import SwiftShell

class GitCommand {
    
    /// Clone a git repository
    /// - Parameters:
    ///   - repo: repository to clone (ssh/http/https/file path)
    ///   - outdir: output path (relative or absolute).  Git will create this directory.
    ///   - shallow: If true, use --depth=1
    /// - Throws: `KituraCommandCore.Failures.directoryExists(outdir)` if outdir already exists
    public func clone(repo: String, outdir: String, shallow: Bool=false) throws {
        if FileManager.default.fileExists(atPath: outdir) {
            throw KituraCommandCore.Failures.directoryExists(outdir)
        }
        
        if shallow {
            try runAndPrint("git", "clone", "--depth", "1", repo, outdir)
        } else {
            try runAndPrint("git", "clone", repo, outdir)
        }
    }
}
