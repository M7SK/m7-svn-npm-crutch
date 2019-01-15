module.exports = function (hook) {
	var fs = require('fs')
		, appPkg = __dirname + '/../../../../package.json'
		, pkg
		, installScripts
		, helperScript;

	if (fs.existsSync(appPkg)) {
		pkg = JSON.parse(fs.readFileSync(appPkg).toString());
		installScripts = [];

		// -----------------------------------------------------
		// Add a install hook for svn scripts if it isn't already there in the main
		// app's package.js
		// -----------------------------------------------------
		pkg.scripts = pkg.scripts || {};
		pkg.scripts.install = pkg.scripts.install || '';

		pkg.scripts.install.split('&&').forEach(function (scrp) {
			// -----------------------------------------------------
			// Clear out any older install scripts for m7-svn-npm-crutch
			// -----------------------------------------------------
			if (-1 === scrp.indexOf('node_modules/m7-svn-npm-crutch')) {
				scrp = scrp.trim();
				if (scrp.length > 0) {
					installScripts.push(scrp);
				}
			}
		});

		if ('install' === hook) {
			helperScript = 'node ./node_modules/m7-svn-npm-crutch/lib/m7-svn-npm-crutch.js';
			installScripts.push(helperScript);
		}

		pkg.scripts.install = installScripts.join(' && ');
		fs.writeFileSync(appPkg, JSON.stringify(pkg, null, '  '));
	} else {
		console.log('m7-svn-npm-crutch did not find your app\'s package.json file. You can safely ignore this message if you\'re install m7-svn-npm-crutch itself.');
	}
};

