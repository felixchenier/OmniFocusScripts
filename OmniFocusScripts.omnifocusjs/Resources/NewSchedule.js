(() => {
	const action = new PlugIn.Action(function(selection, sender){

    const tagName = "🔹 Next";
	
	function getTasksWithNextTag() {

		// Fetch all tasks in the database
		const allTasks = flattenedTasks;
	
		// Filter tasks that contain the "Next" tag and map them to the desired format
		const tasksWithNextTag = allTasks
			.filter(task => task.tags.some(tag => tag.name === tagName))
			.map(task => ({
				url: "omnifocus:///task/" + task.id.primaryKey,
				name: task.name,
				estimated_duration: task.estimatedMinutes || 0
				// Default to 0 if no estimated duration
			}));
	
		return tasksWithNextTag;
	}


	function runAppleScript(script) {
		const encodedScript = encodeURIComponent(script);
		const url = `omnifocus:///execute?script=${encodedScript}`;
		URL.fromString(url).call(() => {
			console.log("AppleScript executed successfully.");
		});
	}
	
	// AppleScript to export calendar items to a temporary .ics file
	const appleScript = `
	set tempICSFile to "/tmp/TimeBlocking.ics"
	tell application "Calendar"
		set theCalendar to calendar "TimeBlocking"
		tell theCalendar
			export to tempICSFile as "ics"
		end tell
	end tell
	`;
	
	// Execute the AppleScript
	runAppleScript(appleScript);
	
	// Function to parse the .ics file and return the list of objects
function parseICSFile(filePath) {
    const file = new File(filePath);
    file.openForReading();
    const icsContent = file.read();
    file.close();

    const events = [];
    const lines = icsContent.split("\n");

    let event = {};
    lines.forEach(line => {
        if (line.startsWith("DESCRIPTION:")) {
            event.description = line.replace("DESCRIPTION:", "").trim();
        } else if (line.startsWith("DTSTART:")) {
            event.begin = new Date(line.replace("DTSTART:", "").trim());
        } else if (line.startsWith("DTEND:")) {
            event.end = new Date(line.replace("DTEND:", "").trim());
        } else if (line === "END:VEVENT") {
            events.push(event);
            event = {};
        }
    });

    return events;
}
	
	// Example of calling the function
	const tempICSFilePath = "/tmp/TimeBlocking.ics"; // Update this path as needed
	const events = parseICSFile(runAppleScript(appleScript));
	console.log(events);






	
	const tasks = getTasksWithNextTag();
	
	
	


	});

	action.validate = function(selection, sender){
		// validation code
		// selection options: columns, document, editor, items, nodes, outline, styles
		return true
	};
	
	return action;
})();
