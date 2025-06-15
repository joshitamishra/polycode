import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register hover provider for Java files
    const hoverProvider = vscode.languages.registerHoverProvider('java', {
        provideHover(document, position, token) {
            // Get the word at the current position
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return null;
            }

            const word = document.getText(wordRange);
            
            // Look for method pattern (word followed by parentheses)
            const lineText = document.lineAt(position.line).text;
            const methodPattern = new RegExp(`\\b${word}\\s*\\(`);
            
            if (methodPattern.test(lineText)) {
                const hoverMessage = new vscode.MarkdownString();
                hoverMessage.appendMarkdown(`**Method: ${word}**\n\n`);
                hoverMessage.appendMarkdown(`[Click to view details](command:extension.openSidePanel?${encodeURIComponent(JSON.stringify(word))})`);
                hoverMessage.isTrusted = true;
                return new vscode.Hover(hoverMessage, wordRange);
            }
            return null;
        }
    });

    // Register command to open side panel
    const openSidePanelCommand = vscode.commands.registerCommand('extension.openSidePanel', (methodName: string) => {
        // Create and show a new webview panel
        const panel = vscode.window.createWebviewPanel(
            'methodDetails',
            `Method: ${methodName}`,
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // Set the HTML content for the panel
        panel.webview.html = getWebviewContent(methodName);
    });

    context.subscriptions.push(hoverProvider, openSidePanelCommand);
}

function getWebviewContent(methodName: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Method Details</title>
        <style>
            body {
                padding: 20px;
                font-family: Arial, sans-serif;
                color: var(--vscode-editor-foreground);
                background-color: var(--vscode-editor-background);
            }
            .method-details {
                background-color: var(--vscode-editor-inactiveSelectionBackground);
                padding: 15px;
                border-radius: 5px;
                border: 1px solid var(--vscode-editor-lineHighlightBorder);
            }
            h2 {
                color: var(--vscode-editor-foreground);
                margin-top: 0;
            }
            .method-info {
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="method-details">
            <h2>Method: ${methodName}</h2>
            <div class="method-info">
                <p>This is a detailed view of the method. You can add more information here.</p>
                <p>Method name: ${methodName}</p>
            </div>
        </div>
    </body>
    </html>`;
}

export function deactivate() {} 