const core = require('@actions/core');
const github = require('@actions/github');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

let eventName = github.context.eventName;
let sha = github.context.sha;
let branch = github.context.ref.replace("refs\/heads\/", "");


if(github.context.payload['client_payload'] != undefined) {
	var client_payload = github.context.payload.client_payload;
	if(client_payload['buildSha'] != undefined) {
		var buildSha = github.context.payload.buildSha;
	}
	if(client_payload['buildBranch'] != undefined) {
		var buildBranch = github.context.payload.buildBranch;
	}
}

console.log(eventName);
console.log(sha);
console.log(branch);
console.log(buildSha);
console.log(buildBranch);



/*
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
	console.log('start of prepare method'+eventName);
	if(eventName == "push") {
		var branch = github.context.ref.replace("refs\/heads\/", "");
		setResult(eventName, github.context.sha, branch);
	} else if(eventName == "repository_dispath") {
		console.log('action started inside dispatch');
		var client_payload = github.context.payload.client_payload;
		if(typeof(client_payload.buildBranch) === "undefined") throw new Error("While triggering with repository-dispatch, buildBranch property is not set");
		if(typeof(client_payload.buildSha) === "undefined") throw new Error("While triggering with repository-dispatch,buildSha property is not set");
		setResult(eventName, client_payload.buildSha, client_payload.buildBranch);
		console.log('before git command');
		await executeBashCommand(`git checkout -f ${client_payload.buildSha}`);
	} else {
		throw new Error(`The trigger is unknown: ${github.context.eventName}. The supported triggers are push and respository-dispatch`)
	}
		
}

prepare().then(x => { }).catch(x => core.setFailed(x.message));
*/