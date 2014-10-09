function Git() {
  var GitHubApi = require("github");
  return new GitHubApi({
    version: "3.0.0",
    debug: true,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000
  });
}

module.exports = Git;
