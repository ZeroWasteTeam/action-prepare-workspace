const core = require('@actions/core');
const github = require('@actions/github');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

let eventName = github.context.eventName;
let sha = github.context.sha;
let branch = github.context.ref.replace("refs\/heads\/", "");
let buildBranch = "";
let buildSha = "";

let cpload = github.context.payload.client_payload;
if(cpload != undefined) {
  buildBranch = cpload.buildBranch;
  buildSha = cpload.buildSha;  
}

console.log(`Event Name: ${eventName}`);
console.log(`Current Commit: ${sha}`);
console.log(`Current Branch: ${branch}`);
console.log(`BuildSha : ${buildSha}`);
console.log(`BuildBranch: ${buildBranch}`);

function setResult(eventName, sha, branch) {
	core.setOutput("build-sha", sha);
	core.setOutput("build-branch", branch);
}

async function executeBashCommand(command) {
  const res = await exec(command);
  const { stdout, stderr } = res;
  return stdout.replace(/\n/g,'').replace(/\r/g,'');
}

async function prepare(){
	if(eventName == "push") {
		setResult(eventName, github.context.sha, branch);
	} else if(eventName == "repository_dispath") {
		if(buildSha == "") throw new Error("While triggering with repository-dispatch, buildBranch property is not set");
		if(buildBranch == "") throw new Error("While triggering with repository-dispatch,buildSha property is not set");
		setResult(eventName, buildSha, buildBranch);
		await executeBashCommand(`git checkout -f ${client_payload.buildSha}`);
	} else {
		throw new Error(`The trigger is unknown: ${github.context.eventName}. The supported triggers are push and respository-dispatch`)
	}
}

prepare().then(x => { }).catch(x => core.setFailed(x.message));