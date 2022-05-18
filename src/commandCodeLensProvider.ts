import vscode = require('vscode');

export class CommandCodeLensProvider implements vscode.CodeLensProvider {
    onDidChangeCodeLenses?: vscode.Event<void>;

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        var codeLenses = [];
        const lines = document.getText().split('\n');
        var terminalName = 'bash';
        var result = '';
        var inCommand = false;
        var currentCommand = '';
        var commandStartLine = 0;
        for (var i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (inCommand) {
                if ((line.trim())=='~~~') {
                    const cmd: vscode.Command = {
                        title: 'Run command in Terminal: ' + terminalName,
                        command: 'markdown.run.command',
                        arguments: [{ command: currentCommand, termname: terminalName }]
                    };
                    codeLenses.push(
                        new vscode.CodeLens(new vscode.Range(new vscode.Position(commandStartLine, 0), new vscode.Position(commandStartLine + 1, 0)), cmd)
                    );
                    inCommand = false;
                    currentCommand = '';
                    continue;
                }
                currentCommand =   lines[i].trim() + '\n';
                continue;
            }

            if (line.includes('Console for ')) {
                inCommand = true;
                commandStartLine = i;
                result = line.trim();
                result = result.replace(/- /gm,'');
                terminalName = result.substr(13, result.length-15) + '';
                //substring-after(haystack ,needle )
                //console.log(terminalName);
                continue;
            }
        }
        return codeLenses;
    }

    resolveCodeLens?(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
        return null;
    }


}
