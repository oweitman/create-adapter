import { TemplateFunction } from "../src/lib/createAdapter";
import { getFormattedLicense } from "../src/lib/tools";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useNyc = answers.tools?.includes("code coverage");
	const useESLint = answers.tools?.includes("ESLint");
	const autoInitGit = answers.gitCommit === "yes";
	const useTravis = answers.ci?.includes("travis");
	const useGithubActions = answers.ci?.includes("gh-actions");
	const useDependabot = answers.dependabot === "yes";

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const template = `
![Logo](admin/${answers.adapterName}.png)
# ioBroker.${answers.adapterName}

[![NPM version](http://img.shields.io/npm/v/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Downloads](https://img.shields.io/npm/dm/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
![Number of Installations (latest)](http://iobroker.live/badges/${adapterNameLowerCase}-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/${adapterNameLowerCase}-stable.svg)
[![Dependency Status](https://img.shields.io/david/${answers.authorGithub}/iobroker.${adapterNameLowerCase}.svg)](https://david-dm.org/${answers.authorGithub}/iobroker.${adapterNameLowerCase})
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName}/badge.svg)](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName})

[![NPM](https://nodei.co/npm/iobroker.${adapterNameLowerCase}.png?downloads=true)](https://nodei.co/npm/iobroker.${adapterNameLowerCase}/)
${useTravis ? (`
**Tests:** [![Travis-CI](http://img.shields.io/travis/${answers.authorGithub}/ioBroker.${answers.adapterName}/master.svg)](https://travis-ci.org/${answers.authorGithub}/ioBroker.${answers.adapterName})`)
	: (`
**Tests:** ![Test and Release](https://github.com/${answers.authorGithub}/ioBroker.${adapterNameLowerCase}/workflows/Test%20and%20Release/badge.svg)`)}

## ${answers.adapterName} adapter for ioBroker

${answers.description || "Describe your project here"}

## Developer manual
This section is intended for the developer. It can be deleted later

### Getting started

You are almost done, only a few steps left:
1. Create a new repository on GitHub with the name \`ioBroker.${answers.adapterName}\`
${autoInitGit ? "" : (
`1. Initialize the current folder as a new git repository:  
	\`\`\`bash
	git init
	git add .
	git commit -m "Initial commit"
	\`\`\`
1. Link your local repository with the one on GitHub:  
	\`\`\`bash
	git remote add origin https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}
	\`\`\`
`)}
1. Push all files to the GitHub repo${autoInitGit ? ". The creator has already set up the local repository for you" : ""}:  
	\`\`\`bash
	git push origin master
	\`\`\`
${useDependabot ? (
`1. Add a new secret under https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/settings/secrets. It must be named \`AUTO_MERGE_TOKEN\` and contain a personal access token with push access to the repository, e.g. yours. You can create a new token under https://github.com/settings/tokens.
`) : ""}
1. Head over to ${
	isAdapter ? (
		useTypeScript ? "[src/main.ts](src/main.ts)"
		: "[main.js](main.js)"
	) : `[widgets/${answers.adapterName}.html](widgets/${answers.adapterName}.html)`
} and start programming!

### Best Practices
We've collected some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)

### Scripts in \`package.json\`
Several npm scripts are predefined for your convenience. You can run them using \`npm run <scriptname>\`
| Script name | Description                                              |
|-------------|----------------------------------------------------------|
${isAdapter && useTypeScript ? (
`| \`build\`    | Re-compile the TypeScript sources.                       |
| \`watch\`     | Re-compile the TypeScript sources and watch for changes. |
| \`test:ts\`   | Executes the tests you defined in \`*.test.ts\` files.     |
`) : ""}${isAdapter && !useTypeScript ? (
`| \`test:js\`   | Executes the tests you defined in \`*.test.js\` files.     |
`) : ""}| \`test:package\`    | Ensures your \`package.json\` and \`io-package.json\` are valid. |
${isAdapter && useTypeScript ? (
`| \`test:unit\`       | Tests the adapter startup with unit tests (fast, but might require module mocks to work). |
| \`test:integration\`| Tests the adapter startup with an actual instance of ioBroker. |
`) : ""}| \`test\` | Performs a minimal test run on package files${isAdapter ? " and your tests" : ""}. |
${useNyc ? (
`| \`coverage\` | Generates code coverage using your test files. |
`) : ""}${useESLint ? (
`| \`lint\` | Runs \`ESLint\` to check your code for formatting errors and potential bugs. |
`) : ""}

${isAdapter ? `### Writing tests
When done right, testing code is invaluable, because it gives you the 
confidence to change your code while knowing exactly if and when 
something breaks. A good read on the topic of test-driven development 
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92. 
Although writing tests before the code might seem strange at first, but it has very 
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

` : ""}### Publishing the ${isAdapter ? "adapter" : "widget"}
${useGithubActions ? `Since you have chosen GitHub Actions as your CI service, you can 
enable automatic releases on npm whenever you push a new git tag that matches the form 
\`v<major>.<minor>.<patch>\`. The necessary steps are described in \`.github/workflows/test-and-release.yml\`.

`: ""}To get your ${isAdapter ? "adapter" : "widget"} released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).


### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
	\`\`\`bash
	npm pack
	\`\`\`
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
	\`\`\`bash
	cd /opt/iobroker
	npm i /path/to/tarball.tgz
	\`\`\`

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (\`/opt/iobroker/node_modules/iobroker.${adapterNameLowerCase}\`)
1. Execute \`iobroker upload ${adapterNameLowerCase}\` on the ioBroker host

## Changelog

### 0.0.1
* (${answers.authorName}) initial release

## License
${getFormattedLicense(answers)}
`;
	return template.trim();
}) as TemplateFunction;
