//
//  DirUtility.swift
//  
//
//  Created by Sung, Danny on 2/7/21.
//

import Foundation
import SwiftShell

public class DirUtility {
    /// Recursively duplicate context of files from one path to another.
    ///
    /// - Parameters:
    ///   - from: filePath of source directory.  The contents of this directory will be duplicated into `to`
    ///   - to: filePath of destination directory.  This directory must exist prior to executing this command.
    /// - Throws: Any errors in this operation
    /// - Note: This specifically excludes ".git" direcotries.
    public static func duplicateFiles(from: URL, to: URL) throws {
        let cmd = "(cd '\(from.path)' && tar -c -f - --exclude .git . ) | (cd '\(to.path)' && tar xf - )"
        
        try runAndPrint(bash: cmd)
        
        //        var fromContext = CustomContext(main)
        //        fromContext.currentdirectory = from.path
        //
        //        var toContext = CustomContext(main)
        //        toContext.currentdirectory = to.path
        //
        //        let srcCommand = fromContext.runAsync("tar", "cf", "-", ".")
        //        let dstCommand = toContext.runAsync("tar", "xf", "-")
        //
        //        srcCommand.stdout.
        //        try runAndPrint(bash: "cmd1 arg1 | cmd2 > output.txt")
    }
    
    /// Recursively substitute text in filenames and directory names.
    ///
    /// All files/directory under the specified path will be renamed such that any names containing `from` will be sustituted with `to`.
    ///
    /// For example, if from="From" and to="To', then "FileFromName.txt" will be renamed to "FileToName.txt"
    ///
    /// - Parameters:
    ///   - from: search text
    ///   - to: replace text
    ///   - path: directory path to recurse (substitution will not be performed on the path specified)
    public static func renameItemsContaining(from: String, to: String, path: URL) throws {
        let fm = FileManager.default
        
        let contents = try fm.contentsOfDirectory(atPath: path.path)
        
        for content in contents {
            let contentPath = path.appendingPathComponent(content)
            if fm.isDirectory(path: contentPath.path) {
                try renameItemsContaining(from: from, to: to, path: contentPath)
            }
            let origName = contentPath.lastPathComponent
            let newName = origName.replacingOccurrences(of: from, with: to)
            guard newName != origName else {
                continue
            }
            let newPath = path.appendingPathComponent(newName)
            try fm.moveItem(at: contentPath, to: newPath)
        }
    }
}

extension FileManager {
    func isDirectory(path: String) -> Bool {
        let fm = self
        var isDir: ObjCBool = false
        fm.fileExists(atPath: path, isDirectory: &isDir)
        return isDir.boolValue
    }
}
