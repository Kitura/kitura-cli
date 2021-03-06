//
//  FileUtility.swift
//  
//
//  Created by Sung, Danny on 2/7/21.
//

import Foundation

public class FileUtility {
    /// Replace all text in a given file
    /// - Parameters:
    ///   - searchText: The search text to be replaced
    ///   - replaceText: The text to replace `searchText` with
    ///   - file: fileURL to act upon
    /// - Throws: Any read/write errors witht the file
    static public func replace(searchText: String, replaceText: String, file: URL) throws {
        
        let origText = try String(contentsOf: file, encoding: .utf8)
        let newText = origText.replacingOccurrences(of: searchText, with: replaceText)
        
        try newText.write(to: file, atomically: false, encoding: .utf8)
    }

}
