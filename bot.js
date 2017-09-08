var fs = require('fs');
var rimraf = require('rimraf');

var tempDir = './tmp';
const filename = 'timestamp';
const filePath = `${tempDir}/${filename}`;




module.exports = function() {

	rimraf(tempDir, () =>  { 

		console.log("Cleaned tmp dir")
		if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
		var simpleGit = require('simple-git')( tempDir );
		const now = new Date();
		simpleGit
		.addConfig( "user.email", process.env.GIT_EMAIL )
		.addConfig( "user.name", process.env.GIT_NAME )
		.listRemote(['--get-url'], function(err, data) {
            if (!err) {
                console.log('Remote url for repository at ' + __dirname + ':');
                console.log(data);
            }
        })
		.clone(process.env.GIT_REPO_TARGET, ".", (err) => {
			if(err) throw new Error(err);

			fs.writeFile( filePath, now.toUTCString(), function(err) {
			    if(err) throw new Error(err);
			    console.log("New timestamp file saved");

			    simpleGit.add(filename)
			   	.commit( "Commiter action")
			   	.push("origin", "master")
			})
		})
	});
}




 