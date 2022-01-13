import * as vscode from 'vscode';
import { CommandCodeLensProvider } from './commandCodeLensProvider';
import cp = require('child_process');

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('markdown.run.command', (args) => {
			var term = vscode.window.activeTerminal || vscode.window.createTerminal() || findTerminal(args.termname);

			// direct to terminal name
			const oldTerm = findTerminal(args.termname);
			if (oldTerm) {
				oldTerm.show();
				
			}

			else {
				term = vscode.window.createTerminal(args.termname);
				term.show();
			}
			

			
			term.sendText(args.command);

			// check if there's a running command in the active terminal, if there is one
			// create a new term
			/* term.processId.then(pid => {
				cp.exec('ps -o state= -p ' + pid, (error, stdout, stderr) => {
					if (error) {
						// if we can't check just send to the current one...
						term.show();
						//term.sendText(args.command);
						return;
					}

					// a + in the state indicates a process running in foreground
					if (!stdout.includes('+')) {
						term = vscode.window.createTerminal();
					}
					term.show();
					//term.sendText(args.command);
				});
			}); */
		})
	);

	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider({  pattern: '**/*.{md,adoc}'  },
			new CommandCodeLensProvider())
	);
}

export function deactivate() { }


export function findTerminal(name: string): vscode.Terminal | undefined {
	try {
		for (const localTerm of vscode.window.terminals) {
			if (localTerm.name === name) {
				return localTerm;
			}
		}
	} catch {
		return undefined;
	}
	return undefined;
}
