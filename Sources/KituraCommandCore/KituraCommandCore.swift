import Foundation
import Rainbow
import SwiftShell

struct Repos {
    let url: URL
    let templateName: String
    var urlString: String {
        return url.absoluteString
    }
    
    static let starterWebServer = Repos(url: URL(string: "https://github.com/Kitura/StarterWebServer")!, templateName: "StarterWebServer")
}

public class KituraCommandCore {
    public var isVerbose: Bool = false
    public var allowOverwrite: Bool = false
    
    public enum Failures: LocalizedError {
        case directoryExists(String)
        
        public var errorDescription: String? {
            switch self {
            case .directoryExists(let dir):
                return "Directory '\(dir)' already exists."
            }
        }
    }
    
    public init() {
        
    }
    
    public func verbose(_ str: String) {
        if self.isVerbose {
            print(str.lightYellow)
        }
    }
    
    public func validateServerName(_ name: String) throws {
        // TODO
    }
    
    public func cloneStarterWebServer(name targetProjectName: String, directory: String) throws {
        let fm = FileManager.default
        let repo = Repos.starterWebServer
          
        try validateServerName(targetProjectName)
        
        let finalUrl = URL(fileURLWithPath: directory)
        if fm.fileExists(atPath: finalUrl.path) && !self.allowOverwrite
        {
            throw Failures.directoryExists(finalUrl.path)
        }
        
        let temporaryDirectoryURL =
            try fm.url(for: .itemReplacementDirectory,
                        in: .userDomainMask,
            appropriateFor: finalUrl,
                    create: false)
        defer {
            verbose("Cleaning up temporary files at \(temporaryDirectoryURL.path)")
            try? fm.removeItem(at: temporaryDirectoryURL)
        }
        
//        let temporaryDirectoryURL = URL(fileURLWithPath: "/var/folders/ft/zp2wtkf90f140vz9b7q1dxlnvbyrbl/T/TemporaryItems/(A Document Being Saved By kitura)")
        
        let tempCheckoutURL = temporaryDirectoryURL.appendingPathComponent(finalUrl.lastPathComponent)
        
        // Clone into temporary directory
        verbose("Cloning \(repo)")        
        try GitCommand().clone(repo: repo.urlString, outdir: tempCheckoutURL.path, shallow: true)
        
        verbose("Configuring server name \(targetProjectName)")

        for file in [
            "Package.swift",
            "README.md",
        ] {
            let fileURL = tempCheckoutURL.appendingPathComponent("Package.swift")

            verbose("Configuring \(file) for server name: \(targetProjectName)")
            try FileUtility.replace(searchText: repo.templateName, replaceText: targetProjectName, file: fileURL)
        }
        
        if fm.fileExists(atPath: finalUrl.path) {
            verbose("Update files in \(finalUrl.path)")
        } else {
            verbose("Creating files in \(finalUrl.path)")
            try fm.createDirectory(at: finalUrl, withIntermediateDirectories: true)
        }
        try DirUtility.renameItemsContaining(from: repo.templateName, to: targetProjectName, path: tempCheckoutURL)

        try DirUtility.duplicateFiles(from: tempCheckoutURL, to: finalUrl)
        

    }
}


fileprivate extension KituraCommandCore {
    
}
