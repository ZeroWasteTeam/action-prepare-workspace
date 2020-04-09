const core = require('@actions/core');
const github = require('@actions/github');

const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function executeBashCommand(command) {
  const res = await exec(command);
  const { stdout, stderr } = res;
  return stdout.replace(/\n/g,'').replace(/\r/g,'');
}

function setResult(eventName, sha, branch) {
	core.setOutput("build-sha", sha);
	core.setOutput("build-branch", branch);
	console.log(`The build is due to a ${eventName}`);
	console.log(`The build sha : ${sha}`);
	console.log(`The build branch : ${branch}`);
}

async function prepare(){
	var eventName =  github.context.eventName;
	if(eventName == "push") {
		var branch = github.context.ref.replace("refs\/heads\/", "");
		setResult(eventName, github.context.sha, branch);
		await executeBashCommand(`git fetch --no-tags --prune --depth=1 origin +refs/heads/*:refs/remotes/origin/*`);
	} else if(eventName == "repository_dispath") {
		var client_payload = github.context.payload.client_payload;
		if(typeof(client_payload.buildBranch) === "undefined") throw new Error("While triggering with repository-dispatch, buildBranch property is not set");
		if(typeof(client_payload.buildSha) === "undefined") throw new Error("While triggering with repository-dispatch,buildSha property is not set");
		setResult(eventName, client_payload.buildSha, client_payload.buildBranch);
		await executeBashCommand(`git fetch --no-tags --prune --depth=1 origin +refs/heads/*:refs/remotes/origin/*`);
		await executeBashCommand(`git checkout -f ${client_payload.buildSha}`);
	} else {
		throw new Error(`The trigger is unknown: ${github.context.eventName}. The supported triggers are push and respository-dispatch`)
	}	
}

prepare().then(x => { }).catch(x => core.setFailed(x.messsage));
