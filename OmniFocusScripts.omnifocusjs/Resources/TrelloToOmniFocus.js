(() => {
	const action = new PlugIn.Action(function(selection, sender){
		// action code
		// selection options: columns, document, editor, items, nodes, outline, styles


		// Note: after a first sync, it's possible to rename the [begin] of the Trello
		// tags in OmniFocus. For example, a tag named "Trello : Waiting" could be renamed
		// to "Trello : [Clock emoticon] Waiting" without problems.

		// These parameters can be customized.
		ofTrelloFolderName = 'Trello'  // Name of the folder to put new Trello projects in
		ofTrelloTagName = 'Trello'     // Name of the tag folder for Trello labels

		// get your key at https://trello.com/1/appKey/generate
		trelloAppKey = "7a9c099fb2f021bab40b5f35f51843ec"

		// then get your token at
		// https://trello.com/1/authorize?key=**YOURKEY**&name=TrelloToOmniFocus&expiration=never&response_type=token&scope=read
		trelloUserToken = "f44c524a321629d06c60ba9600bc05c0b31da2d94a53e155e7d646398ef7bf82"

		fetch_tags = false
	
		// *****************************************************
		// Add folder ofTrelloTagName if it doesn't already exist
		// *****************************************************
		if (fetch_tags) {
			ofTrelloTag = tags.byName(ofTrelloTagName)
			if (ofTrelloTag == null) {
				ofTrelloTag = new Tag(ofTrelloTagName)
			}
		}

		// *****************************************************
		// Add folder ofTrelloFolderName if it doesn't already exist
		// *****************************************************
		ofTrelloFolder = folders.byName(ofTrelloFolderName)
		if (ofTrelloFolder == null) {
			ofTrelloFolder = new Folder(ofTrelloFolderName)
		}
	
		ofTrelloProjects = flattenedProjects
	
		// *****************************************************
		// Mark all Trello tasks of all projects as complete
		// *****************************************************
		ofTrelloProjects.forEach(
			function complete(project){
				project.tasks.forEach(
					function complete(task){
						if (task.name.startsWith("Trello -")) {
							task.markComplete()
						}
					})
				// project.markComplete()
			})
	
		// *****************************************************
		// Fetch my cards from Trello
		// Each fetch launch another fetch until we reach
		// function processCard
		// *****************************************************
		var the_url = URL.fromString(
			"https://trello.com/1/members/my/cards?fields=idList,name,url,desc,labels,due,idBoard&key=" +
			trelloAppKey + "&token=" + trelloUserToken)

		the_url.fetch(function(res){
			var myCards = JSON.parse(res.toString())
			myCards.forEach(fetchBoard)
		})
		
		function fetchBoard(card){
			var the_url = URL.fromString(
				"https://trello.com/1/boards/" + card.idBoard +
				"?fields=name,url&key=" + trelloAppKey + "&token=" + trelloUserToken)
			the_url.fetch(function(res){
				board = JSON.parse(res.toString())
				fetchList(card, board)
			})
		}
		
		function fetchList(card, board){
			var the_url = URL.fromString(
				"https://trello.com/1/cards/" + card.id +
				"/list?fields=name&key=" + trelloAppKey + "&token=" +
				trelloUserToken)
			the_url.fetch(function(res){
				list = JSON.parse(res.toString())
				processCard(card, board, list)
			})
		}

		function processCard(card, board, list){
			//console.log(board.name + ' ' + list.name + ' ' + card.name)
			
			var projectName = board.name
			var taskName = "Trello - " + list.name + " - " + card.name
			
			// Find the corresponding project in OF, create it if it doesn't exist
			function projectHasID(project){
				return project.note.startsWith("Trello Board #" + board.id)
			}
			var project = flattenedProjects.find(projectHasID)
			if (project == null) {
				project = new Project(projectName, ofTrelloFolder)
				project.note = "Trello Board #" + board.id + "\n" +
					"Board : " + board.url + "\n" +
					"--------------------------------"
			} else {
				project.name = projectName
				project.markIncomplete()
			}

			// Find the corresponding task in OmniFocus, create it if it doesn't exist
			function taskHasID(task){
				return task.note.startsWith("Trello Card #" + card.id)
			}
			var task = project.tasks.find(taskHasID)
			if (task == null) {
				task = new Task(taskName, project)
				task.note = "Trello Card #" + card.id + "\n" +
					"Card : " + card.url + "\n" +
					"Board : " + board.url + "\n" +
					"--------------------------------"
			} else {
				task.name = taskName
				task.markIncomplete()
				project.markIncomplete()
			}
			// In every case:
			if (card.due == null) {
				task.dueDate = null
			} else {
				task.dueDate = new Date(card.due)
			}
			
			
			// Labels
			if (fetch_tags) {
			
				// Remove all tags in the task that are Trello labels
				ofTrelloTag.children.forEach(
					function deleteTask(tag){
						task.removeTag(tag)
					}
				)
			
				card.labels.forEach(
					function processLabel(label){
						tagName = label.name
						// console.log(label.name)

						// Find the corresponding tag in OmniFocus, or create it.
						function tagHasName(tag){
							return tag.name.endsWith(tagName)
						}
						var tag = ofTrelloTag.children.find(tagHasName)
						if (tag == null) {
							tag = new Tag(tagName, ofTrelloTag)
						}
					
						// Add the tag to the task in OmniFocus
						task.addTag(tag)
					
					}
				)		
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

	
