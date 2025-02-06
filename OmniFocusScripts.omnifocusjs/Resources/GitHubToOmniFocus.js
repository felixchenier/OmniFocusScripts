(() => {
	const action = new PlugIn.Action(function(selection, sender){
		// action code
		// selection options: columns, document, editor, items, nodes, outline, styles

        // Add code to run when the action is invoked
        ghRepositories = [['owner_eg_your_username_or_organization_name', 'repo_name1'],
                          ['owner_eg_your_username_or_organization_name', 'repo_name2'],
                          ['owner_eg_your_username_or_organization_name', 'repo_name3']]

		ghUserName = 'your_github_username'
		ghRepositories.forEach(processRepository)


		function processRepository(repositoryOwnerAndName) {

			// *****************************************************
			// Mark all issues complete
			// *****************************************************

			ofProject = flattenedProjects.byName(repositoryOwnerAndName[1])

			if (ofProject == null) {
				ofProject = new Project(repositoryOwnerAndName[1])
			} else {
				ofProject.markIncomplete()
			}

			ofProject.tasks.forEach(
				function complete(task){
					if (task.name.startsWith("GitHub : Issue #")) {
						task.markComplete()
					}
			})

			// *****************************************************
			// Fetch my issues from GitHub
			// Each fetch launch another fetch until we reach
			// function processCard
			// *****************************************************
			var the_url = URL.fromString(
				"https://api.github.com/repos/" +
				repositoryOwnerAndName[0] + "/" +
				repositoryOwnerAndName[1] + "/issues?assignee=" +
				ghUserName)

			the_url.fetch(function(res){
				var myCards = JSON.parse(res.toString())
				myCards.forEach(function(item) {processCard(item, repositoryOwnerAndName)})
			})
		}

		function processCard(card, repositoryOwnerAndName) {

//			console.log(repositoryName)
//			console.log(card.title)

			ofProject = flattenedProjects.byName(repositoryOwnerAndName[1])

			var taskName = "GitHub : Issue #" + card.number + " - " + card.title

			if (ofProject.note == "") {
				ofProject.note = "GitHub repository: https://github.com/" +
					repositoryOwnerAndName[0] + "/" +
					repositoryOwnerAndName[1] + "/issues\n" +
					"--------------------------------"
			}

			// Find the corresponding task in OmniFocus, create it if it doesn't exist
			function taskHasID(task){
				return task.note.startsWith("GitHub Issue #" + card.number)
			}
			var task = ofProject.tasks.find(taskHasID)
			if (task == null) {
				task = new Task(taskName, ofProject)
				task.note = "GitHub Issue #" + card.number + "\n" +
					"Issue : https://github.com/" +
					repositoryOwnerAndName[0] + "/" +
					repositoryOwnerAndName[1] + "/issues/" + card.number + "\n" +
					"Repository : https://github.com/" +
					repositoryOwnerAndName[0] + "/" +
					repositoryOwnerAndName[1] + "/issues\n" +
					"--------------------------------"
			} else {
				task.name = taskName
				task.markIncomplete()
				ofProject.markIncomplete()
			}
			// In every case:
			if (card.due_on == null) {
				task.dueDate = null
			} else {
				task.dueDate = new Date(card.due_on)
			}
		}

	});

	action.validate = function(selection, sender){
		// validation code
		// selection options: columns, document, editor, items, nodes, outline, styles
		return true
	};

	return action;
})();


